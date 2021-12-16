import { createContext } from "react";
function noop() {}

export const AuthContext = createContext({
  token: null,
  userId: null,
  userLogin: null,
  login: noop,
  logout: noop,
  isAuthent: false,
  isAdmin: false,
  isBlock: false,
});
