import { useState, useEffect } from 'react';

function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
  currentUser
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'COD'
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Pre-fill user name if available and not already typed
  useEffect(() => {
    if (currentUser?.name && !formData.fullName) {
      setFormData((prev) => ({ ...prev, fullName: currentUser.name }));
    }
    setApiError('');
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const isFreeDelivery = subtotal >= 499;
  const deliveryFee = isFreeDelivery ? 0 : 49;
  const totalAmount = subtotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const validate = () => {
    const err = {};
    if (!formData.fullName.trim()) err.fullName = 'Full Name is required';
    if (!formData.phone.trim()) {
      err.phone = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim().replace(/\D/g, ''))) {
      err.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.address.trim()) err.address = 'Delivery address is required';
    if (!formData.city.trim()) err.city = 'City is required';
    if (!formData.state.trim()) err.state = 'State is required';
    if (!formData.pincode.trim()) {
      err.pincode = 'PIN code is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      err.pincode = 'Please enter a valid 6-digit PIN code';
    }
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    const token = localStorage.getItem('shopease_token');
    if (!token) {
      setApiError('Please log in to your account before placing an order.');
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode
          },
          paymentMethod: formData.paymentMethod === 'ONLINE' ? 'ONLINE' : 'COD'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Could not place order');
      }

      const orderSummary = {
        orderId: data.order?.orderId || `SE-${data.order?._id?.slice(-6).toUpperCase()}`,
        itemsCount:
          data.order?.items?.reduce((acc, curr) => acc + curr.quantity, 0) ||
          cartItems.reduce((acc, curr) => acc + curr.quantity, 0),
        totalAmount: data.order?.totalAmount || totalAmount,
        deliveryDetails: { ...formData },
        status: data.order?.status || 'Processing',
        date: new Date(data.order?.createdAt || Date.now()).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      };

      setIsSubmitting(false);
      setOrderConfirmed(orderSummary);

      if (onOrderSuccess) {
        onOrderSuccess();
      }
    } catch (apiErr) {
      console.error('Order placement error:', apiErr);
      setIsSubmitting(false);
      setApiError(apiErr.message || 'Failed to place order. Please try again.');
    }
  };

  const handleFinish = () => {
    setOrderConfirmed(null);
    setFormData({
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      paymentMethod: 'COD'
    });
    setErrors({});
    setApiError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleFinish}>
      <div
        className="modal-container checkout-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={handleFinish}
          aria-label="Close checkout"
        >
          ✕
        </button>

        {orderConfirmed ? (
          <div className="checkout-success-box">
            <div className="success-icon-badge">🎉</div>
            <h2 className="success-title">Order Placed Successfully!</h2>
            <p className="order-id-badge">Order ID: <strong>{orderConfirmed.orderId}</strong></p>
            
            <p className="success-message">
              Thank you, <strong>{orderConfirmed.deliveryDetails.fullName}</strong>.
              Your order has been confirmed and is being processed for delivery.
            </p>

            <div className="order-summary-card">
              <div className="summary-row">
                <span>Items Ordered:</span>
                <strong>{orderConfirmed.itemsCount} items</strong>
              </div>
              <div className="summary-row">
                <span>Total Amount:</span>
                <strong>{formatINR(orderConfirmed.totalAmount)}</strong>
              </div>
              <div className="summary-row">
                <span>Payment Method:</span>
                <strong>{orderConfirmed.deliveryDetails.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</strong>
              </div>
              <div className="summary-row">
                <span>Shipping Address:</span>
                <span className="address-snippet">
                  {orderConfirmed.deliveryDetails.address}, {orderConfirmed.deliveryDetails.city}, {orderConfirmed.deliveryDetails.state} - {orderConfirmed.deliveryDetails.pincode}
                </span>
              </div>
              <div className="summary-row">
                <span>Contact Phone:</span>
                <strong>{orderConfirmed.deliveryDetails.phone}</strong>
              </div>
            </div>

            <button
              className="btn-primary-orange btn-block"
              onClick={handleFinish}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="checkout-content">
            <div className="checkout-header">
              <h2 className="checkout-title">Checkout & Delivery Details</h2>
              <p className="checkout-subtitle">
                Enter your delivery address to place your order. Fast shipping to any address across India.
              </p>
            </div>

            <form className="checkout-form" onSubmit={handleSubmit} noValidate>
              <div className="checkout-grid">
                {/* Left: Delivery Details Form */}
                <div className="checkout-form-col">
                  <h3 className="form-section-title">📍 Shipping Information</h3>

                  {/* 1. Full Name */}
                  <div className="form-group">
                    <label htmlFor="checkout-fullName">Full Name *</label>
                    <input
                      id="checkout-fullName"
                      name="fullName"
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                    {errors.fullName && <span className="field-error">{errors.fullName}</span>}
                  </div>

                  {/* 2. Phone Number */}
                  <div className="form-group">
                    <label htmlFor="checkout-phone">Phone Number *</label>
                    <input
                      id="checkout-phone"
                      name="phone"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>

                  {/* 3. Address */}
                  <div className="form-group">
                    <label htmlFor="checkout-address">Delivery Address (House/Flat, Street, Area) *</label>
                    <input
                      id="checkout-address"
                      name="address"
                      type="text"
                      placeholder="e.g. Flat 402, Sunshine Heights, MG Road"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                    {errors.address && <span className="field-error">{errors.address}</span>}
                  </div>

                  {/* 4. City, State, PIN Code Row */}
                  <div className="form-row-3">
                    <div className="form-group">
                      <label htmlFor="checkout-city">City *</label>
                      <input
                        id="checkout-city"
                        name="city"
                        type="text"
                        placeholder="e.g. Mumbai"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                      {errors.city && <span className="field-error">{errors.city}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="checkout-state">State *</label>
                      <input
                        id="checkout-state"
                        name="state"
                        type="text"
                        placeholder="e.g. Maharashtra"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                      {errors.state && <span className="field-error">{errors.state}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="checkout-pincode">PIN Code *</label>
                      <input
                        id="checkout-pincode"
                        name="pincode"
                        type="text"
                        placeholder="e.g. 400001"
                        maxLength="6"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                      />
                      {errors.pincode && <span className="field-error">{errors.pincode}</span>}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <h3 className="form-section-title" style={{ marginTop: '1.25rem' }}>
                    💳 Payment Method
                  </h3>
                  <div className="payment-options-grid">
                    <label className={`payment-option-card ${formData.paymentMethod === 'COD' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === 'COD'}
                        onChange={handleChange}
                      />
                      <span className="payment-label">
                        <strong>Cash on Delivery (COD)</strong>
                        <small>Pay with cash or UPI upon delivery</small>
                      </span>
                    </label>

                    <label className={`payment-option-card ${formData.paymentMethod === 'ONLINE' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="ONLINE"
                        checked={formData.paymentMethod === 'ONLINE'}
                        onChange={handleChange}
                      />
                      <span className="payment-label">
                        <strong>Online Payment / UPI</strong>
                        <small>Google Pay, PhonePe, Cards, NetBanking</small>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Right: Order Summary */}
                <div className="checkout-summary-col">
                  <h3 className="form-section-title">🛒 Order Summary</h3>

                  <div className="checkout-items-preview">
                    {cartItems.map((item) => (
                      <div key={item.id} className="checkout-item-row">
                        <img src={item.image} alt={item.name} className="checkout-item-thumb" />
                        <div className="checkout-item-details">
                          <span className="checkout-item-name">{item.name}</span>
                          <span className="checkout-item-qty">Qty: {item.quantity}</span>
                        </div>
                        <span className="checkout-item-price">{formatINR(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-price-breakdown">
                    <div className="breakdown-row">
                      <span>Subtotal</span>
                      <span>{formatINR(subtotal)}</span>
                    </div>
                    <div className="breakdown-row">
                      <span>Standard Delivery</span>
                      <span>{isFreeDelivery ? <strong style={{ color: '#10b981' }}>FREE</strong> : formatINR(49)}</span>
                    </div>
                    <div className="breakdown-total-row">
                      <span>Total Amount</span>
                      <span>{formatINR(totalAmount)}</span>
                    </div>
                  </div>

                  {apiError && (
                    <div
                      style={{
                        color: '#ef4444',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        marginTop: '1rem',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}
                    >
                      {apiError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary-orange btn-block"
                    disabled={isSubmitting || cartItems.length === 0}
                    style={{ marginTop: '1.25rem', padding: '1rem' }}
                  >
                    {isSubmitting ? 'Placing Order...' : `Place Order • ${formatINR(totalAmount)}`}
                  </button>

                  <p className="checkout-trust-notice">
                    🔒 Safe & secure checkout. 7-day hassle-free returns.
                  </p>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;
