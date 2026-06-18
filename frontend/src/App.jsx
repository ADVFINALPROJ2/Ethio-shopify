import { useState } from 'react';
import { StorefrontPage } from './features/storefront/pages/StorefrontPage';
import ProductsPage from './features/products/pages/ProductsPage';
import { useAuth } from './features/auth/context/useAuth';
import './App.css';

function App() {
  const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param || '';
  const [storefrontSlug] = useState(() => {
    return startParam.startsWith('shop_') ? startParam.replace('shop_', '') : null;
  });

  const { isAuthenticated, isLoading, error } = useAuth();

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

  if (storefrontSlug) {
    return <StorefrontPage slug={storefrontSlug} />;
  }

  return <ProductsPage />;
}

export default App;
