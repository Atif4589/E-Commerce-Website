import React from 'react';

function Cart({ items, total, onRemove, onUpdateQuantity, onCheckout }) {
  if (items.length === 0) {
    return (
      <div className="cart-container">
        <h1 className="cart-header">Shopping Cart</h1>
        <div className="empty-cart">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
          <p>Your cart is empty</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#999' }}>
            Add some products to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-header">Shopping Cart</h1>
      
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-details">
              <div className="item-name">{item.name}</div>
              <div className="item-price">₹{item.price.toFixed(2)} each</div>
            </div>

            <div className="quantity-control">
              <button 
                className="quantity-btn"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              >
                −
              </button>
              
              <input 
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
                className="quantity-input"
              />
              
              <button 
                className="quantity-btn"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <div style={{ textAlign: 'right', minWidth: '100px' }}>
              <div style={{ fontWeight: 'bold', color: '#667eea' }}>
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>

            <button 
              className="btn btn-danger"
              onClick={() => onRemove(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div>
          <div className="total">Subtotal: <span className="total-amount">₹{total.toFixed(2)}</span></div>
          <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
            Shipping calculated at checkout
          </div>
        </div>
        <button 
          className="btn btn-primary"
          style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
          onClick={onCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
