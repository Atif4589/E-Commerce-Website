import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import Checkout from './components/Checkout';
import Account from './components/Account';
import { mockProducts } from './components/mockProducts';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState([]);

  const API_URL = 'https://e-commerce-website-qp8f.onrender.com/api';

  useEffect(() => {
    // Use mock products data
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleAddToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert('Added to cart!');
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const handleLogin = (userData) => {
  setUser(userData);
  setCurrentPage('account');
};

  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleCheckoutComplete = () => {
    setCart([]);
    alert('Order placed successfully!');
    setCurrentPage('home');
  };

  const handleToggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage('home');
  };

 const filteredProducts = products.filter(p => {
  const searchLower = searchQuery.toLowerCase();
  const titleMatch = p.title?.toLowerCase().includes(searchLower);
  const categoryMatch = p.category?.toLowerCase() === searchLower;
  return titleMatch || categoryMatch;
});

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const categories = [
    { name: 'WOMEN', search: "women's clothing", image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFzaGlvbiUyMHdvbWVufGVufDB8fDB8fHww' },
    { name: 'MEN', search: "men's clothing", image: 'https://plus.unsplash.com/premium_photo-1661627681947-4431c8c97659?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFzaGlvbiUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D' },
    { name: 'SNEAKERS', search: 'sneakers', image: 'https://images.unsplash.com/photo-1618677831708-0e7fda3148b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFzaGlvbiUyMHNuZWFrZXJzfGVufDB8fDB8fHww' },
    { name: 'ACCESSORIES', search: 'accessories', image: 'https://images.unsplash.com/photo-1628911771814-5d61388efbf7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWNjZXNzb3JpZXMlMjBlbGVjdHJvbmljfGVufDB8fDB8fHww' }
  ];

  return (
    <div className="App">
      <Navbar
        onNavigate={setCurrentPage}
        cartCount={cart.length}
        user={user}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />

      {loading && <div className="loading">Loading...</div>}

      {!loading && (
        <main className="main-content">
          {currentPage === 'home' && (
            <>
              <section className="hero-section">
                <div className="hero-content">
                  <div className="new-collection">NEW COLLECTION</div>
                  <h1>Step Into <span>Confidence</span></h1>
                  <p>Timeless style. Premium comfort. Designed for the way you move.</p>
                  <button className="explore-btn">EXPLORE COLLECTION →</button>
                  <div className="hero-features">
                    <div className="feature">
                      <div className="feature-icon">✓</div>
                      <div className="feature-text">Premium Materials</div>
                    </div>
                    <div className="feature">
                      <div className="feature-icon">✓</div>
                      <div className="feature-text">All-Day Comfort</div>
                    </div>
                    <div className="feature">
                      <div className="feature-icon">✓</div>
                      <div className="feature-text">Modern Design</div>
                    </div>
                  </div>
                </div>
                <div className="hero-image">
                  <img src="https://plus.unsplash.com/premium_photo-1727173974066-65be41890afd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGxpZmVzdHlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="Fashion" />
                </div>
              </section>

              <section className="category-section">
                {categories.map((cat, idx) => (
                  <div key={idx} className="category-card" onClick={() => handleSearch(cat.search)}>
                    <div className="category-image">
                      <img src={cat.image} alt={cat.name} />
                    </div>
                    <div className="category-title">{cat.name}</div>
                    <a className="category-link">
                      Shop Now →
                    </a>
                  </div>
                ))}
              </section>

              <div className="featured-header">
                <h2>FEATURED PRODUCTS</h2>
                <a className="view-all-link">VIEW ALL →</a>
              </div>

              <ProductList
                products={filteredProducts}
                onViewProduct={handleViewProduct}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
              />
            </>
          )}

          {currentPage === 'product-detail' && selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              onAddToCart={handleAddToCart}
              onBack={() => setCurrentPage('home')}
            />
          )}

          {currentPage === 'cart' && (
            <Cart
              items={cart}
              total={cartTotal}
              onRemove={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
              onCheckout={() => user ? setCurrentPage('checkout') : setCurrentPage('login')}
            />
          )}

          {currentPage === 'login' && (
            <Login
              onLogin={handleLogin}
              onNavigateToRegister={() => setCurrentPage('register')}
              apiUrl={API_URL}
            />
          )}

          {currentPage === 'register' && (
            <Register
              onRegister={handleRegister}
              onNavigateToLogin={() => setCurrentPage('login')}
              apiUrl={API_URL}
            />
          )}

       {currentPage === 'account' && (
  <Account
    user={user}
    onLogout={handleLogout}
    onNavigate={setCurrentPage}
  />
)}
        </main>
      )}
    </div>
  );
}

export default App;