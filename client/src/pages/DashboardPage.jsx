import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

// ── Sidebar nav items ──────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "profile", icon: "👤", label: "Profile" },
  { id: "favourites", icon: "❤️", label: "Favourites" },
  { id: "orders", icon: "📦", label: "Order History" },
  { id: "mealplan", icon: "🗓️", label: "Meal Plan" },
];

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const MEALS = ["breakfast", "lunch", "dinner"];

// ── Mock favourite recipes ─────────────────────────────────────────
const MOCK_RECIPES = [
  {
    id: "avocado-toast",
    title: "Avocado Toast",
    tag: "Breakfast",
    img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400&q=80",
  },
  {
    id: "green-smoothie",
    title: "Green Smoothie",
    tag: "Smoothie",
    img: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80",
  },
  {
    id: "quinoa-bowl",
    title: "Quinoa Bowl",
    tag: "Lunch",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
  },
  {
    id: "berry-parfait",
    title: "Berry Parfait",
    tag: "Snack",
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
  },
];

// ── Mock orders ────────────────────────────────────────────────────
const MOCK_ORDERS = [
  {
    orderId: "ORD-001",
    createdAt: "2024-03-15",
    total: 42.5,
    status: "delivered",
    items: [{ name: "Green Bowl" }, { name: "Mango Smoothie" }],
  },
  {
    orderId: "ORD-002",
    createdAt: "2024-03-20",
    total: 28.0,
    status: "confirmed",
    items: [{ name: "Quinoa Salad" }, { name: "Lemon Water" }],
  },
  {
    orderId: "ORD-003",
    createdAt: "2024-03-22",
    total: 55.75,
    status: "pending",
    items: [{ name: "Detox Kit x2" }],
  },
];

