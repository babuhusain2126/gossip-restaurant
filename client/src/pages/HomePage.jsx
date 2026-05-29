import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";

const FOOD_IMAGES = {
  smoothieBowl:
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80",
  saladBowl:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  healthyBowl:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
  greens:
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
};

const FEATURES = [
  {
    title: "Fresh Greens",
    desc: "Hand-picked organic greens sourced daily from local farms. Packed with vitamins and antioxidants for a vibrant life.",
    btn: "Explore",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
    delay: 0,
  },
  {
    title: "Smoothie Sale",
    desc: "Premium cold-pressed smoothies crafted from the finest organic fruits. Refreshing, nutrient-dense and delicious.",
    btn: "Order",
    img: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&q=80",
    delay: 150,
  },
  {
    title: "Organic Bowls",
    desc: "Build your perfect bowl with seasonal ingredients and wholesome grains — balanced nutrition in every spoonful.",
    btn: "View More",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
    delay: 300,
  },
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (window.AOS)
      window.AOS.init({
        once: true,
        duration: 1000,
        easing: "ease-out-cubic",
        offset: 60,
      });
  }, []);

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section id="home" className="hero-section">
        <div className="hero-circle-bg" aria-hidden="true" />
        <div className="food-float food-float-tl">
          <img src={FOOD_IMAGES.smoothieBowl} alt="" />
        </div>
        <div className="food-float food-float-bl">
          <img src={FOOD_IMAGES.saladBowl} alt="" />
        </div>
        <div className="food-float food-float-r">
          <img src={FOOD_IMAGES.healthyBowl} alt="" />
        </div>
        <div className="food-float food-float-tr">
          <img src={FOOD_IMAGES.greens} alt="" />
        </div>
        <span className="deco-item deco-lemon" aria-hidden>
          🍋
        </span>
        <span className="deco-item deco-avocado" aria-hidden>
          🥑
        </span>
        <span className="deco-item deco-tomato" aria-hidden>
          🍅
        </span>
        <span className="deco-item deco-leaf1" aria-hidden>
          🌿
        </span>
        <span className="deco-item deco-leaf2" aria-hidden>
          🌱
        </span>

        <div className="container" style={{ maxWidth: 1320 }}>
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-7 hero-content">
              <div className="hero-badge" data-aos="fade-down">
                <span className="dot" />
                &nbsp;100% Organic &amp; Natural
              </div>
              <h1
                className="hero-heading"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Eat Clean,
                <br />
                <em>Live Healthy.</em>
              </h1>
              <p
                className="hero-subtext"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Discover wholesome meals crafted from the freshest organic
                ingredients. Every bite brings you closer to a healthier,
                happier you.
              </p>
              <div
                className="hero-cta-group"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="btn-primary-custom btn-hero"
                >
                  🌿 {isAuthenticated ? "My Dashboard" : "Get Started"}
                </Link>
                <a href="#features" className="btn-outline-custom">
                  Explore Menu ↓
                </a>
              </div>
              <div
                className="hero-stats"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                {[
                  ["200+", "Fresh Recipes"],
                  ["50K+", "Happy Customers"],
                  ["100%", "Organic"],
                ].map(([n, l]) => (
                  <div className="stat-item" key={l}>
                    <span className="stat-num">{n}</span>
                    <span className="stat-label">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-inner">
          {Array(2)
            .fill(null)
            .map((_, i) => (
              <React.Fragment key={i}>
                <span>🌿 Fresh Daily</span>
                <span className="dot">◆</span>
                <span>🥗 100% Organic</span>
                <span className="dot">◆</span>
                <span>🥤 Cold Pressed Juices</span>
                <span className="dot">◆</span>
                <span>🌾 Farm to Table</span>
                <span className="dot">◆</span>
                <span>🥣 Wholesome Bowls</span>
                <span className="dot">◆</span>
                <span>🍋 No Preservatives</span>
                <span className="dot">◆</span>
              </React.Fragment>
            ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="features-section">
        <div className="container" style={{ maxWidth: 1320 }}>
          <div className="row justify-content-between align-items-end mb-5">
            <div className="col-12 col-md-6" data-aos="fade-right">
              <span className="section-label">Our Specialties</span>
              <h2 className="section-title">
                Fresh <em>Smoothies</em>
              </h2>
            </div>
            <div className="col-12 col-md-5 mt-3 mt-md-0" data-aos="fade-left">
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "var(--light-text)",
                  lineHeight: 1.7,
                }}
              >
                From farm to table — every ingredient is carefully selected to
                nourish your body and delight your taste buds.
              </p>
            </div>
          </div>
          <div className="row g-4">
            {FEATURES.map((f) => (
              <div className="col-12 col-md-6 col-lg-4" key={f.title}>
                <div
                  className="feature-card"
                  data-aos="fade-up"
                  data-aos-delay={f.delay}
                >
                  <img
                    src={f.img}
                    alt={f.title}
                    className="feature-card-img"
                    loading="lazy"
                  />
                  <h3 className="feature-card-title">{f.title}</h3>
                  <p className="feature-card-desc">{f.desc}</p>
                  <a href="#feed" className="btn-outline-custom">
                    {f.btn} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="feed" className="gallery-section">
        <div className="container" style={{ maxWidth: 1320 }}>
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="section-label">The Bowls We Love</span>
            <h2 className="section-title">
              Crafted with <em>Care</em>
            </h2>
          </div>
          <div className="row g-4 align-items-stretch">
            <div className="col-12 col-lg-4" data-aos="fade-right">
              <div className="gallery-img-wrap gallery-img-large h-100">
                <img
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80"
                  alt="Healthy bowl"
                  loading="lazy"
                  style={{ height: "100%" }}
                />
              </div>
            </div>
            <div
              className="col-12 col-lg-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="gallery-text-col h-100">
                <span className="section-label">Why Choose Us</span>
                <h2 className="section-title" style={{ fontSize: "2rem" }}>
                  Pure Ingredients,
                  <br />
                  <em>Pure Taste.</em>
                </h2>
                <p style={{ fontSize: "0.9rem", marginTop: "0.75rem" }}>
                  We believe healthy food should never compromise on flavour.
                  Every bowl is a celebration of fresh, seasonal produce sourced
                  ethically from local organic farms.
                </p>
                <ul className="gallery-feature-list">
                  {[
                    "Certified organic & pesticide-free",
                    "Locally sourced seasonal produce",
                    "No artificial additives",
                    "Nutritionist-approved recipes",
                  ].map((t) => (
                    <li key={t}>
                      <span className="check">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="btn-primary-custom"
                >
                  {isAuthenticated
                    ? "View My Recipes →"
                    : "Join & Save Recipes →"}
                </Link>
              </div>
            </div>
            <div
              className="col-12 col-lg-4"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="gallery-img-wrap gallery-img-small h-100">
                <img
                  src="https://images.unsplash.com/photo-1613861214310-1be1202c3d74?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Fresh citrus bowl"
                  loading="lazy"
                  style={{ height: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-section">
        <div className="container" style={{ maxWidth: 1320 }}>
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="footer-brand">
                gossi<span>p</span>
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.4)",
                  marginTop: "0.3rem",
                }}
              >
                Eat Clean, Live Healthy.
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.45)",
                  marginTop: "1rem",
                  maxWidth: 260,
                  lineHeight: 1.65,
                }}
              >
                Premium organic food crafted with care. Nourish your body,
                delight your senses.
              </p>
            </div>
            <div className="col-6 col-md-2 offset-md-1">
              <h4 className="footer-heading">Navigate</h4>
              <ul className="footer-links">
                {["Home", "Feed", "Recipes", "Queries", "Deals"].map((l) => (
                  <li key={l}>
                    <a href={`#${l.toLowerCase()}`}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-6 col-md-2">
              <h4 className="footer-heading">Account</h4>
              <ul className="footer-links">
                <li>
                  <Link
                    to="/register"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      textDecoration: "none",
                    }}
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      textDecoration: "none",
                    }}
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      textDecoration: "none",
                    }}
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-12 col-md-3">
              <h4 className="footer-heading">Stay in Touch</h4>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "1rem",
                }}
              >
                Get weekly recipes and wellness tips.
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="email"
                  placeholder="you@email.com"
                  aria-label="Email"
                  style={{
                    flex: 1,
                    padding: "0.55rem 1rem",
                    borderRadius: 50,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.07)",
                    color: "white",
                    fontSize: "0.8rem",
                    outline: "none",
                    fontFamily: "var(--font-body)",
                  }}
                />
                <button
                  style={{
                    background: "var(--primary-green)",
                    border: "none",
                    borderRadius: 50,
                    padding: "0.55rem 1.1rem",
                    color: "white",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                  }}
                >
                  Join →
                </button>
              </div>
            </div>
          </div>
          <div className="footer-divider" />
          <p className="footer-copy">
            © 2026 Gossip. All rights reserved. Made with 🌿 for a healthier
            world.
          </p>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
