import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Center, Container, Heading, VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/react";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { UserRole } from "../models/user";
import { addMark } from "../services/record_service";
import { authenticationState } from "../state/authentication";

export default function AddMark() {
  const auth = useRecoilValue(authenticationState);

  // if (auth?.role !== UserRole.Teacher && auth?.role !== UserRole.Admin)
  //   return <Redirect to="/login"></Redirect>;

  const [student, setStudent] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [period, setPeriod] = useState(1);
  const [subject, setSubject] = useState<string>();
  const [mark, setMark] = useState<number>();

  const onAdd = async () => {
    if (subject && mark)
      try {
        toast("Adding mark...");
        await addMark({ student, year, period, subject, mark });
        toast('Mark added successfully', { type: 'success' });
      } catch (err) {
        toast('Could not add mark', { type: 'error' });
      }
  };

  return (
    <Center h="100vh">
      <VStack w="xl">
        <Heading>Add mark</Heading>
        <FormControl id="email">
          <FormLabel>Student:</FormLabel>
          <Input
            type="text"
            value={student}
            onChange={(e) => setStudent(e.target.value)}
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Year:</FormLabel>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          />
        </FormControl>
        <FormControl id="password">
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
        <FormControl id="password">
          <FormLabel>Mark:</FormLabel>
          <Input
            type="number"
            value={mark}
            onChange={(e) => setMark(parseInt(e.target.value))}
          />
        </FormControl>
        <Button onClick={onAdd}>Add</Button>
      </VStack>
    </Center>
  );
}
