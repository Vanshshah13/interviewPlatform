import { BrowserRouter, Routes, Route , Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateInterview from "./pages/CreateInterview";
import Interview from "./pages/Interview";
import Result from "./pages/Result";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateInterview />
            </ProtectedRoute>
          }
        />

        <Route path="/interview/:id" element={<Interview />} />
        <Route path="/result/:id" element={<Result />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
