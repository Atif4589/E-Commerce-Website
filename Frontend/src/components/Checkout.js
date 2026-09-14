import React, { useState } from 'react';

function Checkout({ items, total, user, onComplete, onCancel, apiUrl }) {
  const [formData, setFormData] = useState({
    fullName: user.name,
    email: user.email,
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.address || !formData.city || !formData.zipCode) {
      setError('Please fill in all address fields');
      setLoading(false);
      return;
    }

    if (!formData.cardNumber || formData.cardNumber.length < 13) {
      setError('Please enter a valid card number');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: items,
          total: total
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Order failed');
        setLoading(false);
        return;
      }

      alert(`Order placed successfully! Order ID: ${data.orderId}`);
      onComplete();
    } catch (err) {
      setError('Failed to process order');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-header">Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Order Summary */}
        <div>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Order Summary</h3>
          
          <div className="checkout-items">
            {items.map(item => (
              <div key={item.id} className="checkout-item">
                <span className="checkout-item-name">
                  {item.name} x {item.quantity}
                </span>
                <span className="checkout-item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            
            <div className="checkout-summary">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Shipping & Payment</h3>

          <form onSubmit={handleSubmit}>
            {error && <div className="error" style={{ marginBottom: '1rem', color: '#ff6b6b', textAlign: 'center' }}>{error}</div>}

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                value={formData.fullName}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className="form-input"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="123 Main St"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="form-input"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="New York"
                />
              </div>

              <div className="form-group">
                <label className="form-label">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  className="form-input"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  placeholder="10001"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                className="form-input"
                value={formData.cardNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value.slice(0, 16) }))}
                required
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  className="form-input"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                  placeholder="MM/YY"
                />
              </div>

              <div className="form-group">
                <label className="form-label">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  className="form-input"
                  value={formData.cvv}
                  onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value.slice(0, 3) }))}
                  required
                  placeholder="123"
                />
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '1rem' }}>
                ℹ️ This is a demo checkout. No actual payment will be processed.
              </p>
              
              <div className="checkout-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Back to Cart
                </button>
                
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
