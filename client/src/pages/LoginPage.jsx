import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setAuthError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setAuthError(getFriendlyError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!form.email.trim()) {
      setErrors({ email: "Enter your email first" });
      return;
    }
    try {
      await resetPassword(form.email);
      setResetSent(true);
    } catch {
      setAuthError("Could not send reset email. Check the address.");
    }
  };

  const getFriendlyError = (msg) => {
    if (
      msg.includes("user-not-found") ||
      msg.includes("wrong-password") ||
      msg.includes("invalid-credential")
    )
      return "Incorrect email or password.";
    if (msg.includes("too-many-requests"))
      return "Too many attempts. Try again later.";
    return "Login failed. Please try again.";
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          Gossi<span>p</span>
        </Link>
        <p className="auth-tagline">🌿 Eat Clean, Live Healthy</p>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        {authError && <div className="alert-error">⚠️ {authError}</div>}
        {resetSent && (
          <div className="alert-success">
            ✅ Reset link sent! Check your inbox.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="password-wrap">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPwd((p) => !p)}
                aria-label="Toggle password"
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <p className="field-error">{errors.password}</p>
            )}
          </div>

          <div style={{ textAlign: "right", marginBottom: "1.25rem" }}>
            <button
              type="button"
              onClick={handleReset}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary-green)",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="btn-primary-custom w-100 justify-content-center"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
