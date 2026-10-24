import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null as string | null,
  token: null as string | null,
  login: (_uid: string, _token: string) => {},
  logout: () => {},
});
