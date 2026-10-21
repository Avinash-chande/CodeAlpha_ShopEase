import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { PRODUCTS } from './data/mockData';
import './App.css';

function App() {
  // Navigation active section state
  const [activeSection, setActiveSection] = useState('home');

  // Products filtering state
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Cart state: array of items with quantity
  const [cart, setCart] = useState([
    {
      ...PRODUCTS[0],
      quantity: 1
    }
  ]);

  // User authentication state
  const [currentUser, setCurrentUser] = useState(null);

  // Modal & Drawer visibility states
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [activeProductDetail, setActiveProductDetail] = useState(null);

  // Backend Health Status Check
  const [backendHealth, setBackendHealth] = useState({ online: false, message: '' });

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setBackendHealth({ online: true, message: data.message });
      })
      .catch(() => {
        setBackendHealth({ online: false, message: 'Backend Offline' });
      });
  }, []);

  // Total cart item count
  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Add product to cart
  const handleAddToCart = (product, qty = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += qty;
        return newCart;
      } else {
        return [...prevCart, { ...product, quantity: qty }];
      }
    });
  };

  // Update quantity in cart
  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Remove single product from cart
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Smooth navigation handler
  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        const navHeight = 80;
        const targetPos = el.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    }
  };

  // Category selection handler (smoothly filters and scrolls to products)
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    handleNavigate('products');
  };

  // Proceed to Checkout handler from Cart Drawer
  const handleOpenCheckout = () => {
    setCartDrawerOpen(false);
    setCheckoutModalOpen(true);
  };

  // Filter products by selected category
  const filteredProducts =
    selectedCategory === 'All'
      ? PRODUCTS
      : PRODUCTS.filter(
          (p) =>
            p.category.toLowerCase() === selectedCategory.toLowerCase() ||
            p.categoryId?.toLowerCase() === selectedCategory.toLowerCase()
        );

  const categoryFilterList = [
    'All',
    'Stationery',
    'Electronics & Gadgets',
    'Bags & Backpacks',
    'Hostel Essentials',
    'Fashion & Accessories'
  ];

  return (
    <div className="shopease-app">
      {/* 1. NAVBAR */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        currentUser={currentUser}
      />

      <main>
        {/* 2. HERO SECTION */}
        <Hero
          onShopNow={() => handleNavigate('products')}
          onExploreCategories={() => handleNavigate('categories')}
        />

        {/* 3. CATEGORIES SECTION */}
        <Categories
          onSelectCategory={handleCategorySelect}
          selectedCategory={selectedCategory}
        />

        {/* 4. FEATURED PRODUCTS SECTION */}
        <section className="products-section" id="products">
          <div className="section-container">
            <div className="products-header-row">
              <div>
                <span className="section-eyebrow">TRENDING PRODUCTS</span>
                <h2 className="section-title">Popular Products</h2>
                <p className="section-subtitle">
                  Customer favorites at fair, budget-conscious prices with fast delivery across India.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="category-pills-row">
                {categoryFilterList.map((cat) => (
                  <button
                    key={cat}
                    className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onOpenDetail={setActiveProductDetail}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="no-products-box">
                <p>No products found in this category.</p>
                <button
                  className="btn-secondary-outline"
                  onClick={() => setSelectedCategory('All')}
                >
                  View All Products
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 5. WELCOME OFFER BANNER (Welcoming to all customers) */}
        <section className="student-perks-banner">
          <div className="section-container">
            <div className="perks-banner-inner">
              <div className="banner-text">
                <span className="banner-tag">SPECIAL OFFER</span>
                <h3>Enjoy Fast Delivery & Great Prices</h3>
                <p>
                  Shop quality essentials with free standard delivery on orders above ₹499.
                  Create a free account to track orders and save your favorites.
                </p>
              </div>
              <div className="banner-cta">
                <button
                  className="btn-primary-orange"
                  onClick={() => {
                    setAuthMode('register');
                    setAuthModalOpen(true);
                  }}
                  id="btn-create-account-banner"
                >
                  Create Free Account
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. FOOTER */}
      <Footer onNavigate={handleNavigate} />

      {/* MODALS & DRAWERS */}
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeProductDetail}
        onClose={() => setActiveProductDetail(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleOpenCheckout}
      />

      {/* Checkout Modal (General Delivery Details) */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        cartItems={cart}
        onOrderSuccess={() => {
          setCart([]);
        }}
      />

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />
    </div>
  );
}

export default App;
