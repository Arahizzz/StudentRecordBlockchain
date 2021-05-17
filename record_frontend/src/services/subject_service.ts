import axios from "axios";
import { API_URL } from "../constants";
import { getBearerHeader } from "../utils";

async function addSubject(subject: string, year: number, period: number) {
  await axios.post(
    `${API_URL}/subject/add`,
    { subject, year, period },
    { headers: getBearerHeader() }
  );
}

async function addStudentToSubject(subject: string, student: string, year: number, period: number) {
  await axios.post(
    `${API_URL}/subject/addStudent`,
    { subject, student, year, period },
    { headers: getBearerHeader() }
  );
}

async function addTeacherToSubject(subject: string, teacher: string, year: number, period: number) {
  await axios.post(
    `${API_URL}/subject/addTeacher`,
    { subject, teacher, year, period },
    { headers: getBearerHeader() }
  );
}

async function removeTeacherFromSubject(subject: string, teacher: string, year: number, period: number) {
  await axios.delete(`${API_URL}/subject/removeTeacher`, {
    headers: getBearerHeader(),
    data: { subject, teacher, year, period },
  });
}

async function removeStudentFromSubject(subject: string, student: string, year: number, period: number) {
    await axios.delete(`${API_URL}/subject/removeTeacher`, {
      headers: getBearerHeader(),
      data: { subject, student, year, period },
    });
}

export { addSubject, addStudentToSubject, addTeacherToSubject, removeStudentFromSubject, removeTeacherFromSubject };
