import React, { useState } from 'react';
import { StatCard } from '../components/StatCard';
import { ProductRow } from '../components/ProductRow';
import { AddProductPage } from '../../products/pages/AddProductPage';
import { ProductDetailsPage } from '../../products/pages/ProductDetailsPage';

// SVG Icons Inline
const BagIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" /></svg>;
const OrderIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
const EarningsIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
const EyeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;

export const DashboardPage = () => {
  const [view, setView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (view === 'add-product') {
    return (
      <AddProductPage
        onCancel={() => setView('dashboard')}
        onSaveSuccess={() => setView('dashboard')}
      />
    );
  }

  if (view === 'product-details') {
    return (
      <ProductDetailsPage
        onBack={() => setView('dashboard')}
      />
    );
  }

  const productsData = [
    { id: 1, name: 'Elegant Green Dress', price: 'ETB 1,850', stock: 12 },
    { id: 2, name: 'Classic White T-Shirt', price: 'ETB 950', stock: 25 },
    { id: 3, name: 'Genuine Leather Handbag', price: 'ETB 2,750', stock: 5 },
    { id: 4, name: 'Urban White Sneakers', price: 'ETB 2,100', stock: 18 },
    { id: 5, name: 'Stylish Sunglasses', price: 'ETB 1,200', stock: 40 },
  ];

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
          <span style={styles.shopLogoText}>AF</span>
        </div>
        <div style={styles.shopMeta}>
          <h2 style={styles.shopName}>Abeba Fashion</h2>
          <span style={styles.badge}>Active</span>
          <div style={styles.metaRow}>
            <span style={{ ...styles.metaIcon, backgroundColor: '#fef3c7' }}>T</span>
            <p style={styles.metaText}>Fashion & Apparel</p>
          </div>
          <div style={styles.metaRow}>
            <span style={{ ...styles.metaIcon, backgroundColor: '#d1fae5' }}>C</span>
            <p style={styles.metaText}>Member since May 2024</p>
          </div>
        </div>
        <button style={styles.dotMenuBtn}>⋮</button>
      </section>

      {/* FOUR METRIC ROW - HORIZONTAL SCROLL */}
      <section style={styles.statsRow}>
        <StatCard icon={BagIcon} iconBg="#f2fbf5" iconColor="#00a84e" title="Total Products" value="42" />
        <StatCard icon={OrderIcon} iconBg="#eff6ff" iconColor="#2563eb" title="Total Orders" value="128" />
        <StatCard icon={EarningsIcon} iconBg="#fffbeb" iconColor="#d97706" title="Total Sales" value="ETB 28,450" />
        <StatCard icon={EyeIcon} iconBg="#faf5ff" iconColor="#7c3aed" title="Shop Views" value="1,245" />
      </section>

      {/* PRODUCTS SECTION LIST CONTAINER */}
      <section style={styles.productsSection}>
        <div style={styles.sectionHeadingRow}>
          <h3 style={styles.sectionTitle}>Your Products</h3>
          <button style={styles.viewAllProductsBtn}>View all products ›</button>
        </div>
        <div style={styles.productsListCard}>
          {productsData.map(product => (
            <ProductRow 
              key={product.id}
              name={product.name}
              price={product.price}
              stockCount={product.stock}
              onClick={() => {
                setSelectedProduct(product);
                setView('product-details');
              }}
            />
          ))}
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
