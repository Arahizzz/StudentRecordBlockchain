export function getToken() {
  return sessionStorage["token"];
}

export function setToken(token: string) {
  sessionStorage["token"] = token;
}

export function getBearerHeader() {
  return {
    Authorization: "Bearer " + getToken(),
  };
}
