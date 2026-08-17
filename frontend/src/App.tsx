import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import NewPlace from "./pages/places/NewPlace";
import Users from "./pages/user/Users";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Users />} />

      <Route path="places">
        <Route index element={<Navigate to="new" replace />} />
        <Route path="new" element={<NewPlace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
