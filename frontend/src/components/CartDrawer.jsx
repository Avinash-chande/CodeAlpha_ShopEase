function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) {
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

  const freeShippingThreshold = 499;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountNeeded = freeShippingThreshold - subtotal;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div
        className="cart-drawer-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-title-row">
            <h2 className="cart-heading">Your Shopping Cart</h2>
            <span className="cart-items-count">
              ({cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} items)
            </span>
          </div>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="shipping-bar-container">
          {isFreeShipping ? (
            <p className="shipping-success-text">
              🎉 <strong>Free Standard Delivery Unlocked!</strong>
            </p>
          ) : (
            <p className="shipping-needed-text">
              Add <strong>{formatINR(amountNeeded)}</strong> more to get{' '}
              <span className="highlight-orange">Free Standard Delivery</span>!
            </p>
          )}
          <div className="shipping-progress-track">
            <div
              className="shipping-progress-fill"
              style={{
                width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`
              }}
            ></div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <span className="empty-cart-icon">🛒</span>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added any products to your cart yet.</p>
              <button className="btn-primary-orange" onClick={onClose}>
                Browse Products
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{item.name}</h4>
                    <span className="cart-item-price">{formatINR(item.price)}</span>

                    <div className="cart-item-controls">
                      <div className="cart-qty-box">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="qty-btn-sm"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="qty-btn-sm"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="btn-remove-item"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer with Subtotal & Checkout */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal-row">
              <span className="subtotal-label">Subtotal</span>
              <span className="subtotal-value">{formatINR(subtotal)}</span>
            </div>

            <div className="cart-delivery-row">
              <span>Standard Delivery</span>
              <span className="delivery-cost">
                {isFreeShipping ? 'FREE' : formatINR(49)}
              </span>
            </div>

            <p className="cart-tax-notice">Taxes and delivery discounts calculated at checkout.</p>

            <button
              className="btn-checkout-primary"
              onClick={onProceedToCheckout}
              id="btn-proceed-to-checkout"
            >
              Proceed to Checkout ({formatINR(subtotal + (isFreeShipping ? 0 : 49))})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
