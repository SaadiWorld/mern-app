import { useCallback, useEffect, useState } from "react";

let logoutTimer: ReturnType<typeof setTimeout>;

export const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState<Date | null>(
    null,
  );

  const login = useCallback(
    (uid: string, token: string, expirationDate?: Date) => {
      setUserId(uid);
      setToken(token);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({ userId: uid, token, expiration: tokenExpirationDate }),
      );
    },
    [],
  );

  const logout = useCallback(() => {
    setUserId(null);
    setToken(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData") || "null");
    if (
      storedData &&
      storedData.token &&
      storedData.userId &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration),
      );
    }
  }, [login]);

  return { userId, token, login, logout };
};
