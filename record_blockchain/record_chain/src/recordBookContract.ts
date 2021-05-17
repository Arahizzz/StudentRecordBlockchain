import {
  Context,
  Contract,
  Info,
  Transaction,
} from "fabric-contract-api";
import { Iterators } from "fabric-shim";
import { Query } from "./query";
import { RecordBook, Period } from "./recordBookState";
import { SubjectInfo } from "./subjectInfo";

@Info({ title: "RecordBook", description: "Smart contract for student books" })
export class RecordBookContract extends Contract {
  private static getStudentKey(ctx: Context, id: string): string {
    return ctx.stub.createCompositeKey("student", [id]);
  }

  private static getSubjectKey(ctx: Context, name: string, year: number, period: number): string {
    return ctx.stub.createCompositeKey("subject", [year.toString(), period.toString(), name]);
  }

  @Transaction()
  public async CreateBook(ctx: Context, email: string) {
    const book: RecordBook = {
      email,
      periods: [],
    };

    await RecordBookContract.SaveBook(ctx, book);
  }


  @Transaction()
  public async AddSubject(ctx: Context, subject: string, year: number, period: number) {
    const subjectInfo: SubjectInfo = {
      subject,
      year,
      period,
      students: [],
      teachers: []
    };

    await RecordBookContract.SaveSubject(ctx, subjectInfo);
  }

  @Transaction(false)
  public async ReadBook(ctx: Context, email: string): Promise<RecordBook> {
    const bookJSON = await ctx.stub.getState(
      RecordBookContract.getStudentKey(ctx, email)
    );
    if (!bookJSON || bookJSON.length === 0) {
      throw new Error(`The book of student ${email} does not exist`);
    }
    return JSON.parse(bookJSON.toString()) as RecordBook;
  }

  @Transaction(false)
  public async ReadSubject(ctx: Context, subject: string, year: number, period: number): Promise<SubjectInfo> {
    const subjectJSON = await ctx.stub.getState(
      RecordBookContract.getSubjectKey(ctx, subject, year, period)
    );
    if (!subjectJSON || subjectJSON.length === 0) {
      throw new Error(`The subject ${subject} does not exist`);
    }
    return JSON.parse(subjectJSON.toString()) as SubjectInfo;
  }

  private static async SaveBook (ctx: Context, book: RecordBook) {
    await ctx.stub.putState(
      RecordBookContract.getStudentKey(ctx, book.email),
      Buffer.from(JSON.stringify(book))
    );
  }

  private static async SaveSubject (ctx: Context, subject: SubjectInfo) {
    await ctx.stub.putState(
      RecordBookContract.getSubjectKey(ctx, subject.subject, subject.year, subject.period),
      Buffer.from(JSON.stringify(subject))
    );
  }

  @Transaction(false)
  public async ReadSubjectStudents(
    ctx: Context,
    year: number,
    period: number,
    subject: string
  ) {
    const query: Query = {
      selector: {
        periods: {
          $elemMatch: {
            $and: [
              { year: year },
              { num: period },
              {
                marks: {
                  $elemMatch: {
                    subject: subject,
                  },
                },
              },
            ],
          },
        },
      },
    };
    const response = await ctx.stub.getQueryResult(JSON.stringify(query));
    const studentRecords = await RecordBookContract._GetAllResults<RecordBook>(
      response
    );
    const students = studentRecords.map((r) => {
      return {
        student: r.email,
        mark: r.periods
          .find((p) => p.year === year && p.num === period)
          ?.marks.find((m) => m.subject === subject)?.mark,
      };
    });
    return students;
  }

  @Transaction()
  public async AddTeacherSubject(ctx: Context, email: string, subject: string, year: number, period: number) {
    RecordBookContract.ensureUniversityStaff(ctx);
    const subjectInfo = await this.ReadSubject(ctx, subject, year, period);
    subjectInfo.teachers.push(email);
    await RecordBookContract.SaveSubject(ctx, subjectInfo);
  }

  @Transaction()
  public async AddStudentSubject(
    ctx: Context,
    student: string,
    subject: string,
    year: number,
    period: number
  ) {
    const subjectInfo = await this.ReadSubject(ctx, subject, year, period);
    subjectInfo.students.push(student);
    await RecordBookContract.SaveSubject(ctx, subjectInfo);
  }

