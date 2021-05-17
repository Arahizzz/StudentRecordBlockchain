import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AddMarkRequest } from 'src/models/add_mark';
import { RecordbookService } from './recordbook.service';
import { CurrentUser } from './user.decorator';
import { UserInfo, UserRole } from 'src/models/user';

@Controller('recordbook')
@UseGuards(JwtAuthGuard)
export class RecordbookController {
  constructor(private recordService: RecordbookService) {}

  @Get()
  async getBook(@CurrentUser() user: UserInfo) {
    const login = user.email;
    const book = await this.recordService.getBook(login);
    return book;
  }

  @Get('subjectMarks')
  async getSubjectMarks(
    @CurrentUser() user: UserInfo,
    @Query('year') year: number,
    @Query('period') period: number,
    @Query('subject') subject: string,
  ) {
    const marks = await this.recordService.getSubjectMarks(user.email, year, period, subject);
    return marks;
  }

  @Post('addMark')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Teacher)
  async addMark(
    @CurrentUser() teacher: UserInfo,
    @Body() mark: AddMarkRequest,
  ) {
    await this.recordService.addMark(
      teacher.email,
      mark.student,
      mark.year,
      mark.period,
      mark.subject,
      mark.mark,
    );
  }
}
