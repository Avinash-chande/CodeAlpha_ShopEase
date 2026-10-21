function Hero({ onShopNow, onExploreCategories }) {
  return (
    <section className="hero-container" id="home">
      <div className="hero-content-wrapper">
        {/* Left Column: Text Content */}
        <div className="hero-left">
          <div className="hero-tagline">
            <span className="tag-sparkle">✨</span>
            <span className="tag-text">ONLINE SHOPPING FOR EVERYONE</span>
          </div>

          <h1 className="hero-headline">
            Everyday essentials,<br />
            <span className="hero-headline-highlight">made easier.</span>
          </h1>

          <p className="hero-subtext">
            Discover affordable electronics, stationery, backpacks, home essentials,
            and daily lifestyle products. Find everything you need in one place with
            fast, reliable delivery across India.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn-primary-orange"
              onClick={onShopNow}
              id="hero-shop-now-btn"
            >
              <span>Shop Now</span>
              <span className="btn-arrow">→</span>
            </button>

            <button
              className="btn-secondary-outline"
              onClick={onExploreCategories}
              id="hero-explore-categories-btn"
            >
              Explore Categories
            </button>
          </div>

          {/* Quick Trust Badges */}
          <div className="hero-trust-badges">
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <span className="trust-text">Fast Delivery Across India</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <span className="trust-text">100% Genuine Products</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <span className="trust-icon">⭐</span>
              <span className="trust-text">4.9/5 Customer Rating</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Desk Setup & Floating Card */}
        <div className="hero-right">
          <div className="hero-image-frame">
            <img
              src="/images/student_desk_hero.jpg"
              alt="Clean workspace with laptop, books, backpack, headphones, and stationery"
              className="hero-main-image"
              loading="eager"
            />

            {/* Small Floating Card near the image */}
            <div className="hero-floating-card">
              <div className="floating-card-icon">
                <span>🛍️</span>
              </div>
              <div className="floating-card-info">
                <span className="floating-card-title">Everyday essentials</span>
                <span className="floating-card-subtitle">
                  Quality products delivered to your door
                </span>
              </div>
            </div>

            {/* Subtle secondary floating badge for discount */}
            <div className="hero-floating-badge">
              <span className="badge-flame">🔥</span>
              <span className="badge-text">Up to 40% Off on Selected Deals</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
