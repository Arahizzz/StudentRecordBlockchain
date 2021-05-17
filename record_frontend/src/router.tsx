import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import React, { Component, ComponentType, Suspense } from "react";
import Login from "./Views/Login";
import { Spinner } from "@chakra-ui/spinner";
import { Center } from "@chakra-ui/layout";
import Register from "./Views/Register";
import RecordBookPage from "./Views/RecordBook";
import { useRecoilValue } from "recoil";
import { authenticationState } from "./state/authentication";
import { UserRole } from "./models/user";
import NavigationMenu from "./Views/Menu";
import { Box } from "@chakra-ui/react";
import AddMark from "./Views/AddMark";
import AddSubject from "./Views/subject/AddSubject";
import AddTeacherSubject from "./Views/subject/AddTeacherSubject";
import AddStudentSubject from "./Views/subject/AddStudentSubject";
import Loader from "./Loader";
import SubjectMarks from "./Views/subject/SubjectMarks";

function getDefaultRoute(role?: UserRole) {
  switch (role) {
    case UserRole.Admin:
      return "/register";
    case UserRole.Teacher:
      return "/addMark";
    case UserRole.Student:
      return "/recordBook";
    default:
      return "/login";
  }
}

export default function AppRouter() {
  const auth = useRecoilValue(authenticationState);
  const role = auth?.role;
  console.log(role);

  const isAdmin = role === UserRole.Admin;
  const isStudent = role === UserRole.Student;
  const isTeacher = role === UserRole.Teacher;

  return (
    <BrowserRouter>
      <NavigationMenu></NavigationMenu>
      <Box marginLeft="75px">
        <Suspense fallback={<Loader/>}>
          <Switch>
            <Route path="/login" component={Login}></Route>
            {GuardedRoute(RecordBookPage, "/recordBook", isStudent)}
            {GuardedRoute(Register, "/register", isAdmin)}
            {GuardedRoute(AddMark, "/addMark", isTeacher)}
            {GuardedRoute(AddSubject, "/subject/add", isAdmin)}
            {GuardedRoute(
              AddTeacherSubject,
              "/subject/addTeacher",
              isTeacher || isAdmin
            )}
            {GuardedRoute(
              AddStudentSubject,
              "/subject/addStudent",
              isTeacher || isAdmin
            )}
            {GuardedRoute(SubjectMarks, "/subject/marks", isTeacher || isAdmin)}
            <Route
              path="/"
              render={() => <Redirect to={getDefaultRoute(role)}></Redirect>}
            ></Route>
          </Switch>
        </Suspense>
      </Box>
    </BrowserRouter>
  );
}

function GuardedRoute(
  Component: ComponentType,
  path: string,
  guard: boolean,
  ...props: any[]
) {
  return (
    <Route
      {...props}
      path={path}
      render={() =>
        guard ? <Component></Component> : <Redirect to="/login"></Redirect>
      }
    ></Route>
  );
}
