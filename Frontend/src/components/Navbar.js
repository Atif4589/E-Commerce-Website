import React, { useState } from 'react';

function Navbar({ onNavigate, cartCount, user, onLogout, onSearch }) {
  const [searchInput, setSearchInput] = useState('');
  const [avatarError, setAvatarError] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleCategoryClick = (category) => {
    onSearch(category);
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="navbar">
      <button className="nav-brand" onClick={() => onNavigate('home')}>
        <span className="brand-mark">OS</span>
        <div className="brand-words">
          <span className="brand-name">OBSIDIAN</span>
          <span className="brand-est">EST. 2026</span>
        </div>
      </button>

      <div className="nav-links">
        <button className="nav-link" onClick={() => handleCategoryClick("women's clothing")}>
          WOMEN
        </button>
        <button className="nav-link" onClick={() => handleCategoryClick("men's clothing")}>
          MEN
        </button>
        <button className="nav-link" onClick={() => handleCategoryClick("sneakers")}>
          SNEAKERS
        </button>
        <button className="nav-link" onClick={() => handleCategoryClick("accessories")}>
          ACCESSORIES
        </button>
      </div>

      <div className="nav-search">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
      </div>

      <div className="nav-actions">
        {user ? (
          <div className="nav-user-menu" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              onClick={() => onNavigate('account')} 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              {user.picture && !avatarError ? (
                <img
                  src={user.picture}
                  alt={user.name || 'User'}
                  className="nav-user-avatar"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={() => setAvatarError(true)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid #d4af37'
                  }}
                />
              ) : (
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: '#222',
                    color: '#d4af37',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    border: '1px solid #d4af37'
                  }}
                >
                  {userInitial}
                </span>
              )}
              <span className="nav-user-name" style={{ color: '#fff', fontSize: '0.9rem' }}>
                {user.name ? user.name.split(' ')[0] : user.email}
              </span>
            </div>

            <button className="nav-action nav-logout-btn" onClick={onLogout}>
              <span className="nav-action-label">Logout</span>
            </button>
          </div>
        ) : (
          <button className="nav-action" onClick={() => onNavigate('login')}>
            <span className="nav-action-icon">👤</span>
            <span className="nav-action-label">Account</span>
          </button>
        )}

        <button className="nav-action" onClick={() => onNavigate('cart')}>
          <span className="nav-action-icon">🛒</span>
          <span className="nav-action-label">Cart</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;