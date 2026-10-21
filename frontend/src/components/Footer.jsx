function Footer({ onNavigate }) {
  const handleLink = (e, target) => {
    e.preventDefault();
    if (target === 'home' || target === 'products' || target === 'categories') {
      onNavigate(target);
    } else {
      alert(`Navigating to ${target} (Informational page)`);
    }
  };

  return (
    <footer className="footer-section">
      <div className="footer-top-container">
        {/* Brand Column */}
        <div className="footer-brand-col">
          <div className="footer-logo">
            <span className="footer-logo-icon">🛍️</span>
            <span className="footer-logo-title">ShopEase</span>
          </div>
          <p className="footer-tagline">
            Your trusted online shopping companion. Affordable electronics,
            stationery, backpacks, home essentials, and daily lifestyle products.
          </p>
          <div className="footer-student-callout">
            <span className="callout-icon">🇮🇳</span>
            <span>Fast, reliable delivery to customers across India.</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links-group">
          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-menu">
              <li>
                <a href="#home" onClick={(e) => handleLink(e, 'home')}>
                  Home
                </a>
              </li>
              <li>
                <a href="#products" onClick={(e) => handleLink(e, 'products')}>
                  All Products
                </a>
              </li>
              <li>
                <a href="#categories" onClick={(e) => handleLink(e, 'categories')}>
                  Categories
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-menu">
              <li>
                <a href="#about" onClick={(e) => handleLink(e, 'About')}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleLink(e, 'Contact')}>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#help" onClick={(e) => handleLink(e, 'Help')}>
                  Help & FAQs
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => handleLink(e, 'Privacy Policy')}>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Customer Services</h4>
            <div className="services-badge-box">
              <span className="services-badge-title">All-India Delivery</span>
              <p className="services-badge-desc">
                Fast and reliable delivery to homes and addresses across India.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <p className="copyright-text">
            © {new Date().getFullYear()} ShopEase Inc. All rights reserved. Online shopping for everyone.
          </p>
          <div className="footer-bottom-links">
            <a href="#privacy" onClick={(e) => handleLink(e, 'Privacy Policy')}>
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#help" onClick={(e) => handleLink(e, 'Help')}>
              Help Center
            </a>
            <span>•</span>
            <a href="#contact" onClick={(e) => handleLink(e, 'Contact')}>
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
