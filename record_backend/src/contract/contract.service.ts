import { Injectable } from '@nestjs/common';
import { CAService } from 'src/ca/ca.service';
import { channels } from 'src/ca/channel-info'
import { Gateway } from 'fabric-network';



@Injectable()
export class ContractService {
  constructor(private caService: CAService) {}

  private getOptions(identity: string, organization: string) {
    return {
      identity,
      wallet: this.caService.wallets[organization],
      discovery: { enabled: true, asLocalhost: true },
    };
  }

  public async getContract(identity: string, organization: string) {
    const options = this.getOptions(identity, organization);
    const gateway = new Gateway();
    await gateway.connect(channels[organization], options);
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('record_book');
    return contract;
  }
}
