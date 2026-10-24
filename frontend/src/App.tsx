import { useCallback, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./App.css";
import NewPlace from "./pages/places/NewPlace";
import UpdatePlace from "./pages/places/UpdatePlace";
import UserPlaces from "./pages/places/UserPlaces";
import Users from "./pages/user/Users";
import MainNavigation from "./components/shared/Navigation/MainNavigation";
import { AuthContext } from "./context/auth-context";
import Auth from "./pages/user/Auth";

const App = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback((uid: string, token: string) => {
    setUserId(uid);
    setToken(token);
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, userId, token, login, logout }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path=":userId/places" element={<UserPlaces />} />

            {token ? (
              <>
                <Route path="places/new" element={<NewPlace />} />
                <Route path="places/:placeId" element={<UpdatePlace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="auth" element={<Auth />} />
                <Route path="*" element={<Navigate to="/auth" replace />} />
              </>
            )}
          </Routes>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
