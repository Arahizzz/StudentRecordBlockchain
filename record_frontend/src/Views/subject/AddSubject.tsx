import { Center } from "@chakra-ui/layout";
import {
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
import { addSubject } from "../../services/subject_service";

export default function AddSubject() {
  const [name, setName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [period, setPeriod] = useState(1);

  const onAdd = async () => {
    if (name)
      try {
        toast("Adding subject...");
        await addSubject(name, year, period);
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
        <Heading>Add subject</Heading>
        <FormControl id="email">
          <FormLabel>Name:</FormLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl id="email">
          <FormLabel>Year:</FormLabel>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          />
        </FormControl>
        <FormControl id="email">
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
