import {
  Center,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { UserRole } from "../models/user";
import { register } from "../services/auth_sevice";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState(UserRole.Student);

  const onRegister = async () => {
    if (email && password)
      try {
        toast("Adding user...");
        await register({ username: email, password }, role);
        toast("User registered succesfully!", { type: "success" });
        setEmail("");
        setPassword("");
      } catch (err) {
        toast("Could not save user", { type: "error" });
      }
  };

  return (
    <Center h="100vh">
      <VStack w="xl">
        <Heading>Register</Heading>
        <FormControl id="role">
          <FormLabel>Role:</FormLabel>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value={UserRole.Student}>Student</option>
            <option value={UserRole.Teacher}>Teacher</option>
            <option value={UserRole.Admin}>Admin</option>
          </select>
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email:</FormLabel>
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password:</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button onClick={onRegister}>Register</Button>
      </VStack>
    </Center>
  );
}
