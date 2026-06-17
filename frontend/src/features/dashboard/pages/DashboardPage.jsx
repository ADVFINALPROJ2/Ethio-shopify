import React, { useEffect, useState } from 'react';
import { StatCard } from '../components/StatCard';
import { ProductRow } from '../components/ProductRow';
import { AddProductPage } from '../../products/pages/AddProductPage';
import { ProductDetailsPage } from '../../products/pages/ProductDetailsPage';
import { OrdersPage } from '../../orders/pages/OrdersPage';
import { OrderDetailsPage } from '../../orders/pages/OrderDetailsPage';
import { EditProfilePage } from '../../profile/pages/EditProfilePage';
import { getDashboardStats } from '../api/getDashboardStats';
import { getMyShop } from '../api/getMyShop';

// SVG Icons Inline
const BagIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" /></svg>;
const OrderIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
const EarningsIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
const EyeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;

export const DashboardPage = () => {
  const [view, setView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [stats, setStats] = useState(null);
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadDashboard = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const statsData = await getDashboardStats();
      setStats(statsData);
      setProducts(statsData.recent_products || []);

      try {
        const shopData = await getMyShop();
        setShop(shopData);
      } catch {
        setShop(null);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Unable to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const formatCurrency = (value) => `ETB ${Number(value || 0).toLocaleString()}`;
  const getInitials = (name = '') => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SH';

  if (view === 'add-product') {
    return (
      <AddProductPage
        onCancel={() => setView('dashboard')}
        onSaveSuccess={() => {
          setView('dashboard');
          loadDashboard();
        }}
      />
    );
  }

  if (view === 'product-details') {
    return (
      <div style={{ minHeight: '100vh' }}>
        <ProductDetailsPage
          productId={selectedProduct?.id}
          onBack={() => setView('dashboard')}
        />
        <nav style={styles.bottomNav}>
          <button onClick={() => { setView('dashboard'); setActiveTab('dashboard'); }} style={{ ...styles.navItem, color: '#00a84e' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </button>
          <button onClick={() => { setView('dashboard'); setActiveTab('orders'); }} style={{ ...styles.navItem, color: '#66767e' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            </svg>
            Orders
          </button>
          <button onClick={() => { setView('dashboard'); setActiveTab('profile'); }} style={{ ...styles.navItem, color: '#66767e' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </button>
        </nav>
      </div>
    );
  }

  if (view === 'order-details') {
    return (
      <div style={{ minHeight: '100vh' }}>
        <OrderDetailsPage orderId={selectedOrderId} onBack={() => setView('dashboard')} />
        <nav style={styles.bottomNav}>
          <button onClick={() => { setView('dashboard'); setActiveTab('dashboard'); }} style={{ ...styles.navItem, color: '#00a84e' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </button>
          <button onClick={() => { setView('dashboard'); setActiveTab('orders'); }} style={{ ...styles.navItem, color: '#66767e' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            </svg>
            Orders
          </button>
          <button onClick={() => { setView('dashboard'); setActiveTab('profile'); }} style={{ ...styles.navItem, color: '#66767e' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </button>
        </nav>
      </div>
    );
  }

  if (activeTab !== 'dashboard') {
    const page = activeTab === 'orders'
      ? <OrdersPage onSelectOrder={(orderId) => { setSelectedOrderId(orderId); setView('order-details'); }} />
      : <EditProfilePage onCancel={() => setActiveTab('dashboard')} onSave={() => setActiveTab('dashboard')} />;

    return (
      <div style={{ minHeight: '100vh' }}>
        {page}
        {/* Functional bottom nav overlay — always rendered so tab switching works */}
        <nav style={styles.bottomNav}>
          <button onClick={() => setActiveTab('dashboard')} style={{ ...styles.navItem, color: activeTab === 'dashboard' ? '#00a84e' : '#66767e' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={activeTab === 'dashboard' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </button>
          <button onClick={() => setActiveTab('orders')} style={{ ...styles.navItem, color: activeTab === 'orders' ? '#00a84e' : '#66767e' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={activeTab === 'orders' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            </svg>
            Orders
          </button>
          <button onClick={() => setActiveTab('profile')} style={{ ...styles.navItem, color: activeTab === 'profile' ? '#00a84e' : '#66767e' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={activeTab === 'profile' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </button>
        </nav>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* GLOBAL HEADER */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>🛍️</span>
          <span style={styles.logoText}>EthioShopify</span>
        </div>
        <div style={styles.userMenu}>
          <div style={styles.avatar}>S</div>
          <span style={styles.roleText}>Seller</span>
          <span style={styles.dropdownArrow}>▾</span>
        </div>
      </header>

      {/* DASHBOARD WELCOME */}
      <section style={styles.welcomeSection}>
        <div>
          <h1 style={styles.greeting}>Good morning, Seller! 👋</h1>
          <p style={styles.subGreeting}>Here's what's happening with your shop today.</p>
        </div>
        <button style={styles.viewShopBtn}>
          View Shop 🔗
        </button>
      </section>

      {/* SHOP CARD BANNER */}
      <section style={styles.shopCard}>
        <div style={{ ...styles.shopLogoBlock, backgroundColor: '#dbeafe' }}>
          {shop?.logo_url ? (
            <img src={shop.logo_url} alt={shop.name} style={styles.shopLogoImage} />
          ) : (
            <span style={styles.shopLogoText}>{getInitials(shop?.name)}</span>
          )}
        </div>
        <div style={styles.shopMeta}>
          <h2 style={styles.shopName}>{shop?.name || 'No shop created yet'}</h2>
          <span style={styles.badge}>{shop?.status || 'Setup needed'}</span>
          <div style={styles.metaRow}>
            <span style={{ ...styles.metaIcon, backgroundColor: '#fef3c7' }}>T</span>
            <p style={styles.metaText}>{shop?.category || 'Shop category'}</p>
          </div>
          <div style={styles.metaRow}>
            <span style={{ ...styles.metaIcon, backgroundColor: '#d1fae5' }}>C</span>
            <p style={styles.metaText}>{shop?.city || shop?.region || 'Location not set'}</p>
          </div>
        </div>
        <button style={styles.dotMenuBtn}>⋮</button>
      </section>

      {/* STORE LINK CARD */}
      {shop?.telegram_url && (
        <section style={styles.storeLinkCard}>
          <div style={styles.storeLinkHeader}>
            <h3 style={styles.storeLinkTitle}>Share Your Store</h3>
            <span style={styles.storeLinkBadge}>Primary Link</span>
          </div>
          <p style={styles.storeLinkDesc}>Share this link with your customers so they can order directly from Telegram.</p>
          
          <div style={styles.linkBox}>
            <span style={styles.linkText}>{shop.telegram_url}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(shop.telegram_url);
                if (window.Telegram?.WebApp) window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
              }} 
              style={styles.copyBtn}
            >
              Copy
            </button>
          </div>
          
          <button 
            onClick={() => {
              const text = `Check out my shop ${shop.name} on Telegram!`;
              if (window.Telegram?.WebApp?.openTelegramLink) {
                window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(shop.telegram_url)}&text=${encodeURIComponent(text)}`);
              } else if (navigator.share) {
                navigator.share({
                  title: shop.name,
                  text: text,
                  url: shop.telegram_url
                });
              } else {
                navigator.clipboard.writeText(shop.telegram_url);
                alert("Link copied to clipboard!");
              }
            }}
            style={styles.shareBtn}
          >
            Share Store 🚀
          </button>
        </section>
      )}

      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
      {isLoading && <div style={styles.loadingMessage}>Loading dashboard...</div>}

      {/* FOUR METRIC ROW - HORIZONTAL SCROLL */}
      <section style={styles.statsRow}>
        <StatCard icon={BagIcon} iconBg="#f2fbf5" iconColor="#00a84e" title="Total Products" value={stats?.total_products ?? 0} />
        <StatCard icon={OrderIcon} iconBg="#eff6ff" iconColor="#2563eb" title="Total Orders" value={stats?.total_orders ?? 0} />
        <StatCard icon={EarningsIcon} iconBg="#fffbeb" iconColor="#d97706" title="Total Sales" value={formatCurrency(stats?.total_sales)} />
        <StatCard icon={EyeIcon} iconBg="#faf5ff" iconColor="#7c3aed" title="Shop Views" value={stats?.shop_views ?? 0} />
      </section>

      {/* PRODUCTS SECTION LIST CONTAINER */}
      <section style={styles.productsSection}>
        <div style={styles.sectionHeadingRow}>
          <h3 style={styles.sectionTitle}>Your Products</h3>
          <button style={styles.viewAllProductsBtn}>View all products ›</button>
        </div>
        <div style={styles.productsListCard}>
          {products.length > 0 ? products.map(product => (
            <ProductRow 
              key={product.id}
              name={product.name}
              price={formatCurrency(product.price)}
              stockCount={product.quantity || 0}
              onClick={() => {
                setSelectedProduct(product);
                setView('product-details');
              }}
            />
          )) : (
            <div style={styles.emptyProducts}>No products yet.</div>
          )}
        </div>
      </section>

      {/* ADD PRODUCT CTA BANNER */}
      <section style={styles.addProductBanner}>
        <div style={styles.addProductLeft}>
          <div style={styles.plusCircleIcon}>＋</div>
          <div>
            <h4 style={styles.addTitle}>Add New Product</h4>
            <p style={styles.addSubtitle}>Expand your shop by adding new products.</p>
          </div>
        </div>
        <button style={styles.actionAddBtn} onClick={() => setView('add-product')}>Add Product</button>
      </section>

      {/* BOTTOM NAVIGATION FIXED POSITION WRAPPER */}
      <nav style={styles.bottomNav}>
        <button onClick={() => setActiveTab('dashboard')} style={{ ...styles.navItem, color: activeTab === 'dashboard' ? '#00a84e' : '#66767e' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={activeTab === 'dashboard' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
          Dashboard
        </button>
        <button onClick={() => setActiveTab('orders')} style={{ ...styles.navItem, color: activeTab === 'orders' ? '#00a84e' : '#66767e' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          </svg>
          Orders
        </button>
        <button onClick={() => setActiveTab('profile')} style={{ ...styles.navItem, color: activeTab === 'profile' ? '#00a84e' : '#66767e' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          Profile
        </button>
      </nav>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    padding: '16px 16px 80px 16px',
    boxSizing: 'border-box',
    maxWidth: '480px',
    margin: '0 auto',
  },
  header: { display: 'flex', alignItems: 'center', marginBottom: '20px' },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '4px' },
  logoIcon: { fontSize: '18px' },
  logoText: { fontWeight: '700', fontSize: '16px', color: '#00a84e' },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#ffffff',
    padding: '4px 8px',
    borderRadius: '20px',
    border: '1px solid #eaeaea',
    marginLeft: 'auto',
  },
  avatar: {
    width: '20px',
    height: '20px',
    backgroundColor: '#e2f7ec',
    color: '#00a84e',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  roleText: { fontSize: '12px', color: '#4a555a' },
  dropdownArrow: { fontSize: '9px', color: '#888' },
  welcomeSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  greeting: { fontSize: '20px', fontWeight: '800', color: '#0e1e25', margin: '0 0 4px 0' },
  subGreeting: { fontSize: '12px', color: '#66767e', margin: 0 },
  viewShopBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #00a84e',
    color: '#00a84e',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  shopCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f4f8',
    borderRadius: '14px',
    padding: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    position: 'relative',
    marginBottom: '20px',
  },
  shopLogoBlock: {
    width: '56px',
    height: '56px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  shopLogoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  shopLogoText: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#4a5568',
  },
  shopMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  shopName: { margin: 0, fontSize: '15px', fontWeight: '700', color: '#0e1e25', inlineSize: 'max-content' },
  badge: {
    fontSize: '10px',
    fontWeight: '600',
    color: '#00a84e',
    backgroundColor: '#e2f7ec',
    padding: '1px 6px',
    borderRadius: '4px',
    width: 'fit-content',
    margin: '2px 0',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  metaIcon: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '9px',
    fontWeight: '700',
    color: '#4a5568',
    flexShrink: 0,
  },
  metaText: { margin: 0, fontSize: '11px', color: '#66767e' },
  errorMessage: {
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '12px',
    marginBottom: '14px',
  },
  loadingMessage: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    border: '1px solid #bfdbfe',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '12px',
    marginBottom: '14px',
  },
  dotMenuBtn: {
    position: 'absolute',
    right: '14px',
    top: '14px',
    background: 'none',
    border: 'none',
    fontSize: '18px',
    color: '#66767e',
    cursor: 'pointer',
  },
  storeLinkCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f4f8',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  storeLinkHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px'
  },
  storeLinkTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0e1e25',
    margin: 0
  },
  storeLinkBadge: {
    backgroundColor: '#e0e7ff',
    color: '#4f46e5',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '10px'
  },
  storeLinkDesc: {
    fontSize: '12px',
    color: '#66767e',
    margin: '0 0 12px 0'
  },
  linkBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '8px 12px',
    marginBottom: '12px'
  },
  linkText: {
    fontSize: '12px',
    color: '#0f172a',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginRight: '8px',
    fontWeight: '500'
  },
  copyBtn: {
    background: 'none',
    border: 'none',
    color: '#00a84e',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    padding: '4px 8px'
  },
  shareBtn: {
    backgroundColor: '#00a84e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px',
    width: '100%',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px'
  },
  statsRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    overflowX: 'auto',
  },
  productsSection: { marginBottom: '20px' },
  sectionHeadingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  sectionTitle: { margin: 0, fontSize: '15px', fontWeight: '700', color: '#0e1e25' },
  viewAllProductsBtn: {
    background: 'none',
    border: 'none',
    color: '#00a84e',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  productsListCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f4f8',
    borderRadius: '14px',
    padding: '0 14px',
  },
  emptyProducts: {
    padding: '20px',
    textAlign: 'center',
    color: '#66767e',
    fontSize: '13px',
  },
  addProductBanner: {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f4f8',
    borderRadius: '12px',
    padding: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  addProductLeft: { display: 'flex', gap: '12px', alignItems: 'center' },
  plusCircleIcon: {
    width: '36px',
    height: '36px',
    backgroundColor: '#e2f7ec',
    borderRadius: '50%',
    color: '#00a84e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  addTitle: { margin: '0 0 2px 0', fontSize: '13px', fontWeight: '700', color: '#0e1e25' },
  addSubtitle: { margin: 0, fontSize: '11px', color: '#66767e' },
  actionAddBtn: {
    backgroundColor: '#00a84e',
    color: '#ffffff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '480px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '8px 0 20px 0',
    boxSizing: 'border-box',
    zIndex: 20,
  },
  navItem: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    fontWeight: '500',
    cursor: 'pointer',
  }
};
