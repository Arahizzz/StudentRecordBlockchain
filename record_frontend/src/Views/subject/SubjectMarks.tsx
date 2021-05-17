import { Heading, HStack } from "@chakra-ui/layout";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Th,
  Tr,
  Thead,
  Tbody,
  Td,
} from "@chakra-ui/react";
import React, { Suspense, useState } from "react";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import Loader from "../../Loader";
import { Subject } from "../../models/subject";
import { SubjectMark } from "../../models/subject_mark";
import { getSubjectMarks } from "../../services/record_service";

const subjectInfo = atom<Subject | null>({
  key: "subjectInfo",
  default: null,
});

const studentMarks = selector<SubjectMark[] | null>({
  key: "subjectMarks",
  get: async ({ get }) => {
    const subject = get(subjectInfo);
    if (!subject) return null;
    return await getSubjectMarks(subject);
  },
});

export default function SubjectMarks() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [period, setPeriod] = useState(1);
  const [subject, setSubject] = useState("");
  const [_, setSubjectInfo] = useRecoilState(subjectInfo);
  const marks = useRecoilValue(studentMarks);

  const loadSubject = () => {
    if (subject) setSubjectInfo({ year, period, subject });
  };

  return (
    <div>
      <Heading>Subject Marks</Heading>
      <HStack>
        <FormControl id="year">
          <FormLabel>Year:</FormLabel>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          />
        </FormControl>
        <FormControl id="period">
          <FormLabel>Period:</FormLabel>
          <Input
            type="number"
            value={period}
            onChange={(e) => setPeriod(parseInt(e.target.value))}
          />
        </FormControl>
        <FormControl id="subject">
          <FormLabel>Subject:</FormLabel>
          <Input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </FormControl>
        <Button onClick={loadSubject}>Load</Button>
      </HStack>
      <Suspense fallback={<Loader/>}>
        {marks !== null && (
          <>
            <Table>
              <Thead>
                <Tr>
                  <Th>Student</Th>
                  <Th>Mark</Th>
                </Tr>
              </Thead>
              <Tbody>
                {marks.map((m) => (
                  <Tr key={m.student}>
                    <Td>{m.student}</Td>
                    <Td>{m.mark}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        )}
      </Suspense>
    </div>
  );
}
