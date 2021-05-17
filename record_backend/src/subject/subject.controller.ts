import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { UserInfo, UserRole } from 'src/models/user';
import { CurrentUser } from 'src/recordbook/user.decorator';
import { SubjectService } from './subject.service';

@Controller('subject')
@UseGuards(JwtAuthGuard)
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Post('add')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  async addSubject(
    @CurrentUser() user: UserInfo,
    @Body('subject') subject: string,
    @Body('year') year: number,
    @Body('period') period: number
  ) {
    await this.subjectService.createSubject(user.email, subject, year, period);
  }

  @Post('addStudent')
  @UseGuards(JwtAuthGuard)
  async addStudent(
    @CurrentUser() user: UserInfo,
    @Body('subject') subject: string,
    @Body('student') student: string,
    @Body('year') year: number,
    @Body('period') period: number
  ) {
    await this.subjectService.addStudentToSubject(user, subject, student, year, period);
  }

  @Post('addTeacher')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin, UserRole.Teacher)
  async addTeacher(
    @CurrentUser() user: UserInfo,
    @Body('subject') subject: string,
    @Body('teacher') teacher: string,
    @Body('year') year: number,
    @Body('period') period: number
  ) {
    await this.subjectService.addTeacherToSubject(user.email, subject, teacher, year, period);
  }

  @Delete('removeStudent')
  async removeStudent(
    @CurrentUser() user: UserInfo,
    @Body('subject') subject: string,
    @Body('student') student: string,
    @Body('year') year: number,
    @Body('period') period: number
  ) {
      this.subjectService.removeStudentFromSubject(user, subject, student, year, period);
  }
    
  @Delete('removeTeacher')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin, UserRole.Teacher)
  async removeTeacher(
    @CurrentUser() user: UserInfo,
    @Body('subject') subject: string,
    @Body('teacher') teacher: string,
    @Body('year') year: number,
    @Body('period') period: number
  ) {
    await this.subjectService.removeTeacherFromSubject(user.email, subject, teacher, year, period);
  }
}
