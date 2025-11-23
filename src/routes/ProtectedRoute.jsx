// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth(); // 인증 상태 확인

  // 로그인하지 않으면 로그인 페이지로 리다이렉트
  if (!isAuthed) {
    return <Navigate to="/login" />;
  }

  // 로그인한 사용자는 자식 컴포넌트를 렌더링
  return children;
}
