import React, { useEffect, useState } from 'react';
import { OrderHistoryRow } from '../components/OrderHistoryRow';
import { OrderDetailsPage } from '../../orders/pages/OrderDetailsPage';
import { getProduct } from '../api/getProduct';
import { getProductOrders } from '../api/getProductOrders';

export const ProductDetailsPage = ({ productId, onBack }) => {
  const [view, setView] = useState('details');
  const [searchQuery, setSearchQuery] = useState('');
  const [product, setProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formatCurrency = (value) => `ETB ${Number(value || 0).toLocaleString()}`;
  const formatDate = (value) => value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const formatTime = (value) => value ? new Date(value).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';

  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [productData, productOrders] = await Promise.all([
          getProduct(productId),
          getProductOrders(productId)
        ]);
        setProduct(productData);
        setOrders(productOrders);
      } catch (error) {
        setErrorMessage(error.response?.data?.error || 'Unable to load product details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (view === 'order-details') {
    return (
      <OrderDetailsPage orderId={selectedOrderId} onBack={() => setView('details')} />
    );
  }

  const filteredOrders = orders.filter(order => 
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const mainImageUrl = product?.image_urls?.[0];

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

      {/* CORE PRODUCT SNAPSHOT OVERVIEW */}
      <section style={styles.mainSnapshotCard}>
        <div style={styles.mainImagePlaceholder}>
          {mainImageUrl ? (
            <img src={mainImageUrl} alt={product?.name} style={styles.productImage} />
          ) : (
            <>
              <span style={{ fontSize: '40px' }}>🛍️</span>
              <div style={styles.imageLabelTag}>No image</div>
            </>
          )}
          <button style={styles.editImageBtn}>✏️ Edit</button>
        </div>

        <div style={styles.snapshotInfo}>
          <div style={styles.titleRow}>
            <h1 style={styles.productTitle}>{product?.name || 'Product'}</h1>
            <button style={styles.dotsButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#66767e" strokeWidth="2.5">
                <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="17" r="1" />
              </svg>
            </button>
          </div>
          <span style={styles.activeBadge}>{product?.status || 'active'}</span>
          <span style={styles.categorySubtext}>🏷️ {product?.product_category_name || product?.category_name || 'Uncategorized'}</span>
          <p style={styles.productDescription}>
            {product?.description || 'No description provided.'}
          </p>
        </div>
      </section>

      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
      {isLoading && <div style={styles.loadingMessage}>Loading product details...</div>}

      {/* QUAD ANALYTICS METRIC HUB */}
      <section style={styles.analyticsGrid}>
        <div style={styles.metricBox}>
          <span style={styles.metricLabel}>Price</span>
          <span style={styles.metricValue}>{formatCurrency(product?.price)}</span>
        </div>
        <div style={styles.metricBox}>
          <span style={styles.metricLabel}>Stock Quantity</span>
          <span style={{ ...styles.metricValue, color: '#00a84e' }}>{product?.quantity || 0} <span style={styles.stockUnit}>in stock</span></span>
        </div>
        <div style={styles.metricBox}>
          <span style={styles.metricLabel}>Total Sold</span>
          <span style={styles.metricValue}>{product?.total_sold || 0}</span>
        </div>
        <div style={styles.metricBox}>
          <span style={styles.metricLabel}>Total Revenue</span>
          <span style={styles.metricValue}>{formatCurrency(product?.total_revenue)}</span>
        </div>
      </section>

      {/* GALLERY MANAGEMENT SECTION */}
      <section style={styles.sectionBlock}>
        <h3 style={styles.sectionTitle}>Product Images</h3>
        <div style={styles.galleryRow}>
          {(product?.image_urls || []).map((imageUrl, index) => (
            <div key={imageUrl} style={{ ...styles.thumbPlaceholder, border: index === 0 ? '2px solid #00a84e' : '1px dashed #ccd4d8' }}>
              <img src={imageUrl} alt={`${product?.name} ${index + 1}`} style={styles.thumbImage} />
            </div>
          ))}
          <button style={styles.addImageSquare}>
            <span style={{ fontSize: '18px', color: '#66767e' }}>＋</span>
            <span style={styles.addImageText}>Add Image</span>
          </button>
        </div>
      </section>

      {/* RELATIONAL ORDERS ACCOUNTABILITY LIST */}
      <section style={styles.sectionBlock}>
        <h3 style={styles.sectionTitle}>Orders for this Product</h3>
        
        {/* SEARCH AND FILTER BAR CONTROLS */}
        <div style={styles.filterBar}>
          <div style={styles.searchWrapper}>
            <svg style={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search by order ID, customer name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <button style={styles.filterButton}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a555a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
        </div>

        {/* LOG DATA CONTAINER CARD */}
        <div style={styles.ordersListCard}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <OrderHistoryRow 
                key={order.id}
                orderId={order.order_number}
                customerName={order.customer_name || 'Customer'}
                date={formatDate(order.created_at)}
                time={formatTime(order.created_at)}
                status={order.status}
                amount={formatCurrency(order.total)}
                onClick={() => {
                  setSelectedOrderId(order.id);
                  setView('order-details');
                }}
              />
            ))
          ) : (
            <div style={styles.emptyState}>No matching orders found</div>
          )}
        </div>

        {/* PAGINATION LINK ROWFOOTER */}
        <div style={styles.tableFooter}>
          <span style={styles.paginationText}>Showing 1 to {filteredOrders.length} of {orders.length} orders</span>
          <button style={styles.viewAllBtn}>View all orders ›</button>
        </div>
      </section>

      {/* STICKY BOTTOM TAB NAVIGATION COMPONENT SHELL */}
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
  header: { display: 'flex', alignItems: 'center', marginBottom: '16px' },
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
  mainSnapshotCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f4f8',
    borderRadius: '14px',
    padding: '12px',
    display: 'flex',
    gap: '14px',
    marginBottom: '16px',
  },
  mainImagePlaceholder: {
    width: '100px',
    height: '110px',
    backgroundColor: '#f1f5f9',
    border: '1px dashed #ccd4d8',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageLabelTag: {
    fontSize: '8px',
    color: '#66767e',
    textAlign: 'center',
    marginTop: '4px',
  },
  editImageBtn: {
    position: 'absolute',
    bottom: '6px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 8px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  snapshotInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productTitle: { margin: 0, fontSize: '16px', fontWeight: '800', color: '#0e1e25' },
  dotsButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '2px' },
  activeBadge: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#00a84e',
    backgroundColor: '#e2f7ec',
    padding: '2px 6px',
    borderRadius: '4px',
    width: 'fit-content',
    margin: '4px 0 6px 0',
  },
  categorySubtext: { fontSize: '11px', color: '#66767e', fontWeight: '500' },
  productDescription: { margin: '6px 0 0 0', fontSize: '12px', color: '#4a555a', lineHeight: '1.4' },
  errorMessage: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '12px',
    marginBottom: '12px',
  },
  loadingMessage: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    color: '#1d4ed8',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '12px',
    marginBottom: '12px',
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '20px',
  },
  metricBox: {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f4f8',
    borderRadius: '10px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  metricLabel: { fontSize: '11px', color: '#66767e', fontWeight: '500' },
  metricValue: { fontSize: '15px', fontWeight: '700', color: '#0e1e25' },
  stockUnit: { fontSize: '12px', fontWeight: '500' },
  sectionBlock: { marginBottom: '20px' },
  sectionTitle: { margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700', color: '#0e1e25' },
  galleryRow: { display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' },
  thumbPlaceholder: {
    width: '64px',
    height: '64px',
    backgroundColor: '#ffffff',
    border: '1px dashed #ccd4d8',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  thumbLabel: { fontSize: '7px', color: '#a0aec0', marginTop: '2px' },
  addImageSquare: {
    width: '64px',
    height: '64px',
    backgroundColor: '#ffffff',
    border: '1px dashed #ccd4d8',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
  addImageText: { fontSize: '9px', fontWeight: '600', color: '#66767e', marginTop: '2px' },
  filterBar: { display: 'flex', gap: '8px', marginBottom: '10px' },
  searchWrapper: {
    position: 'relative',
    flex: 1,
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  searchInput: {
    width: '100%',
    padding: '10px 10px 10px 32px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#0e1e25',
  },
  filterButton: {
    padding: '0 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  ordersListCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f4f8',
    borderRadius: '14px',
    padding: '0 14px',
  },
  emptyState: { padding: '20px', textAlign: 'center', color: '#a0aec0', fontSize: '13px' },
  tableFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    padding: '0 4px',
  },
  paginationText: { fontSize: '11px', color: '#66767e', fontWeight: '500' },
  viewAllBtn: {
    background: 'none',
    border: 'none',
    color: '#00a84e',
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
