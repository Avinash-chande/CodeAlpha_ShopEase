import { useState } from 'react';

function ProductCard({ product, onAddToCart, onOpenDetail }) {
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  // Format price in Indian Rupees (INR)
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div
      className="product-card"
      onClick={() => onOpenDetail(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onOpenDetail(product);
        }
      }}
    >
      {/* Product Image & Badges */}
      <div className="product-image-container">
        <img
          src={product.image || product.imageUrl}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}

        <button
          className="quick-view-hover-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(product);
          }}
          aria-label="Quick View Product"
        >
          👁️ Quick View
        </button>
      </div>

      {/* Product Details */}
      <div className="product-info">
        <span className="product-category-tag">{product.category}</span>
        
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        {/* Rating Row */}
        <div className="product-rating-row">
          <div className="rating-stars">
            <span className="star-icon">★</span>
            <span className="rating-score">{product.rating}</span>
          </div>
          <span className="rating-reviews">({product.reviewsCount} reviews)</span>
        </div>

        {/* Price & Add to Cart Row */}
        <div className="product-footer-row">
          <div className="product-price-box">
            <span className="product-price-current">{formatINR(product.price)}</span>
            {product.originalPrice && (
              <span className="product-price-original">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            className={`btn-add-to-cart ${justAdded ? 'added' : ''}`}
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? (
              <>
                <span className="cart-check-icon">✓</span>
                <span>Added</span>
              </>
            ) : (
              <>
                <span className="cart-plus-icon">+</span>
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
