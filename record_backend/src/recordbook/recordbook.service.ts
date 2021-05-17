import { Injectable } from '@nestjs/common';

import admin from 'config/adminCredentials.json';
import { RecordBook } from 'src/models/record_book';
import { SubjectMark } from 'src/models/subject_mark';
import { ContractService } from 'src/contract/contract.service';

@Injectable()
export class RecordbookService {
  
  constructor(private contracts: ContractService){}

  async initStudent(email: string) {
    const contract = await this.contracts.getContract(admin.id, 'org1');
    await contract.submitTransaction('CreateBook', email);
  }

  async getBook(email: string): Promise<RecordBook> {
    const contract = await this.contracts.getContract(email, 'org2');

    const recordResponse = await contract.evaluateTransaction(
      'ReadBook',
      email,
    );
    return JSON.parse(recordResponse.toString()) as RecordBook;
  }

  async addMark(
    identity: string,
    studentEmail: string,
    year: number,
    period: number,
    subject: string,
    mark: number,
  ) {
    const contract = await this.contracts.getContract(identity, 'org1');

    await contract.submitTransaction(
      'AddMark',
      studentEmail,
      year.toString(),
      period.toString(),
      subject,
      mark.toString(),
      identity,
    );
  }

  async updateMark(
    identity: string,
    studentEmail: string,
    year: number,
    period: number,
    subject: string,
    mark: number,
  ) {
    const contract = await this.contracts.getContract(identity, 'org1');

    await contract.submitTransaction(
      'UpdateMark',
      studentEmail,
      year.toString(),
      period.toString(),
      subject,
      mark.toString(),
      identity,
    );
  }

  async getSubjectMarks(
    identity: string,
    year: number,
    period: number,
    subject: string,
  ) {
    const contract = await this.contracts.getContract(identity, 'org1');

    const response = await contract.evaluateTransaction('ReadSubjectStudents',
      year.toString(), period.toString(), subject);
    
    return JSON.parse(response.toString('utf-8')) as SubjectMark;
  }
}
