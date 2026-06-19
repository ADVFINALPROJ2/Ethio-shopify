import { useState } from 'react';
import ProductsPage from './features/products/pages/ProductsPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { ShopSetupPage } from './features/shop-creation/pages/ShopSetupPage';
import { useAuth } from './features/auth/context/useAuth';
import './App.css';

function App() {
  const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param || '';
  const [storefrontSlug] = useState(() => {
    if (startParam.startsWith('shop_')) {
      const slug = startParam.replace('shop_', '');
      if (/^[a-zA-Z0-9_-]+$/.test(slug)) {
        return slug;
      }
    }
    return null;
  });

  const { isAuthenticated, isLoading, error, user } = useAuth();

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

  if (user?.has_shop) {
    return <DashboardPage />;
  }

  if (storefrontSlug) {
    return <ProductsPage slug={storefrontSlug} />;
  }

  return <ShopSetupPage />;
}

export default App;
