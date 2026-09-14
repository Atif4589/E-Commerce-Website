const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Loads environment variables from .env
require('dotenv').config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const PORT = process.env.PORT || 5000;

// Data directory
const dataDir = path.join(__dirname, 'data');
const productsFile = path.join(dataDir, 'products.json');
const usersFile = path.join(dataDir, 'users.json');
const ordersFile = path.join(dataDir, 'orders.json');

// Create data directory
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize files
if (!fs.existsSync(productsFile)) {
  const products = [
    { id: 1, name: 'Laptop', price: 999, image: 'https://via.placeholder.com/300x200?text=Laptop', description: 'High-performance laptop for work and gaming' },
    { id: 2, name: 'Wireless Mouse', price: 29, image: 'https://via.placeholder.com/300x200?text=Mouse', description: 'Comfortable wireless mouse' },
    { id: 3, name: 'USB-C Cable', price: 15, image: 'https://via.placeholder.com/300x200?text=Cable', description: 'Durable USB-C cable' },
    { id: 4, name: 'Keyboard', price: 79, image: 'https://via.placeholder.com/300x200?text=Keyboard', description: 'Mechanical gaming keyboard' },
    { id: 5, name: 'Monitor', price: 299, image: 'https://via.placeholder.com/300x200?text=Monitor', description: '27-inch 4K display' },
    { id: 6, name: 'Headphones', price: 149, image: 'https://via.placeholder.com/300x200?text=Headphones', description: 'Noise-canceling headphones' }
  ];
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
}

if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
}

const readJSON = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
};

const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Centralized CORS & JSON sender
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
};

const parseBody = (req, callback) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      callback(JSON.parse(body));
    } catch {
      callback(null);
    }
  });
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Global preflight response
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // --- PRODUCTS ---
  if (pathname === '/api/products' && method === 'GET') {
    const products = readJSON(productsFile);
    sendJSON(res, 200, products);
  }

  else if (pathname.match(/^\/api\/products\/\d+$/) && method === 'GET') {
    const id = parseInt(pathname.split('/')[3], 10);
    const products = readJSON(productsFile);
    const product = products.find(p => p.id === id);
    if (product) {
      sendJSON(res, 200, product);
    } else {
      sendJSON(res, 404, { error: 'Product not found' });
    }
  }

  // --- STANDARD AUTH ---
  else if (pathname === '/api/auth/register' && method === 'POST') {
    parseBody(req, (body) => {
      if (!body || !body.email || !body.password) {
        sendJSON(res, 400, { error: 'Invalid data' });
        return;
      }

      const users = readJSON(usersFile);
      if (users.find(u => u.email === body.email)) {
        sendJSON(res, 400, { error: 'User already exists' });
        return;
      }

      const newUser = {
        id: Date.now(),
        name: body.name || 'User',
        email: body.email,
        password: body.password
      };

      users.push(newUser);
      writeJSON(usersFile, users);
      sendJSON(res, 200, { user: { id: newUser.id, name: newUser.name, email: newUser.email } });
    });
  }

  else if (pathname === '/api/auth/login' && method === 'POST') {
    parseBody(req, (body) => {
      if (!body || !body.email || !body.password) {
        sendJSON(res, 400, { error: 'Invalid data' });
        return;
      }

      const users = readJSON(usersFile);
      const user = users.find(u => u.email === body.email && u.password === body.password);

      if (user) {
        sendJSON(res, 200, { user: { id: user.id, name: user.name, email: user.email, picture: user.picture || null } });
      } else {
        sendJSON(res, 401, { error: 'Invalid credentials' });
      }
    });
  }

  // --- GOOGLE OAUTH / TOKEN LOGIN ---
  else if (pathname === '/api/auth/google' && method === 'POST') {
    parseBody(req, (body) => {
      if (!body || !body.token) {
        sendJSON(res, 400, { error: 'No token provided' });
        return;
      }

      try {
        const parts = body.token.split('.');
        if (parts.length !== 3) {
          sendJSON(res, 401, { error: 'Invalid token structure' });
          return;
        }

        // Base64Url decode payload
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));

        // Validate expiration
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
          sendJSON(res, 401, { error: 'Token expired' });
          return;
        }

       // Verify audience matching by reading directly from process.env with trim
        const clientId = (process.env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID || '').trim();
        if (clientId && decoded.aud !== clientId) {
          console.log('Audience mismatch:');
          console.log('Token aud:', decoded.aud);
          console.log('Expected:', clientId);
          sendJSON(res, 401, { error: 'Token audience does not match GOOGLE_CLIENT_ID' });
          return;
        }

        const users = readJSON(usersFile);
        let user = users.find(u => u.email === decoded.email);

        if (!user) {
          user = {
            id: Date.now(),
            name: decoded.name || 'Google User',
            email: decoded.email,
            picture: decoded.picture || '',
            googleId: decoded.sub,
            provider: 'google',
            createdAt: new Date()
          };
          users.push(user);
          writeJSON(usersFile, users);
        } else {
          user.googleId = decoded.sub;
          user.picture = decoded.picture || user.picture;
          user.provider = 'google';
          writeJSON(usersFile, users);
        }

        // Return standardized user object
        sendJSON(res, 200, {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            picture: user.picture
          }
        });
      } catch (error) {
        sendJSON(res, 401, { error: 'Invalid token: ' + error.message });
      }
    });
  }

  // --- ORDERS ---
  else if (pathname === '/api/orders' && method === 'POST') {
    parseBody(req, (body) => {
      if (!body || !body.userId || !body.items) {
        sendJSON(res, 400, { error: 'Invalid data' });
        return;
      }

      const orders = readJSON(ordersFile);
      const newOrder = {
        id: Date.now(),
        userId: body.userId,
        items: body.items,
        total: body.total,
        status: 'confirmed',
        createdAt: new Date()
      };

      orders.push(newOrder);
      writeJSON(ordersFile, orders);
      sendJSON(res, 200, { success: true, orderId: newOrder.id });
    });
  }

  else if (pathname.match(/^\/api\/orders\/\d+$/) && method === 'GET') {
    const userId = parseInt(pathname.split('/')[3], 10);
    const orders = readJSON(ordersFile);
    const userOrders = orders.filter(o => o.userId === userId);
    sendJSON(res, 200, userOrders);
  }

  else {
    sendJSON(res, 404, { error: 'Not found' });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});