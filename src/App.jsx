// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/HeaderBar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import ProjectForm from "./pages/ProjectForm.jsx";
import UserProjects from "./pages/UserProjects.jsx";
import AdminProjects from "./pages/AdminProjects.jsx";
import AdminUserManagement from "./pages/AdminUserManagement.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";

function Shell() {
  const { ready, isAuthed, logout } = useAuth();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-700">
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header isAuthed={isAuthed} onLogout={logout} />
      {/* 각 페이지에서 컨테이너를 쓰고 있으니 여기서는 그냥 Routes만 */}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/projects/new"
          element={
            <ProtectedRoute>
              <ProjectForm />
            </ProtectedRoute>
          }
        />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />

        <Route
          path="/me/projects"
          element={
            <ProtectedRoute>
              <UserProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <AdminProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUserManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AuthProvider>
  );
}