// ── Spinner ────────────────────────────────────────────────────────
const Spinner = () => (
  <div className="spinner-wrap">
    <div className="spinner" />
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// PROFILE TAB
// ═══════════════════════════════════════════════════════════════════
const ProfileTab = ({ dbUser, setDbUser }) => {
  const [form, setForm] = useState({
    name: dbUser?.name || "",
    bio: dbUser?.bio || "",
    avatar: dbUser?.avatar || "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const { data } = await api.put("/users/profile", form);
      setDbUser(data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const initials =
    form.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Profile</h1>
        <p className="dashboard-subtitle">Manage your personal information</p>
      </div>

      <div className="profile-card">
        {error && <div className="alert-error">⚠️ {error}</div>}
        {success && (
          <div className="alert-success">✅ Profile updated successfully!</div>
        )}

        <div className="avatar-upload">
          <div className="avatar-preview">
            {form.avatar ? <img src={form.avatar} alt="Avatar" /> : initials}
          </div>
          <div className="avatar-info">
            <h4>{form.name || "Your Name"}</h4>
            <p>Update your photo by pasting an image URL below</p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Jane Smith"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Avatar URL</label>
              <input
                className="form-input"
                value={form.avatar}
                onChange={(e) =>
                  setForm((p) => ({ ...p, avatar: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
            <div className="form-group form-grid-full">
              <label className="form-label">
                Bio{" "}
                <span style={{ color: "var(--light-text)", fontWeight: 400 }}>
                  ({300 - form.bio.length} chars left)
                </span>
              </label>
              <textarea
                className="form-input"
                rows={3}
                style={{ resize: "vertical", borderRadius: "12px" }}
                value={form.bio}
                maxLength={300}
                onChange={(e) =>
                  setForm((p) => ({ ...p, bio: e.target.value }))
                }
                placeholder="Tell us a little about yourself and your health goals…"
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn-primary-custom"
            disabled={saving}
          >
            {saving ? "Saving…" : "💾 Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// FAVOURITES TAB
// ═══════════════════════════════════════════════════════════════════
const FavouritesTab = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/users/favourites");
        setFavourites(data.favourites || []);
      } catch {
        // fallback to mock IDs if backend unavailable
        setFavourites(["avocado-toast", "green-smoothie"]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRemove = async (id) => {
    try {
      await api.post(`/users/favourites/${id}`);
      setFavourites((prev) => prev.filter((f) => f !== id));
    } catch {
      setFavourites((prev) => prev.filter((f) => f !== id));
    }
  };

  const savedRecipes = MOCK_RECIPES.filter((r) => favourites.includes(r.id));

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Saved Recipes</h1>
        <p className="dashboard-subtitle">
          {savedRecipes.length} recipe{savedRecipes.length !== 1 ? "s" : ""}{" "}
          saved
        </p>
      </div>

      {savedRecipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌿</div>
          <p className="empty-text">
            No saved recipes yet.
            <br />
            Browse recipes and tap the heart to save them here.
          </p>
        </div>
      ) : (
        <div className="recipe-grid">
          {savedRecipes.map((r) => (
            <div className="recipe-card" key={r.id}>
              <img
                src={r.img}
                alt={r.title}
                className="recipe-card-img"
                loading="lazy"
              />
              <div className="recipe-card-body">
                <span className="recipe-card-tag">{r.tag}</span>
                <h3
                  className="recipe-card-title"
                  style={{ marginTop: "0.4rem" }}
                >
                  {r.title}
                </h3>
                <button
                  className="fav-remove"
                  onClick={() => handleRemove(r.id)}
                >
                  🗑 Remove from favourites
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* "Discover more" section */}
      <div style={{ marginTop: "2.5rem" }}>
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.2rem",
            marginBottom: "1rem",
          }}
        >
          Discover More
        </h3>
        <div className="recipe-grid">
          {MOCK_RECIPES.filter((r) => !favourites.includes(r.id)).map((r) => (
            <div className="recipe-card" key={r.id} style={{ opacity: 0.85 }}>
              <img
                src={r.img}
                alt={r.title}
                className="recipe-card-img"
                loading="lazy"
              />
              <div className="recipe-card-body">
                <span className="recipe-card-tag">{r.tag}</span>
                <h3
                  className="recipe-card-title"
                  style={{ marginTop: "0.4rem" }}
                >
                  {r.title}
                </h3>
                <button
                  className="fav-remove"
                  style={{ color: "var(--primary-green)" }}
                  onClick={async () => {
                    try {
                      await api.post(`/users/favourites/${r.id}`);
                    } catch {}
                    setFavourites((prev) => [...prev, r.id]);
                  }}
                >
                  🤍 Save recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// ORDERS TAB
// ═══════════════════════════════════════════════════════════════════
const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/users/orders");
        setOrders(data.orders?.length ? data.orders : MOCK_ORDERS);
      } catch {
        setOrders(MOCK_ORDERS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Order History</h1>
        <p className="dashboard-subtitle">
          {orders.length} order{orders.length !== 1 ? "s" : ""} placed
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p className="empty-text">No orders yet. Start shopping!</p>
        </div>
      ) : (
        orders.map((order, i) => (
          <div className="order-card" key={order.orderId || i}>
            <div className="order-header">
              <div>
                <p className="order-id">Order #{order.orderId}</p>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="order-total">£{Number(order.total).toFixed(2)}</p>
                <span className={`order-badge badge-${order.status}`}>
                  {order.status}
                </span>
              </div>
            </div>
            <div className="order-items">
              {order.items?.map((item, j) => (
                <span className="order-item-tag" key={j}>
                  {item.name}
                  {item.qty > 1 ? ` ×${item.qty}` : ""}
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MEAL PLAN TAB
// ═══════════════════════════════════════════════════════════════════
const MealPlanTab = () => {
  const EMPTY_PLAN = DAYS.reduce(
    (acc, d) => ({ ...acc, [d]: { breakfast: "", lunch: "", dinner: "" } }),
    {},
  );
  const [plan, setPlan] = useState(EMPTY_PLAN);
  const [saving, setSaving] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/users/mealplan");
        if (data.mealPlan) setPlan({ ...EMPTY_PLAN, ...data.mealPlan });
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (day, meal, value) => {
    setPlan((p) => ({ ...p, [day]: { ...p[day], [meal]: value } }));
  };

  const saveDay = async (day) => {
    setSaving((s) => ({ ...s, [day]: true }));
    try {
      for (const meal of MEALS) {
        await api.put("/users/mealplan", {
          day,
          meal,
          recipe: plan[day][meal],
        });
      }
    } catch {
    } finally {
      setSaving((s) => ({ ...s, [day]: false }));
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Weekly Meal Plan</h1>
        <p className="dashboard-subtitle">
          Plan your healthy meals for the week
        </p>
      </div>

      <div className="meal-plan-grid">
        {DAYS.map((day) => (
          <div className="meal-day-card" key={day}>
            <div className="meal-day-header">{day}</div>
            <div className="meal-slots">
              {MEALS.map((meal) => (
                <div className="meal-slot" key={meal}>
                  <span className="meal-slot-label">{meal}</span>
                  <input
                    type="text"
                    className="meal-slot-input"
                    placeholder={`e.g. ${meal === "breakfast" ? "Oat porridge" : meal === "lunch" ? "Green salad" : "Veggie stir-fry"}`}
                    value={plan[day]?.[meal] || ""}
                    onChange={(e) => handleChange(day, meal, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <button
              className="meal-save-btn"
              onClick={() => saveDay(day)}
              disabled={saving[day]}
            >
              {saving[day]
                ? "Saving…"
                : "💾 Save " + day.charAt(0).toUpperCase() + day.slice(1)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════════
const DashboardPage = () => {
  const { dbUser, setDbUser, logout, firebaseUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

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

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileTab
            dbUser={
              dbUser || {
                name: firebaseUser?.displayName || "",
                bio: "",
                avatar: "",
              }
            }
            setDbUser={setDbUser}
          />
        );
      case "favourites":
        return <FavouritesTab />;
      case "orders":
        return <OrdersTab />;
      case "mealplan":
        return <MealPlanTab />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* User info */}
        <div
          style={{
            padding: "0 1.5rem 1.5rem",
            borderBottom: "1px solid var(--border)",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div
              className="avatar-preview"
              style={{ width: 46, height: 46, fontSize: "1rem" }}
            >
              {dbUser?.avatar ? (
                <img src={dbUser.avatar} alt="avatar" />
              ) : (
                initials
              )}
            </div>
            <div>
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--dark-text)",
                  lineHeight: 1.2,
                }}
              >
                {dbUser?.name || firebaseUser?.displayName || "User"}
              </p>
              <p style={{ fontSize: "0.72rem", color: "var(--light-text)" }}>
                {firebaseUser?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="sidebar-section">
          <p className="sidebar-label">Menu</p>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar-link ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                textAlign: "left",
              }}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div
          className="sidebar-section"
          style={{
            marginTop: "auto",
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
          }}
        >
          <button
            className="sidebar-link"
            onClick={() => navigate("/")}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              textAlign: "left",
            }}
          >
            <span className="icon">🏠</span> Back to Site
          </button>
          <button
            className="sidebar-link"
            onClick={handleLogout}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              textAlign: "left",
              color: "#e53e3e",
            }}
          >
            <span className="icon">🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">{renderTab()}</main>
    </div>
  );
};

export default DashboardPage;
