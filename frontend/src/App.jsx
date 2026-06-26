import { useState, useCallback } from 'react';
import ProductsPage from './features/products/pages/ProductsPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { ShopSetupPage } from './features/shop-creation/pages/ShopSetupPage';
import { SellerLandingPage } from './features/shop-creation/pages/SellerLandingPage';
import { createShop } from './features/shop-creation/api/createShop';
import { useAuth } from './features/auth/context/useAuth';
import CartPage from './features/cart/pages/CartPage';
import { BuyerOrdersPage } from './features/orders/pages/BuyerOrdersPage';
import './App.css';
import { getStartParam } from '../src/lib/getStartParam';

function App() {
  const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param || getStartParam() || '';
  const [storefrontSlug] = useState(() => {
    if (startParam.startsWith('shop_')) {
      const slug = startParam.replace('shop_', '');
      if (/^[a-zA-Z0-9_-]+$/.test(slug)) {
        return slug;
      }
    }
    return null;
  });

  const { isAuthenticated, isLoading, error, user, refreshUser } = useAuth();
  const [isCreatingShop, setIsCreatingShop] = useState(false);
  const [isSubmittingShop, setIsSubmittingShop] = useState(false);
  const [shopCreationError, setShopCreationError] = useState('');
  const [buyerView, setBuyerView] = useState('products');
  const [cartVersion, setCartVersion] = useState(0);

  const handleCartChanged = useCallback(() => {
    setCartVersion((version) => version + 1);
  }, []);

  const handleShopCreated = async (formData) => {
    setIsSubmittingShop(true);
    setShopCreationError('');

    const submitData = new FormData();
    submitData.append('shop[name]', formData.shopName);
    submitData.append('shop[category_id]', formData.categoryId);
    submitData.append('shop[email]', formData.email);
    submitData.append('shop[phone_code]', formData.phoneCode);
    submitData.append('shop[phone_number]', formData.phoneNumber);
    submitData.append('shop[country]', formData.country);
    submitData.append('shop[region]', formData.region);
    submitData.append('shop[city]', formData.city);
    submitData.append('shop[address]', formData.address);
    submitData.append('shop[description]', formData.description);

    if (formData.logo) {
      submitData.append('shop[logo]', formData.logo);
    }

    try {
      await createShop(submitData);
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
      await refreshUser();
    } catch (err) {
      setShopCreationError(err.response?.data?.errors?.join(', ') || err.response?.data?.error || 'Unable to create shop.');
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
      }
    } finally {
      setIsSubmittingShop(false);
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

  if (storefrontSlug) {
    if (buyerView === 'cart') {
      return (
        <CartPage
          userId={user?.id}
          onBack={() => setBuyerView('products')}
          onViewOrders={() => setBuyerView('orders')}
          onCartChanged={handleCartChanged}
        />
      );
    }

    if (buyerView === 'orders') {
      return <BuyerOrdersPage onBack={() => setBuyerView('products')} />;
    }

    return (
      <ProductsPage
        slug={storefrontSlug}
        userId={user?.id}
        onGoToCart={() => setBuyerView('cart')}
        onGoToOrders={() => setBuyerView('orders')}
        cartVersion={cartVersion}
        onCartChanged={handleCartChanged}
      />
    );
  }

  if (user?.has_shop) {
    return <DashboardPage />;
  }

  if (isCreatingShop) {
    return (
      <ShopSetupPage
        onBack={() => setIsCreatingShop(false)}
        onComplete={handleShopCreated}
        error={shopCreationError}
        isLoading={isSubmittingShop}
      />
    );
  }

  return <SellerLandingPage onCreateShopTrigger={() => setIsCreatingShop(true)} />;
}

export default App;
