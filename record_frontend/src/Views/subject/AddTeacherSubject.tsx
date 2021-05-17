import {
  Center,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { addTeacherToSubject } from "../../services/subject_service";

export default function AddStudentSubject() {
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [period, setPeriod] = useState(1);

  const onAdd = async () => {
    if (subject && teacher)
      try {
        toast("Adding teacher...");
        await addTeacherToSubject(subject, teacher, year, period);
        toast("Added succesfully", { type: "success" });
      } catch (err) {
        toast(
          <>
            <Heading as="h5" fontSize="18px">Could not add student</Heading>
            {axios.isAxiosError(err) && <p>{err.response?.data.message}</p>}
          </>,
          { type: "error" }
        );
      }
  };

  return (
    <Center h="100vh">
      <VStack w="xl">
        <Heading>Add teacher to subject</Heading>
        <FormControl id="subject">
          <FormLabel>Subject name:</FormLabel>
          <Input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </FormControl>
        <FormControl id="teacher">
          <FormLabel>Teacher email:</FormLabel>
          <Input
            type="text"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
          />
        </FormControl><FormControl id="year">
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
        <Button onClick={onAdd}>Add</Button>
      </VStack>
    </Center>
  );
}
