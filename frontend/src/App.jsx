import { useState, useEffect } from 'react';
import { UsersPage } from './features/users/pages/UsersPage';
import { SellerLandingPage } from './features/shop-creation/pages/SellerLandingPage';
import { ShopSetupPage } from './features/shop-creation/pages/ShopSetupPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { StorefrontPage } from './features/storefront/pages/StorefrontPage';
import { createShop } from './features/shop-creation/api/createShop';
import { useAuth } from './features/auth/context/useAuth';
import { getMyShop } from './features/dashboard/api/getMyShop';
import './App.css';

const NAV_ITEMS = [
  { key: 'users', label: 'Users' },
  { key: 'shop', label: 'Create Shop' }
];

function App() {
  const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param || '';
  const [storefrontSlug, setStorefrontSlug] = useState(() => {
    return startParam.startsWith('shop_') ? startParam.replace('shop_', '') : null;
  });

  const [activeTab, setActiveTab] = useState('shop');
  const [shopStep, setShopStep] = useState('landing');
  const [shopError, setShopError] = useState(null);
  const [hasShop, setHasShop] = useState(null);
  const [isCheckingShop, setIsCheckingShop] = useState(false);
  const { user, isAuthenticated, isLoading, error } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !storefrontSlug) {
      setIsCheckingShop(true);
      getMyShop()
        .then(() => {
          setHasShop(true);
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            setHasShop(false);
          } else {
            console.error('Failed to fetch shop status:', err);
            // Default to not having a shop on error so they can try again or see the UI
            setHasShop(false);
          }
        })
        .finally(() => {
          setIsCheckingShop(false);
        });
    }
  }, [isAuthenticated]);

  if (isLoading || isCheckingShop) {
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
              {item.key === 'shop' ? (hasShop ? 'My Shop' : 'Create Shop') : item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-content">
        {activeTab === 'users' && <UsersPage />}
        {activeTab === 'shop' && hasShop === true && (
          <DashboardPage />
        )}
        {activeTab === 'shop' && hasShop === false && shopStep === 'landing' && (
          <SellerLandingPage onCreateShopTrigger={() => setShopStep('setup')} />
        )}
        {activeTab === 'shop' && hasShop === false && shopStep === 'setup' && (
          <ShopSetupPage
            onBack={() => setShopStep('landing')}
            onComplete={async (formData) => {
              setShopError(null);
              try {
                const payload = new FormData();
                payload.append('shop[name]', formData.shopName);
                payload.append('shop[category_id]', formData.categoryId);
                if (formData.description) payload.append('shop[description]', formData.description);
                if (formData.email) payload.append('shop[email]', formData.email);
                if (formData.phoneCode) payload.append('shop[phone_code]', formData.phoneCode);
                if (formData.phoneNumber) payload.append('shop[phone_number]', formData.phoneNumber);
                if (formData.country) payload.append('shop[country]', formData.country);
                if (formData.region) payload.append('shop[region]', formData.region);
                if (formData.city) payload.append('shop[city]', formData.city);
                if (formData.address) payload.append('shop[address]', formData.address);
                if (formData.logo) payload.append('shop[logo]', formData.logo);
                await createShop(payload);
                setHasShop(true);
              } catch (err) {
                setShopError(err.response?.data?.errors?.join(', ') || 'Failed to create shop');
              }
            }}
            error={shopError}
          />
        )}
      </main>
    </div>
  );
}

export default App;
