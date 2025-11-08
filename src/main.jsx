// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";     // ← Tailwind 전역 CSS (꼭 존재해야 함)

createRoot(document.getElementById("root")).render(<App />);
