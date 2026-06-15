import { useState, useEffect, useCallback } from 'react';
import { UsersPage } from './features/users/pages/UsersPage';
import { ProductsPage } from './features/products/pages/ProductsPage';
import { CartPage } from './features/cart/pages/CartPage';
import { useAuth } from './features/auth/context/useAuth';
import { getUsers } from './features/users/api/getUsers';
import { getCart } from './features/cart/api/getCart';
import { addToCart } from './features/cart/api/addToCart';
import './App.css';

const NAV_ITEMS = [
  { key: 'users', label: 'Users' },
  { key: 'products', label: 'Products' },
  { key: 'cart', label: 'Cart' }
];

function App() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const { user, isAuthenticated, isLoading, error } = useAuth();

  useEffect(() => {
    getUsers().then(setUsers).catch(console.error);
  }, []);

  const refreshCartCount = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const data = await getCart(userId);
      const count = data.cart.cart_items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      refreshCartCount(selectedUserId);
    }
  }, [selectedUserId, refreshCartCount]);

  const handleAddToCart = async (productId) => {
    if (!selectedUserId) {
      alert('Please select a user first from the dropdown above.');
      return;
    }
    try {
      await addToCart(selectedUserId, productId, 1);
      refreshCartCount(selectedUserId);
      alert('Added to cart!');
    } catch (error) {
      const msg = error.response?.data?.errors?.[0] || 'Failed to add to cart.';
      alert(msg);
    }
  };

  if (isLoading) {
    return (
      <main className="auth-screen" aria-busy="true">
        <section className="auth-panel">
          <div className="auth-spinner" />
          <h1>Signing you in</h1>
          <p>Checking your Telegram session with Ethio-Shopify.</p>
        </section>
      </main>
    );
  }

  if (error || !isAuthenticated) {
    return (
      <main className="auth-screen">
        <section className="auth-panel auth-panel--error">
          <p className="auth-kicker">Authentication required</p>
          <h1>Telegram sign-in failed</h1>
          <p>{error || 'We could not confirm your Telegram session.'}</p>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title">
          <span className="app-mark">ES</span>
          <div>
            <h1>Ethio-Shopify</h1>
            <p>Signed in as {user.fullname || user.first_name || user.username || 'Telegram user'}</p>
          </div>
        </div>
        <nav className="app-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={activeTab === item.key ? 'is-active' : ''}
              onClick={() => setActiveTab(item.key)}
              style={{ position: 'relative' }}
            >
              {item.label}
              {item.key === 'cart' && cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </button>
          ))}
        </nav>
        <select
          value={selectedUserId || ''}
          onChange={(e) => setSelectedUserId(Number(e.target.value))}
          className="user-selector"
        >
          <option value="">Select user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.fullname || user.username}
            </option>
          ))}
        </select>
      </header>

      <main className="app-content">
        {activeTab === 'users' && <UsersPage />}
        {activeTab === 'products' && (
          <ProductsPage onAddToCart={handleAddToCart} />
        )}
        {activeTab === 'cart' && (
          <CartPage userId={selectedUserId} onCartUpdated={() => refreshCartCount(selectedUserId)} />
        )}
      </main>
    </div>
  );
}

export default App;
