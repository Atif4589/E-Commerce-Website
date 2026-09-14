import React, { useState } from 'react';

function ProductDetail({ product, onAddToCart, onBack }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    setQuantity(1);
  };

  return (
    <div className="product-detail">
      <button className="btn btn-secondary back-btn" onClick={onBack}>
        ← Back to Products
      </button>

      <div className="detail-container">
        <div>
          <img 
            src={product.image} 
            alt={product.name}
            className="detail-image"
          />
        </div>

        <div className="detail-info">
          <h2>{product.name}</h2>
          
          <div className="detail-price"> ₹{product.price.toFixed(2)}</div>
          
          <p className="detail-description">
            {product.description}
          </p>

          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input 
              type="number" 
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
              className="form-input"
            />
          </div>

          <button 
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
            onClick={handleAddToCart}
          >
            Add to Cart ({quantity})
          </button>

          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Product Details:</h4>
            <ul style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
              <li>High Quality Product</li>
              <li>Free Shipping on Orders Over  ₹500</li>
              <li>30-Day Money-Back Guarantee</li>
              <li>1-Year Warranty Included</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
