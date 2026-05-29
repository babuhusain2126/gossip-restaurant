import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, dbUser, firebaseUser, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const initials = (dbUser?.name || firebaseUser?.displayName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const NAV_LINKS = ["Home", "Feed", "Recipes", "Queries", "Deals"];

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-custom ${scrolled ? "scrolled" : ""}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container" style={{ maxWidth: "1320px" }}>
        {/* Logo */}
        <Link className="navbar-brand navbar-brand-text" to="/">
          Gossi<span>p</span>
        </Link>

        {/* Hamburger */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ color: "var(--dark-text)" }}
        >
          ☰
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          {/* Center links */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-1">
            {NAV_LINKS.map((link, idx) => (
              <li className="nav-item" key={link}>
                <Link
                  className={`nav-link nav-link-custom${idx === 0 ? " active" : ""}`}
                  to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side — auth-aware */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {isAuthenticated ? (
              <div style={{ position: "relative" }} ref={dropRef}>
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className="nav-avatar"
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  {dbUser?.avatar ? (
                    <img src={dbUser.avatar} alt="avatar" />
                  ) : (
                    initials
                  )}
                </button>

                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 10px)",
                      background: "white",
                      border: "1px solid var(--border)",
                      borderRadius: "14px",
                      padding: "0.5rem",
                      minWidth: "190px",
                      boxShadow: "var(--shadow-md)",
                      zIndex: 9999,
                    }}
                  >
                    <div
                      style={{
                        padding: "0.5rem 1rem 0.75rem",
                        borderBottom: "1px solid var(--border)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "var(--dark-text)",
                        }}
                      >
                        {dbUser?.name || firebaseUser?.displayName}
                      </p>
                      <p
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--light-text)",
                        }}
                      >
                        {firebaseUser?.email}
                      </p>
                    </div>
                    {[
                      { label: "👤 My Profile", to: "/dashboard" },
                      { label: "❤️ Favourites", to: "/dashboard" },
                      { label: "📦 Orders", to: "/dashboard" },
                      { label: "🗓️ Meal Plan", to: "/dashboard" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: "block",
                          padding: "0.5rem 1rem",
                          fontSize: "0.85rem",
                          color: "var(--dark-text)",
                          textDecoration: "none",
                          borderRadius: "8px",
                          transition: "var(--transition)",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.background = "var(--bg-main)")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.background = "transparent")
                        }
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div
                      style={{
                        borderTop: "1px solid var(--border)",
                        marginTop: "0.25rem",
                        paddingTop: "0.25rem",
                      }}
                    >
                      <button
                        onClick={handleLogout}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "0.5rem 1rem",
                          fontSize: "0.85rem",
                          color: "#e53e3e",
                          background: "none",
                          border: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          borderRadius: "8px",
                          fontFamily: "var(--font-body)",
                          transition: "var(--transition)",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.background = "#fff5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.background = "transparent")
                        }
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-outline-custom"
                  style={{ padding: "0.55rem 1.25rem" }}
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary-custom">
                  Reserve Place →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
