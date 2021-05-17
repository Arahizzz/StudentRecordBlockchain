import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Center, Container, Heading, VStack } from "@chakra-ui/layout";
import { Box, FormControl, FormLabel } from "@chakra-ui/react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState, useRecoilValue } from "recoil";
import { login } from "../services/auth_sevice";
import { authenticationState } from "../state/authentication";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const [_, setAuth] = useRecoilState(authenticationState);

  const onLogin = async () => {
    try {
      const auth = await login({ username: email, password });
      setAuth(auth);
      sessionStorage["login"] = auth.login;
      sessionStorage["role"] = auth.role;
      history.push("/");
    } catch (err) {
      toast("Could not login", { type: "error" });
    }
  };

  return (
    <Center h="100vh">
      <VStack w="md">
        <Heading>Sign In</Heading>
        <FormControl id="email">
          <FormLabel>Login:</FormLabel>
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
        <Button onClick={onLogin}>Login</Button>
      </VStack>
    </Center>
  );
}
