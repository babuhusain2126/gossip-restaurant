import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    else if (form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
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
      await register(form.email, form.password, form.name.trim());
      navigate("/dashboard");
    } catch (err) {
      setAuthError(getFriendlyError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const getFriendlyError = (msg) => {
    if (msg.includes("email-already-in-use"))
      return "This email is already registered. Try logging in.";
    if (msg.includes("weak-password"))
      return "Password is too weak. Use at least 6 characters.";
    return "Registration failed. Please try again.";
  };

  const field = (
    key,
    label,
    type = "text",
    placeholder = "",
    autoComplete = "",
  ) => (
    <div className="form-group">
      <label className="form-label" htmlFor={key}>
        {label}
      </label>
      <input
        id={key}
        type={type}
        autoComplete={autoComplete}
        className={`form-input ${errors[key] ? "error" : ""}`}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
      />
      {errors[key] && <p className="field-error">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          Gossi<span>p</span>
        </Link>
        <p className="auth-tagline">🌿 Eat Clean, Live Healthy</p>

        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Join thousands of healthy eaters</p>

        {authError && <div className="alert-error">⚠️ {authError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {field("name", "Full Name", "text", "Jane Smith", "name")}
          {field("email", "Email Address", "email", "you@example.com", "email")}

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="password-wrap">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="Min. 6 characters"
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

          <div className="form-group">
            <label className="form-label" htmlFor="confirm">
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              className={`form-input ${errors.confirm ? "error" : ""}`}
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={(e) =>
                setForm((p) => ({ ...p, confirm: e.target.value }))
              }
            />
            {errors.confirm && <p className="field-error">{errors.confirm}</p>}
          </div>

          {/* Password strength meter */}
          {form.password && (
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: "3px",
                      borderRadius: "4px",
                      background:
                        i <= Math.min(Math.floor(form.password.length / 3), 4)
                          ? ["#e53e3e", "#dd6b20", "#d69e2e", "#38a169"][
                              Math.min(
                                Math.floor(form.password.length / 3),
                                4,
                              ) - 1
                            ]
                          : "var(--border)",
                    }}
                  />
                ))}
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--light-text)" }}>
                {form.password.length < 6
                  ? "Too short"
                  : form.password.length < 9
                    ? "Fair"
                    : form.password.length < 12
                      ? "Good"
                      : "Strong"}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary-custom w-100 justify-content-center"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <p
          style={{
            fontSize: "0.72rem",
            color: "var(--light-text)",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          By registering you agree to our{" "}
          <a href="#terms" style={{ color: "var(--primary-green)" }}>
            Terms
          </a>{" "}
          &amp;{" "}
          <a href="#privacy" style={{ color: "var(--primary-green)" }}>
            Privacy Policy
          </a>
          .
        </p>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
