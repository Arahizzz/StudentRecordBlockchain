import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CAService } from 'src/ca/ca.service';
import { UserInfo, UserRole } from 'src/models/user';
import { RecordbookService } from 'src/recordbook/recordbook.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private caService: CAService,
    private recordService: RecordbookService,
  ) {}

  validateUser(login: string, password: string) {
    return this.userService.comparePasswords(login, password);
  }

  async login (user: UserInfo) {
    const payload = { email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role
    };
  }

  async registerStudent(login: string, password: string) {
    await this.userService.addUser(login, password, UserRole.Student);
    await this.caService.registerUser(login, 'org2', 'client');
    await this.recordService.initStudent(login);
  }

  async registerTeacher(login: string, password: string) {
    await this.userService.addUser(login, password, UserRole.Teacher);
    await this.caService.registerUser(login, 'org1', 'client');
  }

  async registerAdmin(login: string, password: string) {
    await this.userService.addUser(login, password, UserRole.Admin);
    await this.caService.registerUser(login, 'org1', 'admin');
  }
}
