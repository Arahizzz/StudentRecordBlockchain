import axios from "axios";
import { API_URL } from "../constants";
import { AddMarkRequest } from "../models/add_mark";
import { RecordBook } from "../models/record_book";
import { Subject } from "../models/subject";
import { SubjectMark } from "../models/subject_mark";
import { getBearerHeader } from "../utils";

export async function getRecordBook(email: string) {
  const response = await axios.get<RecordBook>(`${API_URL}/recordBook`, {
    headers: getBearerHeader(),
  });
  return response.data;
}

export async function addMark(mark: AddMarkRequest) {
  await axios.post(`${API_URL}/recordBook/addMark`, mark, {
    headers: getBearerHeader(),
  });
}

export async function getSubjectMarks(subject: Subject) {
  const response = await axios.get<SubjectMark[]>(
    `${API_URL}/recordBook/subjectMarks`, {params: subject, headers: getBearerHeader()}
  );
  return response.data;
}
