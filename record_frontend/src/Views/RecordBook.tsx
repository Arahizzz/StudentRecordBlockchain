import { Heading } from "@chakra-ui/layout";
import { Td, Th, Tr } from "@chakra-ui/react";
import { Table, Tbody, Thead } from "@chakra-ui/table";
import React from "react";
import { Redirect } from "react-router";
import { useRecoilValue } from "recoil";
import { Period } from "../models/record_book";
import { recordBookState } from "../state/record_book";

export default function RecordBookPage() {
  const book = useRecoilValue(recordBookState);

  if (!book) return <Redirect to="/login"></Redirect>;

  return (
    <div>
      <Heading>Record Book</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Subject</Th>
            <Th>Teacher</Th>
            <Th>Mark</Th>
            <Th>Mark (ECTS)</Th>
          </Tr>
        </Thead>
        <Tbody>{book.periods.map(p => <RenderPeriod key={`${p.year}/${p.num}`} period={p}/>)}</Tbody>
      </Table>
    </div>
  );
}

function RenderPeriod({ period }: { period: Period }) {
  return (
    <>
      <Tr>
        <Td colSpan={4}>
          <Heading as="h6" fontSize="22px">
            Year: {period.year} Period: {period.num}
          </Heading>
        </Td>
      </Tr>
      {period.marks.map((m) => (
        <Tr key={m.subject}>
          <Td>{m.subject}</Td>
          <Td>{m.teacher}</Td>
          <Td>{m.mark}</Td>
          <Td>{markECTS(m.mark)}</Td>
        </Tr>
      ))}
    </>
  );
}

function markECTS(mark: number): string {
  if (mark > 90) return "A";
  if (mark >= 85) return "B";
  if (mark >= 75) return "C";
  if (mark >= 65) return "D";
  if (mark >= 60) return "E";
  if (mark >= 35) return "FX";
  return "F";
}
