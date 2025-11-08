// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./index.css";

function Home() {
  return <div className="p-6"><h1 className="text-xl font-bold">Home</h1></div>;
}

export default function App() {
  const [isAuthed, setAuthed] = useState(false);
  return (
    <BrowserRouter>
      {/* Header 컴포넌트는 나중에 추가 */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* 나중에 /login, /register, /projects/:id 등 추가 */}
      </Routes>
    </BrowserRouter>
  );
}