import { useState } from 'react';

function Navbar({ cartCount, onOpenCart, onOpenAuth, activeSection, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-container">
        {/* Brand Logo */}
        <a href="#home" className="navbar-logo" onClick={(e) => handleLinkClick(e, 'home')}>
          <div className="logo-icon-box">
            <span className="logo-bag">🛍️</span>
          </div>
          <div className="logo-text-group">
            <span className="logo-title">ShopEase</span>
            <span className="logo-badge">ONLINE STORE</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <ul className="navbar-links">
          <li>
            <a
              href="#home"
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={(e) => handleLinkClick(e, 'home')}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#products"
              className={`nav-link ${activeSection === 'products' ? 'active' : ''}`}
              onClick={(e) => handleLinkClick(e, 'products')}
            >
              Products
            </a>
          </li>
          <li>
            <a
              href="#categories"
              className={`nav-link ${activeSection === 'categories' ? 'active' : ''}`}
              onClick={(e) => handleLinkClick(e, 'categories')}
            >
              Categories
            </a>
          </li>
        </ul>

        {/* Right Action Buttons */}
        <div className="navbar-actions">
          {/* Cart with Item Count Badge */}
          <button
            className="cart-btn"
            onClick={onOpenCart}
            aria-label="View Shopping Cart"
            id="nav-cart-btn"
          >
            <span className="cart-icon">🛒</span>
            <span className="cart-label">Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* Login Link */}
          <button
            className="login-btn"
            onClick={() => onOpenAuth('login')}
            id="nav-login-btn"
          >
            Login
          </button>

          {/* Register Button */}
          <button
            className="register-btn"
            onClick={() => onOpenAuth('register')}
            id="nav-register-btn"
          >
            Register
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <a
            href="#home"
            className="mobile-link"
            onClick={(e) => handleLinkClick(e, 'home')}
          >
            Home
          </a>
          <a
            href="#products"
            className="mobile-link"
            onClick={(e) => handleLinkClick(e, 'products')}
          >
            Products
          </a>
          <a
            href="#categories"
            className="mobile-link"
            onClick={(e) => handleLinkClick(e, 'categories')}
          >
            Categories
          </a>
          <div className="mobile-auth-row">
            <button
              className="login-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth('login');
              }}
            >
              Login
            </button>
            <button
              className="register-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth('register');
              }}
            >
              Register
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
