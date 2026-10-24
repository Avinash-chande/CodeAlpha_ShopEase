import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import MyOrdersModal from './components/MyOrdersModal';
import Footer from './components/Footer';
import './App.css';

function App() {
    // Navigation active section state
    const [activeSection, setActiveSection] = useState('home');

    // Products state fetched from MongoDB
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Products filtering state
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Cart state: initialized from localStorage or empty array
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('shopease_cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Save cart changes to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('shopease_cart', JSON.stringify(cart));
        } catch (e) {
            console.error('Failed to sync cart with localStorage:', e);
        }
    }, [cart]);

    // User authentication state
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('shopease_user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    // Verify stored token with backend on initial load
    useEffect(() => {
        const token = localStorage.getItem('shopease_token');
        if (token) {
            fetch('/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    if (!res.ok) throw new Error('Token expired or invalid');
                    return res.json();
                })
                .then((data) => {
                    if (data?.user) {
                        setCurrentUser(data.user);
                        localStorage.setItem('shopease_user', JSON.stringify(data.user));
                    }
                })
                .catch(() => {
                    localStorage.removeItem('shopease_token');
                    localStorage.removeItem('shopease_user');
                    setCurrentUser(null);
                });
        }
    }, []);

    const handleAuthSuccess = (userData, token) => {
        if (token) {
            localStorage.setItem('shopease_token', token);
        }
        if (userData) {
            localStorage.setItem('shopease_user', JSON.stringify(userData));
        }
        setCurrentUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('shopease_token');
        localStorage.removeItem('shopease_user');
        setCurrentUser(null);
        setAuthModalOpen(false);
        setOrdersModalOpen(false);
    };

    // Modal & Drawer visibility states
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
    const [ordersModalOpen, setOrdersModalOpen] = useState(false);
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

    // Fetch products from Express backend / MongoDB
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/products');
            if (!res.ok) {
                throw new Error(`Failed to fetch products (HTTP ${res.status})`);
            }
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching products from backend:', err);
            setError('Unable to load products. Please ensure the backend server and MongoDB are running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch cart from backend for logged in user
    const fetchCartFromBackend = async (token) => {
        const authToken = token || localStorage.getItem('shopease_token');
        if (!authToken) return;

        try {
            const res = await fetch('/api/cart', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data?.items)) {
                    setCart(data.items);
                }
            }
        } catch (err) {
            console.error('Failed to fetch user cart from backend:', err);
        }
    };

    // Sync cart whenever currentUser changes
    useEffect(() => {
        if (currentUser) {
            fetchCartFromBackend();
        } else {
            try {
                const saved = localStorage.getItem('shopease_cart');
                if (saved) setCart(JSON.parse(saved));
                else setCart([]);
            } catch {
                setCart([]);
            }
        }
    }, [currentUser]);

    // Total cart item count
    const totalCartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

    // Add product to cart (connected to backend when logged in)
    const handleAddToCart = async (product, qty = 1) => {
        const pId = product.id || product._id;
        const token = localStorage.getItem('shopease_token');

        // If logged in, save to MongoDB cart
        if (currentUser && token) {
            try {
                const res = await fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        productId: pId,
                        quantity: qty
                    })
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.message || 'Could not add product to cart');
                    return;
                }

                if (Array.isArray(data.items)) {
                    setCart(data.items);
                }
            } catch (err) {
                console.error('Error adding to cart API:', err);
            }
        } else {
            // Prompt user to sign in because carts belong to registered users
            setAuthMode('login');
            setAuthModalOpen(true);
        }
    };

    // Update quantity in cart (connected to backend when logged in)
    const handleUpdateQuantity = async (productId, newQty) => {
        const token = localStorage.getItem('shopease_token');

        if (newQty <= 0) {
            await handleRemoveFromCart(productId);
            return;
        }

        if (currentUser && token) {
            try {
                const res = await fetch(`/api/cart/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        quantity: newQty
                    })
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.message || 'Could not update quantity');
                    return;
                }

                if (Array.isArray(data.items)) {
                    setCart(data.items);
                }
            } catch (err) {
                console.error('Error updating cart quantity API:', err);
            }
        } else {
            setCart((prevCart) =>
                prevCart.map((item) =>
                    (item.id || item._id) === productId ? { ...item, quantity: newQty } : item
                )
            );
        }
    };

    // Remove single product from cart (connected to backend when logged in)
    const handleRemoveFromCart = async (productId) => {
        const token = localStorage.getItem('shopease_token');

        if (currentUser && token) {
            try {
                const res = await fetch(`/api/cart/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();

                if (res.ok && Array.isArray(data.items)) {
                    setCart(data.items);
                }
            } catch (err) {
                console.error('Error removing from cart API:', err);
            }
        } else {
            setCart((prevCart) => prevCart.filter((item) => (item.id || item._id) !== productId));
        }
    };

    // Smooth navigation handler
    const handleNavigate = (sectionId) => {
        if (sectionId === 'orders') {
            setOrdersModalOpen(true);
            return;
        }
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
            ? products
            : products.filter(
                (p) =>
                    p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
                    p.categoryId?.toLowerCase() === selectedCategory.toLowerCase()
            );

    // Extract unique category names dynamically from actual MongoDB products
    const dynamicCategories = Array.from(
        new Set(products.map((p) => p.category).filter(Boolean))
    );
    const categoryFilterList = ['All', ...(dynamicCategories.length > 0 ? dynamicCategories : [
        'Stationery',
        'Electronics & Gadgets',
        'Bags & Backpacks',
        'Hostel Essentials',
        'Fashion & Accessories'
    ])];

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
                onLogout={handleLogout}
                onOpenOrders={() => setOrdersModalOpen(true)}
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
                    products={products}
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

                        {/* Loading State */}
                        {loading && (
                            <div className="no-products-box" style={{ padding: '3.5rem 1rem' }}>
                                <div
                                    className="loading-spinner"
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        border: '3px solid #e2e8f0',
                                        borderTopColor: '#f97316',
                                        borderRadius: '50%',
                                        margin: '0 auto 1.25rem',
                                        animation: 'spin 0.8s linear infinite'
                                    }}
                                ></div>
                                <p style={{ fontWeight: 700, color: 'var(--dark-navy)', fontSize: '1.05rem' }}>
                                    Loading products...
                                </p>
                                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                    Fetching live items from MongoDB database
                                </p>
                            </div>
                        )}

                        {/* Error State */}
                        {!loading && error && (
                            <div
                                className="no-products-box"
                                style={{
                                    padding: '3rem 1.5rem',
                                    borderColor: '#fca5a5',
                                    backgroundColor: '#fef2f2'
                                }}
                            >
                                <span style={{ fontSize: '2rem' }}>⚠️</span>
                                <p style={{ fontWeight: 700, color: '#dc2626', margin: '0.5rem 0' }}>
                                    Could not load products
                                </p>
                                <p style={{ fontSize: '0.9rem', color: '#7f1d1d', marginBottom: '1.25rem', maxWidth: '480px', margin: '0 auto 1.25rem' }}>
                                    {error}
                                </p>
                                <button
                                    className="btn-primary-orange"
                                    onClick={fetchProducts}
                                >
                                    Retry Connection
                                </button>
                            </div>
                        )}

                        {/* Products Grid */}
                        {!loading && !error && (
                            <>
                                <div className="products-grid">
                                    {filteredProducts.map((product) => (
                                        <ProductCard
                                            key={product.id || product._id}
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
                            </>
                        )}
                    </div>
                </section>

                {/* 5. WELCOME OFFER BANNER (Shown only to logged-out visitors) */}
                {!currentUser && (
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
                )}
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
                currentUser={currentUser}
                onOpenAuth={(mode) => {
                    setAuthMode(mode || 'login');
                    setAuthModalOpen(true);
                }}
            />

            {/* Checkout Modal (General Delivery Details) */}
            <CheckoutModal
                isOpen={checkoutModalOpen}
                onClose={() => setCheckoutModalOpen(false)}
                cartItems={cart}
                currentUser={currentUser}
                onViewOrders={() => setOrdersModalOpen(true)}
                onOrderSuccess={() => {
                    setCart([]);
                }}
            />

            {/* My Orders Modal */}
            <MyOrdersModal
                isOpen={ordersModalOpen}
                onClose={() => setOrdersModalOpen(false)}
                currentUser={currentUser}
                onOpenAuth={(mode) => {
                    setAuthMode(mode || 'login');
                    setAuthModalOpen(true);
                }}
            />

            {/* User Authentication Modal */}
            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                initialMode={authMode}
                onAuthSuccess={handleAuthSuccess}
                currentUser={currentUser}
                onLogout={handleLogout}
            />
        </div>
    );
}

export default App;
