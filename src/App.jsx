import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/HeaderBar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
// import ProtectedRoute from "./routes/ProtectedRoute.jsx";
//11-19
import ProjectForm from "./pages/ProjectForm.jsx";

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
