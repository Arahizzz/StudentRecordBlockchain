import axios, { AxiosInstance } from "axios";
import { API_URL } from "../constants";
import { Credentials } from "../models/credentials";
import { UserRole } from "../models/user";
import { AuthenticationInfo } from "../state/authentication";
import { getBearerHeader, getToken, setToken } from "../utils";

export async function login(creds: Credentials): Promise<AuthenticationInfo> {
  const response = await axios.post<{ access_token: string; role: UserRole }>(
    `${API_URL}/auth/login`,
    creds
  );
  const data = response.data;
  setToken(data.access_token);
  return { login: creds.username, role: data.role };
}

export async function register(
  creds: Credentials,
  role: UserRole,
) {
  await axios.post<{ access_token: string; role: UserRole }>(
    `${API_URL}/auth/register${role}`,
    creds,
    {headers: getBearerHeader()}
  );
}
