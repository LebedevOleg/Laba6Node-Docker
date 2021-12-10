import { useState, useCallback, useEffect } from "react";

const storageName = "userData";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [ready, setReady] = useState(false);
  const [userLogin, setUserLogin] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [isBlock, setIsBlock] = useState(null);

  const login = useCallback((megaToken, id, name, admin, block) => {
    setUserId(id);
    setToken(megaToken);
    setUserLogin(name);
    setIsAdmin(admin);
    setIsBlock(block);
    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId: id,
        token: megaToken,
        userLogin: name,
        isAdmin: admin,
        isBlock: block,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setUserLogin(null);
    setIsAdmin(null);
    setIsBlock(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      login(
        data.token,
        data.userId,
        data.userLogin,
        data.isAdmin,
        data.isBlock
      );
    }
    setReady(true);
  }, [login]);

  return { login, logout, token, userId, userLogin, ready, isAdmin, isBlock };
};
