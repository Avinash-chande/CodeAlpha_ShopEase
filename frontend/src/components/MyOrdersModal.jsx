import { useState, useEffect } from 'react';

function MyOrdersModal({ isOpen, onClose, currentUser, onOpenAuth }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    const token = localStorage.getItem('shopease_token');
    if (!token) {
      setOrders([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch your orders');
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Could not load your orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        fetchOrders();
      } else {
        setOrders([]);
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' };
      case 'confirmed':
        return { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' };
      case 'shipped':
        return { bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff' };
      case 'delivered':
        return { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' };
      case 'cancelled':
        return { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' };
      default:
        return { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' };
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container orders-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '820px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff'
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: 'var(--dark-navy)',
                margin: 0
              }}
            >
              📦 My Orders
            </h2>
            <p
              style={{
                margin: '0.2rem 0 0',
                fontSize: '0.85rem',
                color: 'var(--text-muted)'
              }}
            >
              {currentUser
                ? `Order history and live delivery tracking for ${currentUser.name}`
                : 'Sign in to view your placed orders'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {currentUser && (
              <button
                type="button"
                onClick={fetchOrders}
                disabled={loading}
                title="Refresh Orders"
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-light)',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  color: 'var(--navy-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                🔄 Refresh
              </button>
            )}
            <button
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close orders modal"
              style={{ position: 'static' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            overflowY: 'auto',
            flexGrow: 1,
            background: '#f8fafc'
          }}
        >
          {/* Unauthenticated State */}
          {!currentUser ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
              <h3 style={{ color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>
                Please Log In to View Orders
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                You must be logged in to view your orders and track shipments.
              </p>
              <button
                className="btn-primary-orange"
                onClick={() => {
                  onClose();
                  if (onOpenAuth) onOpenAuth('login');
                }}
              >
                Log In to ShopEase
              </button>
            </div>
          ) : loading ? (
            /* Loading State */
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  border: '3px solid #fed7aa',
                  borderTopColor: 'var(--primary-orange)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto 1rem'
                }}
              />
              <p style={{ color: 'var(--navy-light)', fontWeight: 600 }}>
                Fetching your orders from ShopEase...
              </p>
            </div>
          ) : error ? (
            /* Error State */
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
              <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>
                Could Not Load Orders
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                {error}
              </p>
              <button className="btn-primary-orange" onClick={fetchOrders}>
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            /* Empty Orders State */
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛍️</div>
              <h3 style={{ color: 'var(--dark-navy)', marginBottom: '0.5rem' }}>
                No Orders Placed Yet
              </h3>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.92rem',
                  maxWidth: '420px',
                  margin: '0 auto 1.5rem'
                }}
              >
                You haven't placed any orders yet. Discover high-quality essentials at great prices and place your first order today!
              </p>
              <button className="btn-primary-orange" onClick={onClose}>
                Start Shopping Now
              </button>
            </div>
          ) : (
            /* Orders List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {orders.map((order) => {
                const orderId =
                  order.orderId ||
                  (order._id ? `SE-${order._id.toString().slice(-6).toUpperCase()}` : 'SE-ORDER');
                const statusTheme = getStatusColor(order.status);
                const itemsCount =
                  order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

                return (
                  <div
                    key={order.id || order._id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    {/* Order Card Header */}
                    <div
                      style={{
                        padding: '1rem 1.25rem',
                        background: '#f8fafc',
                        borderBottom: '1px solid var(--border-light)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span
                          style={{
                            fontWeight: 800,
                            fontFamily: 'var(--font-heading)',
                            color: 'var(--dark-navy)',
                            fontSize: '0.95rem'
                          }}
                        >
                          Order ID: {orderId}
                        </span>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.65rem',
                            borderRadius: 'var(--radius-full)',
                            background: statusTheme.bg,
                            color: statusTheme.text,
                            border: `1px solid ${statusTheme.border}`
                          }}
                        >
                          ● {order.status || 'Processing'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Placed on: <strong>{formatDate(order.createdAt)}</strong>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div style={{ padding: '1.25rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.85rem'
                        }}
                      >
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1rem',
                              paddingBottom: '0.85rem',
                              borderBottom:
                                idx < order.items.length - 1
                                  ? '1px solid #f1f5f9'
                                  : 'none'
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: '56px',
                                height: '56px',
                                objectFit: 'cover',
                                borderRadius: '6px',
                                background: '#e2e8f0',
                                flexShrink: 0
                              }}
                            />
                            <div style={{ flexGrow: 1 }}>
                              <h4
                                style={{
                                  fontSize: '0.92rem',
                                  fontWeight: 600,
                                  color: 'var(--dark-navy)',
                                  margin: '0 0 0.25rem'
                                }}
                              >
                                {item.name}
                              </h4>
                              <div
                                style={{
                                  fontSize: '0.8rem',
                                  color: 'var(--text-muted)'
                                }}
                              >
                                Quantity: <strong>{item.quantity}</strong> × {formatINR(item.price)}
                              </div>
                            </div>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                color: 'var(--dark-navy)'
                              }}
                            >
                              {formatINR(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer & Shipping Address */}
                      <div
                        style={{
                          marginTop: '1rem',
                          paddingTop: '1rem',
                          borderTop: '1.5px dashed var(--border-light)',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                          gap: '1rem',
                          fontSize: '0.85rem'
                        }}
                      >
                        {/* Shipping Address */}
                        <div>
                          <span
                            style={{
                              fontWeight: 700,
                              color: 'var(--dark-navy)',
                              display: 'block',
                              marginBottom: '0.35rem'
                            }}
                          >
                            📍 Delivery Address:
                          </span>
                          <div style={{ color: 'var(--navy-light)', lineHeight: 1.4 }}>
                            <div><strong>{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.phone})</div>
                            <div>{order.shippingAddress?.address}</div>
                            <div>
                              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                            </div>
                          </div>
                        </div>

                        {/* Payment & Total */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            background: '#f8fafc',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-sm)'
                          }}
                        >
                          <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                            Payment: <strong>{order.paymentMethod || 'Cash on Delivery'}</strong>
                          </div>
                          <div
                            style={{
                              fontSize: '1.1rem',
                              fontWeight: 800,
                              color: 'var(--dark-navy)',
                              fontFamily: 'var(--font-heading)'
                            }}
                          >
                            Total: <span style={{ color: 'var(--primary-orange)' }}>{formatINR(order.totalAmount)}</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                              ({itemsCount} items)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrdersModal;
