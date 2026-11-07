import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./App.css";
import MainNavigation from "./components/shared/Navigation/MainNavigation";
import { AuthContext } from "./context/auth-context";
import { useAuth } from "./hooks/auth-hook";
import LoadingSpinner from "./components/shared/UIElements/LoadingSpinner";

const NewPlace = lazy(() => import("./pages/places/NewPlace"));
const UpdatePlace = lazy(() => import("./pages/places/UpdatePlace"));
const UserPlaces = lazy(() => import("./pages/places/UserPlaces"));
const Users = lazy(() => import("./pages/user/Users"));
const Auth = lazy(() => import("./pages/user/Auth"));

const App = () => {
  const { userId, token, login, logout } = useAuth();

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, userId, token, login, logout }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
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
          </Suspense>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
