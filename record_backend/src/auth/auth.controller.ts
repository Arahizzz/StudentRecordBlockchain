import { Controller, Post, UseGuards, Request, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { CurrentUser } from 'src/recordbook/user.decorator';
import { UserInfo } from 'src/models/user';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('registerStudent')
  async registerStudent(
    @Body('username') login: string,
    @Body('password') password: string,
  ) {
    await this.authService.registerStudent(login, password);
  }

  @Post('registerTeacher')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async registerTeacher(
    @Body('username') login: string,
    @Body('password') password: string,
  ) {
    await this.authService.registerTeacher(login, password);
  }

  @Post('registerAdmin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async registerAdmin(
    @Body('username') login: string,
    @Body('password') password: string,
  ) {
    await this.authService.registerAdmin(login, password);
  }

  @Get('info')
  @UseGuards(JwtAuthGuard)
  async getUserInfo (@CurrentUser() user: UserInfo) {
    return user;
  }
}
