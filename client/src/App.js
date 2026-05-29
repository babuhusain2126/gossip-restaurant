import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import "./assets/styles/App.css";
import FeedPage from "./pages/FeedPage";
import RecipesPage from "./pages/RecipesPage";
import QueriesPage from "./pages/QueriesPage";
import DealsPage from "./pages/DealsPage";
/**
 * App Root
 * - Wraps everything in AuthProvider (global auth state)
 * - React Router v6 routing
 * - AOS initialization
 * - Scroll-to-top button
 */
function App() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    if (window.AOS)
      window.AOS.init({
        once: true,
        duration: 1000,
        easing: "ease-out-cubic",
        offset: 60,
      });
    const onScroll = () => setShowScroll(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        {/* <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes> */}

        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/feed" element={<FeedPage />} />

          <Route path="/recipes" element={<RecipesPage />} />

          <Route path="/queries" element={<QueriesPage />} />

          <Route path="/deals" element={<DealsPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Scroll to top */}
        <button
          className={`scroll-top-btn ${showScroll ? "visible" : ""}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
