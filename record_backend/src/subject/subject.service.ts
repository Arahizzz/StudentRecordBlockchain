import { Injectable } from '@nestjs/common';
import { ContractService } from 'src/contract/contract.service';
import { UserInfo, UserRole } from 'src/models/user';

@Injectable()
export class SubjectService {
    constructor(private contracts: ContractService) { }
    
    async createSubject (identity: string, subject: string, year: number, period: number) {
        const contract = await this.contracts.getContract(identity, 'org1');

        await contract.submitTransaction('AddSubject', subject, year.toString(), period.toString());
    }

    async addStudentToSubject (identity: UserInfo, subject: string, student: string, year: number, period: number) {
        const org = identity.role === UserRole.Student ? 'org2' : 'org1';
        const contract = await this.contracts.getContract(identity.email, org);

        await contract.submitTransaction('AddStudentSubject', student, subject, year.toString(), period.toString());
    }

    async addTeacherToSubject (identity: string, subject: string, teacher: string, year: number, period: number) {
        const contract = await this.contracts.getContract(identity, 'org1');

        await contract.submitTransaction('AddTeacherSubject', teacher, subject, year.toString(), period.toString());
    }

    async removeTeacherFromSubject (identity: string, subject: string, teacher: string, year: number, period: number) {
        const contract = await this.contracts.getContract(identity, 'org1');

        await contract.submitTransaction('RemoveTeacherSubject', teacher, subject, year.toString(), period.toString());
    }

    async removeStudentFromSubject (identity: UserInfo, subject: string, student: string, year: number, period: number) {
        const org = identity.role === UserRole.Student ? 'org2' : 'org1';
        const contract = await this.contracts.getContract(identity.email, org);

        await contract.submitTransaction('RemoveStudentSubject', student, subject, year.toString(), period.toString());
    }
}
