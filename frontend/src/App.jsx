import { useState } from 'react';
import { UsersPage } from './features/users/pages/UsersPage';
import { ProductsPage } from './features/products/pages/ProductsPage';
import { useAuth } from './features/auth/context/useAuth';
import './App.css';

const NAV_ITEMS = [
  { key: 'users', label: 'Users' },
  { key: 'products', label: 'Products' }
];

function App() {
  const [activeTab, setActiveTab] = useState('users');
  const { user, isAuthenticated, isLoading, error } = useAuth();

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
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-content">
        {activeTab === 'users' && <UsersPage />}
        {activeTab === 'products' && <ProductsPage />}
      </main>
    </div>
  );
}

export default App;
