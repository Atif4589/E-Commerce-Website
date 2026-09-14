import React from 'react';

const IconBagSmall = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.5 8h15l-1.1 12.2a1.5 1.5 0 0 1-1.5 1.3H7.1a1.5 1.5 0 0 1-1.5-1.3Z" />
    <path d="M8.75 8V5.9a3.25 3.25 0 0 1 6.5 0V8" />
  </svg>
);

const IconHeartSmall = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor"
       strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20.5 4.4 13a4.6 4.6 0 0 1 0-6.6 4.6 4.6 0 0 1 6.6 0l1 1 1-1a4.6 4.6 0 0 1 6.6 0 4.6 4.6 0 0 1 0 6.6Z" />
  </svg>
);

const Stars = ({ rate }) => {
  const rounded = Math.round(rate || 0);
  return (
    <span className="stars" aria-label={`Rated ${rate} out of 5`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={n <= rounded ? 'star star-on' : 'star'}>★</span>
      ))}
    </span>
  );
};

function ProductList({ products, onViewProduct, onAddToCart, onToggleWishlist, wishlist }) {
  if (!products.length) {
    return (
      <div className="empty-results">
        <p>No products match that search.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(product => {
        const isWishlisted = wishlist.includes(product.id);
        const title = product.title || product.name;

        return (
          <article key={product.id} className="product-card">
            <div className="product-image-container">
              <button
                className="product-image-btn"
                onClick={() => onViewProduct(product)}
                aria-label={`View ${title}`}
              >
                <img src={product.image} alt={title} className="product-image" />
              </button>

              <button
                className={isWishlisted ? 'product-wishlist is-active' : 'product-wishlist'}
                onClick={() => onToggleWishlist(product.id)}
                aria-label={isWishlisted ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`}
                aria-pressed={isWishlisted}
              >
                <IconHeartSmall filled={isWishlisted} />
              </button>
            </div>

            <div className="product-info">
              <h3 className="product-name">
                <button className="product-name-btn" onClick={() => onViewProduct(product)}>
                  {title}
                </button>
              </h3>

              <div className="product-category">{product.category || 'Accessories'}</div>

              <div className="product-price">₹{product.price.toFixed(2)}</div>

              <div className="product-rating">
                <Stars rate={product.rating?.rate} />
                <span className="rating-value">{(product.rating?.rate ?? 0).toFixed(1)}</span>
                <span className="rating-count">({product.rating?.count ?? 0})</span>
              </div>

              <button className="btn-bag" onClick={() => onAddToCart(product)}>
                <IconBagSmall />
                <span>Add to Bag</span>
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ProductList;
