import React, { useEffect, useState } from 'react';
import { AddressDetailRow } from '../components/AddressDetailRow';
import { getOrder } from '../api/getOrder';

// SVG Icons Inline for Address Block Identification
const UserIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const PinIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const PhoneIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const GlobeIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const BuildingIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="16"></line><line x1="15" y1="22" x2="15" y2="16"></line><line x1="9" y1="16" x2="15" y2="16"></line><path d="M8 6h2v2H8V6zm0 4h2v2H8v-2zm8-4h2v2h-2V6zm0 4h2v2h-2v-2z"></path></svg>;
const MapIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>;
const HomeIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;

export const OrderDetailsPage = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!orderId) return;
    const loadOrder = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const data = await getOrder(orderId);
        setOrder(data);
      } catch (error) {
        setErrorMessage(error.response?.data?.error || 'Unable to load order details.');
      } finally {
        setIsLoading(false);
      }
    };
    loadOrder();
  }, [orderId]);

  const formatCurrency = (value) => `ETB ${Number(value || 0).toLocaleString()}`;
  const formatDate = (value) => value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const formatTime = (value) => value ? new Date(value).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';

  if (isLoading) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onBack} style={styles.backButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div style={styles.logoContainer}>
            <span style={styles.logoIcon}>🛍️</span>
            <span style={styles.logoText}>EthioShopify</span>
          </div>
        </header>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#66767e', fontSize: '14px' }}>Loading order details...</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <button onClick={onBack} style={styles.backButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div style={styles.logoContainer}>
            <span style={styles.logoIcon}>🛍️</span>
            <span style={styles.logoText}>EthioShopify</span>
          </div>
        </header>
        <div style={{ textAlign: 'center', padding: '40px', color: '#b91c1c' }}>{errorMessage}</div>
      </div>
    );
  }

  if (!order) return null;

  const totalItems = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const firstItem = order.order_items?.[0];

  return (
    <div style={styles.container}>
      {/* GLOBAL HEADER BAR */}
      <header style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
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

      {/* TOP ORDER SUMMARY IDENTITY BANNER */}
      <section style={styles.identityRow}>
        <div style={styles.bagIconContainer}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <div style={styles.identityMeta}>
          <h1 style={styles.orderTitle}>{order.order_number}</h1>
          <div style={styles.statusBadgeRow}>
            <span style={styles.pendingBadge}>{order.status}</span>
            <span style={styles.dateStampText}>{formatDate(order.created_at)} • {formatTime(order.created_at)}</span>
          </div>
        </div>
      </section>

      {/* ITEM SPECIFIC DETAIL BLOCK */}
      <section style={styles.cardBlock}>
        <h3 style={styles.cardSectionTitle}>Product Detail</h3>
        <div style={styles.productContent}>
          <div style={styles.imagePlaceholder}>
            {firstItem?.product?.image_urls?.[0] ? (
              <img src={firstItem.product.image_urls[0]} alt={firstItem.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <>
                <span style={{ fontSize: '36px' }}>🛍️</span>
                <span style={styles.imagePlaceholderText}>[ Product Image ]</span>
              </>
            )}
          </div>
          <div style={styles.productMeta}>
            <h4 style={styles.productName}>{firstItem?.product_name || firstItem?.product?.name || 'Product'}</h4>
            <span style={styles.priceTag}>{formatCurrency(firstItem?.price)}</span>
            <span style={styles.quantityCount}>Quantity: {firstItem?.quantity || 0}</span>
          </div>
        </div>
        {order.order_items?.length > 1 && (
          <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '13px', color: '#66767e' }}>
            +{order.order_items.length - 1} more item(s) in this order
          </div>
        )}
      </section>

      {/* PRICE METRICS RATIO CARD */}
      <section style={styles.cardBlock}>
        <h3 style={styles.cardSectionTitle}>Order Summary</h3>
        <div style={styles.summarySplitRow}>
          <div style={styles.summaryCell}>
            <span style={styles.summaryLabel}>Total Items</span>
            <span style={styles.summaryValue}>{totalItems}</span>
          </div>
          <div style={styles.summaryCell}>
            <span style={styles.summaryLabel}>Total Price</span>
            <span style={{ ...styles.summaryValue, color: '#00a84e' }}>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </section>

      {/* CUSTOMER PROFILE & FULFILLMENT DESTINATION */}
      <section style={styles.cardBlock}>
        <h3 style={styles.cardSectionTitle}>Customer & Shipping Address</h3>
        <div style={styles.addressListWrapper}>
          <AddressDetailRow icon={UserIcon} label="Full Name" value={order.customer_name || 'N/A'} />
          <AddressDetailRow icon={PhoneIcon} label="Phone Number" value={order.phone_number || 'N/A'} />
          {order.region && <AddressDetailRow icon={PinIcon} label="Region" value={order.region} />}
          {order.country && <AddressDetailRow icon={GlobeIcon} label="Country" value={order.country} />}
          {order.city && <AddressDetailRow icon={BuildingIcon} label="City" value={order.city} />}
          {order.address && <AddressDetailRow icon={MapIcon} label="Address" value={order.address} />}
        </div>
      </section>

      {/* STICKY BOTTOM NAV */}
      <nav style={styles.bottomNav}>
        <div style={{ ...styles.navItem, color: '#00a84e' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
          <span style={{ marginTop: '2px' }}>Dashboard</span>
        </div>
        <div style={{ ...styles.navItem, color: '#66767e' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          </svg>
          <span style={{ marginTop: '2px' }}>Orders</span>
        </div>
        <div style={{ ...styles.navItem, color: '#66767e' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          <span style={{ marginTop: '2px' }}>Profile</span>
        </div>
      </nav>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    padding: '16px 16px 90px 16px',
    boxSizing: 'border-box',
    maxWidth: '480px',
    margin: '0 auto',
  },
  header: { display: 'flex', alignItems: 'center', marginBottom: '20px' },
  backButton: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: '4px 8px 4px 0',
    color: '#0e1e25',
    display: 'flex',
    alignItems: 'center',
  },
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
  identityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  bagIconContainer: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  identityMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  orderTitle: { margin: 0, fontSize: '18px', fontWeight: '800', color: '#0e1e25' },
  statusBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pendingBadge: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#d97706',
    backgroundColor: '#fffbeb',
    padding: '1px 6px',
    borderRadius: '4px',
  },
  dateStampText: {
    fontSize: '11px',
    color: '#66767e',
    fontWeight: '500',
  },
  cardBlock: {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f4f8',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '16px',
  },
  cardSectionTitle: {
    margin: '0 0 14px 0',
    fontSize: '14px',
    fontWeight: '700',
    color: '#0e1e25',
  },
  productContent: {
    display: 'flex',
    gap: '14px',
  },
  imagePlaceholder: {
    width: '84px',
    height: '92px',
    backgroundColor: '#f1f5f9',
    border: '1px dashed #ccd4d8',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  imagePlaceholderText: {
    fontSize: '8px',
    color: '#a0aec0',
    marginTop: '2px',
    textAlign: 'center',
  },
  productMeta: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  productName: { margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700', color: '#0e1e25' },
  skuText: { fontSize: '11px', color: '#66767e', marginBottom: '2px' },
  categoryPath: { fontSize: '11px', color: '#a0aec0', marginBottom: '8px' },
  priceTag: { fontSize: '14px', fontWeight: '700', color: '#00a84e', marginBottom: '2px' },
  quantityCount: { fontSize: '12px', color: '#66767e', fontWeight: '500' },
  summarySplitRow: {
    display: 'flex',
    gap: '12px',
  },
  summaryCell: {
    flex: 1,
    backgroundColor: '#f8fafc',
    border: '1px solid #f1f5f9',
    borderRadius: '8px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  summaryLabel: {
    fontSize: '11px',
    color: '#66767e',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#0e1e25',
  },
  addressListWrapper: {
    display: 'flex',
    flexDirection: 'column',
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
    zIndex: 10,
  },
  navItem: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '11px',
    fontWeight: '500',
  }
};
