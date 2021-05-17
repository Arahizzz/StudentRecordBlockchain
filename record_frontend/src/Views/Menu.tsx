import { Button } from "@chakra-ui/button";
import {
  AddIcon,
  CloseIcon,
  EditIcon,
  ExternalLinkIcon,
  HamburgerIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Slide,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { ComponentType } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { UserRole } from "../models/user";
import { authenticationState } from "../state/authentication";

export default function NavigationMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const auth = useRecoilValue(authenticationState);
  const role = auth?.role;

  const isAdmin = role === UserRole.Admin;
  const isStudent = role === UserRole.Student;
  const isTeacher = role === UserRole.Teacher;

  return (
    <>
      <div
        style={{ position: "absolute", left: "5px", top: "5px", zIndex: 100 }}
      >
        <IconButton
          ref={btnRef}
          onClick={onOpen}
          icon={<HamburgerIcon />}
          aria-label="Open Control Panel"
        />
      </div>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <IconButton
            aria-label="Close Control Panel"
            icon={<CloseIcon />}
            onClick={onClose}
            color="black"
          />
          <DrawerBody>
            <VStack
              alignContent="start"
              color="black"
              bg="white"
              rounded="md"
              h="100vh"
              w="300px"
              overflowY="scroll"
            >
              <MenuLink to="/login">Login</MenuLink>
              {isStudent && (
                <>
                  <MenuLink to="/recordBook">Record Book</MenuLink>
                </>
              )}
              {isAdmin && (
                <>
                  <MenuLink to="/register">Register User</MenuLink>
                  <MenuLink to="/subject/add">Create subject</MenuLink>
                </>
              )}
              {isTeacher && <MenuLink to="/addMark">Add Mark</MenuLink>}
              {(isTeacher || isAdmin) && (
                <>
                  <MenuLink to="/subject/addTeacher">
                    Add teacher to subject
                  </MenuLink>
                  <MenuLink to="/subject/addStudent">
                    Enroll student into subject
                  </MenuLink>
                  <MenuLink to="/subject/marks">Subject Marks</MenuLink>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function MenuLink({
  children,
  to,
}: {
  children: ComponentType | string;
  to: string;
}) {
  return <Link to={to}>{children}</Link>;
}
