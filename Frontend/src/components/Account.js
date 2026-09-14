import React, { useState } from 'react';

function Account({ user, onLogout, onNavigate }) {
  const [imageError, setImageError] = useState(false);

  if (!user) {
    return (
      <div className="form-container">
        <h2 className="form-title">Please Login First</h2>
        <button className="form-submit" onClick={() => onNavigate('login')}>
          Go to Login
        </button>
      </div>
    );
  }

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="account-container">
      <div className="account-header">
        <h1 className="form-title">My Account</h1>
      </div>

      <div className="account-profile">
        <div 
          className="profile-card" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2.5rem',
            padding: '2rem'
          }}
        >
          {user.picture && !imageError ? (
            <img 
              src={user.picture} 
              alt={user.name} 
              className="profile-picture"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={() => setImageError(true)}
              style={{
                width: '160px',
                height: '160px',
                minWidth: '160px',
                minHeight: '160px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #d4af37',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.35)'
              }}
            />
          ) : (
            <div
              className="profile-avatar-fallback"
              style={{
                width: '160px',
                height: '160px',
                minWidth: '160px',
                minHeight: '160px',
                borderRadius: '50%',
                border: '4px solid #d4af37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3.5rem',
                fontWeight: 'bold',
                color: '#d4af37',
                background: '#222',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.35)'
              }}
            >
              {userInitial}
            </div>
          )}

          <div className="profile-info">
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0' }}>{user.name}</h2>
            <p className="profile-email" style={{ margin: '0 0 0.75rem 0', color: '#ccc' }}>{user.email}</p>
            {user.provider && (
              <span 
                className="profile-provider"
                style={{
                  display: 'inline-block',
                  background: 'rgba(212, 175, 55, 0.15)',
                  color: '#d4af37',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem'
                }}
              >
                Signed in with {user.provider.charAt(0).toUpperCase() + user.provider.slice(1)}
              </span>
            )}
          </div>
        </div>

        <div className="account-actions">
          <button className="form-submit" onClick={() => onNavigate('home')}>
            Continue Shopping
          </button>
          <button 
            className="form-submit" 
            style={{ background: '#d4af37', color: '#1a1a1a' }} 
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="account-section">
        <h3>Account Details</h3>
        <div className="detail-item">
          <label>Name</label>
          <p>{user.name}</p>
        </div>
        <div className="detail-item">
          <label>Email</label>
          <p>{user.email}</p>
        </div>
        {user.id && (
          <div className="detail-item">
            <label>User ID</label>
            <p>{user.id}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;