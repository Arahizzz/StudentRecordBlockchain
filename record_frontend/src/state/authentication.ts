import { atom, selector } from "recoil";
import { UserRole } from "../models/user";

export interface AuthenticationInfo {
  login: string;
  role: UserRole;
}

let authInfo = null;
if (sessionStorage['login']) {
    authInfo = {
        login: sessionStorage['login'],
        role: sessionStorage['role'] as UserRole
    }
}

export const authenticationState = atom<AuthenticationInfo | null>({
    key: 'authenticationState',
    default: authInfo
});