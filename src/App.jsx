// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/HeaderBar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import ProjectForm from "./pages/ProjectForm.jsx";
import UserProjects from "./pages/UserProjects.jsx"; // User Projects 관리 페이지
import AdminProjects from "./pages/AdminProjects.jsx"; // Admin Projects 관리 페이지
import AdminUserManagement from "./pages/AdminUserManagement.jsx"; // Admin User 관리 페이지
import ProtectedRoute from "./routes/ProtectedRoute.jsx"; // Management 페이지 보호
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx"; // 프로젝트 상세보기 페이지 


function Shell() {
  const { isAuthed, logout } = useAuth();

  return (
    <>
      <Header isAuthed={isAuthed} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects/new" element={<ProjectForm mode="create" />} />
        <Route path="/projects/:id/edit" element={<ProjectForm mode="edit" />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} /> 


        {/* User 프로젝트 관리 페이지 */}
        <Route
          path="/user/projects"
          element={
            <ProtectedRoute>
              <UserProjects />
            </ProtectedRoute>
          }
        />
        
        {/* Admin 프로젝트 관리 페이지 */}
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <AdminProjects />
            </ProtectedRoute>
          }
        />
        
        {/* Admin 유저 관리 페이지 */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUserManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
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
