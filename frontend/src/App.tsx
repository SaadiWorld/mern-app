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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const login = useCallback((uid: string) => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
      <BrowserRouter>
        <MainNavigation />
        <main>
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path=":userId/places" element={<UserPlaces />} />

            {isLoggedIn ? (
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
