import { Injectable } from '@nestjs/common';
import { Wallet, Wallets } from 'fabric-network';
import organizations from 'config/organizations.json';
import adminCredentials from 'config/adminCredentials.json';
import { channels } from './channel-info';
import path from 'path';
import FabricCAServices from 'fabric-ca-client';

@Injectable()
export class CAService {
  public wallets: Record<string, Wallet> = {};

  constructor() {
    for (const [orgName, org] of Object.entries(organizations)) {
      Wallets.newFileSystemWallet(
        path.join(process.cwd(), 'identities', orgName),
      )
        .then((w) => (this.wallets[orgName] = w))
        .then(async (w) => {
          const client = this.buildCAClient(channels[orgName], org.caHostName);
          await this.ensureAdmin(client, w, org.orgMspId);
        });
    }
  }

  async registerUser(login: string, organization: string, role: string) {
    const org = organizations[organization];
    const channel = channels[organization];

    const client = this.buildCAClient(channel, org.caHostName);

    await this.registerAndEnrollUser(
      client,
      this.wallets[organization],
      org.orgMspId,
      login,
      org.affiliation,
      role,
    );
  }

  buildCAClient(
    ccp: Record<string, any>,
    caHostName: string,
  ): FabricCAServices {
    const caInfo = ccp.certificateAuthorities[caHostName];
    return new FabricCAServices(
      caInfo.url,
      { trustedRoots: caInfo.tlsCACerts.pem, verify: false },
      caInfo.caName,
    );
  }

  async ensureAdmin(
    caClient: FabricCAServices,
    wallet: Wallet,
    orgMspId: string,
  ): Promise<void> {
    try {
      const identity = await wallet.get(adminCredentials.id);
      if (identity) {
        return;
      }

      const enrollment = await caClient.enroll({
        enrollmentID: adminCredentials.id,
        enrollmentSecret: adminCredentials.password,
      });
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: orgMspId,
        type: 'X.509',
      };
      await wallet.put(adminCredentials.id, x509Identity);
      console.log(
        'Successfully enrolled admin user and imported it into the wallet',
      );
    } catch (error) {
      console.error(`Failed to enroll admin user : ${error}`);
    }
  }

  async registerAndEnrollUser(
    caClient: FabricCAServices,
    wallet: Wallet,
    orgMspId: string,
    userId: string,
    affiliation: string,
    role: string,
  ): Promise<void> {
    // Check to see if user already exists
    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
      throw new Error(
        `An identity for the user ${userId} already exists in the wallet`,
      );
    }

    // Must use an admin to register a new user
    const adminIdentity = await wallet.get(adminCredentials.id);

    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(
      adminIdentity,
      adminCredentials.id,
    );

    const secret = await caClient.register(
      {
        affiliation,
        enrollmentID: userId,
        role,
      },
      adminUser,
    );
    const enrollment = await caClient.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret,
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      type: 'X.509',
    };
    await wallet.put(userId, x509Identity);
  }
}
