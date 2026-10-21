import { useState } from 'react';

function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container product-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="modal-grid">
          {/* Product Image Column */}
          <div className="modal-image-col">
            <img
              src={product.image}
              alt={product.name}
              className="modal-product-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
              }}
            />
            {product.badge && (
              <span className="modal-badge">{product.badge}</span>
            )}
          </div>

          {/* Product Details Column */}
          <div className="modal-info-col">
            <div className="modal-category">{product.category}</div>
            <h2 className="modal-title">{product.name}</h2>

            <div className="modal-rating">
              <span className="star-icon">★</span>
              <span className="rating-score">{product.rating}</span>
              <span className="reviews">({product.reviewsCount} student reviews)</span>
            </div>

            <div className="modal-price-box">
              <span className="modal-price">{formatINR(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="modal-original-price">
                    {formatINR(product.originalPrice)}
                  </span>
                  <span className="modal-discount-tag">
                    {Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100
                    )}
                    % OFF
                  </span>
                </>
              )}
            </div>

            <p className="modal-description">{product.description}</p>

            <div className="modal-perks">
              <div className="perk-item">
                <span className="perk-icon">📦</span>
                <span>In Stock — Fast Delivery Across India</span>
              </div>
              <div className="perk-item">
                <span className="perk-icon">🛡️</span>
                <span>7-Day Easy Replacement Guarantee</span>
              </div>
              <div className="perk-item">
                <span className="perk-icon">💳</span>
                <span>Secure Online & Cash on Delivery Options</span>
              </div>
            </div>

            {/* Quantity Selector & Action */}
            <div className="modal-action-row">
              <div className="quantity-counter">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="qty-btn"
                >
                  −
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>

              <button
                className={`modal-add-btn ${addedNotice ? 'added' : ''}`}
                onClick={handleAdd}
              >
                {addedNotice ? '✓ Added to Cart!' : `Add to Cart • ${formatINR(product.price * quantity)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