  @Transaction()
  public async RemoveTeacherSubject(
    ctx: Context,
    teacher: string,
    subject: string,
    year: number,
    period: number
  ) {
    RecordBookContract.ensureUniversityStaff(ctx);
    const subjectInfo = await this.ReadSubject(ctx, subject, year, period);
    subjectInfo.teachers = subjectInfo.teachers.filter((s) => s !== teacher);
    await RecordBookContract.SaveSubject(ctx, subjectInfo);
  }

  @Transaction()
  public async RemoveStudentSubject(
    ctx: Context,
    student: string,
    subject: string,
    year: number,
    period: number
  ) {
    const subjectInfo = await this.ReadSubject(ctx, subject, year, period);
    subjectInfo.students = subjectInfo.students.filter((s) => s !== student);
    await RecordBookContract.SaveSubject(ctx, subjectInfo);
  }

  @Transaction()
  public async AddMark(
    ctx: Context,
    studentEmail: string,
    year: number,
    period: number,
    subject: string,
    mark: number,
    teacher: string
  ): Promise<void> {
    RecordBookContract.ensureUniversityStaff(ctx);
    await this._ensureTeacherStudentSubject(ctx, teacher, studentEmail, subject, year, period);

    let book = await this.ReadBook(ctx, studentEmail);

    let periodInfo = book.periods.find(
      (p) => p.year === year && p.num === period
    );
    if (!periodInfo) {
      periodInfo = { year, num: period, marks: [] };
      RecordBookContract.insertSorted(
        book.periods,
        periodInfo,
        RecordBookContract.periodComparator
      );
    }

    if (periodInfo.marks.some(m => m.subject === subject))
      throw new Error(`Student ${studentEmail} already has mark from subject ${subject}.`)

    periodInfo.marks.push({ subject, teacher, mark });

    await RecordBookContract.SaveBook(ctx, book);
  }

  @Transaction()
  public async UpdateMark(
    ctx: Context,
    studentEmail: string,
    year: number,
    period: number,
    subject: string,
    mark: number,
    teacher: string
  ): Promise<void> {
    RecordBookContract.ensureUniversityStaff(ctx);
    let book = await this.ReadBook(ctx, studentEmail);

    let markInfo = book.periods
      .find((p) => p.year === year && p.num === period)
      ?.marks.find((m) => m.subject === subject);

    if (!markInfo)
      throw new Error(
        `Student ${studentEmail} doesn't have mark for subject ${subject}.`
      );

    markInfo.mark = mark;
    if (teacher) markInfo.teacher = teacher;

    await RecordBookContract.SaveBook(ctx, book);
  }

  private async _ensureTeacherStudentSubject(
    ctx: Context,
    teacher: string,
    student: string,
    subject: string,
    year: number,
    period: number
  ) {
    const subjectInfo = await this.ReadSubject(ctx, subject, year, period);
    if (!subjectInfo.teachers.some((s) => s === teacher))
      throw new Error(
        `Teacher ${teacher} isn't enrolled to the subject ${subject}.`
      );
    
    if (!subjectInfo.students.some((s) => s === student))
      throw new Error(
        `Student ${student} isn't enrolled to the subject ${subject}.`
      );
  }

  private static async _GetAllResults<T>(
    iterator: Iterators.StateQueryIterator
  ) {
    let allResults: T[] = [];
    let res = await iterator.next();
    while (!res.done) {
      allResults.push(JSON.parse(res.value.value.toString()) as T);
      res = await iterator.next();
    }
    iterator.close();
    return allResults;
  }

  private static ensureUniversityStaff(ctx: Context) {
    if (ctx.clientIdentity.getMSPID() !== "Org1MSP")
      throw new Error("You do not have access to this function");
  }

  private static insertSorted<T>(
    array: T[],
    element: T,
    comparator: (_1: T, _2: T) => number
  ) {
    let i;
    for (i = 0; i < array.length && comparator(array[i], element) < 0; i++) {}
    array.splice(i, 0, element);
  }

  private static periodComparator(p1: Period, p2: Period) {
    if (p1.year < p2.year) return -1;
    if (p1.year > p2.year) return 1;
    if (p1.num < p2.num) return -1;
    if (p1.num > p2.num) return 1;
    return 0;
  }
}
