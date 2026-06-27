import React, { useEffect, useState, useRef } from 'react';
import { OrderHistoryRow } from '../components/OrderHistoryRow';
import { OrderDetailsPage } from '../../orders/pages/OrderDetailsPage';
import { getProduct } from '../api/getProduct';
import { getProductOrders } from '../api/getProductOrders';
import { restockProduct } from '../api/restockProduct';
import { deleteProduct } from '../api/deleteProduct';

export const ProductDetailsPage = ({ productId, onBack, onEdit, onDelete }) => {
  const [view, setView] = useState('details');
  const [searchQuery, setSearchQuery] = useState('');
  const [product, setProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [restockQty, setRestockQty] = useState(0);
  const [isRestocking, setIsRestocking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleRestock = async () => {
    if (!restockQty || restockQty <= 0) return;
    setIsRestocking(true);
    try {
      const updated = await restockProduct(productId, restockQty);
      setProduct(updated);
      setRestockQty(0);
    } catch (err) {
      alert(err.response?.data?.errors?.[0] || 'Failed to update stock');
    } finally {
      setIsRestocking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this product? This action cannot be undone.')) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productId);
      if (onDelete) onDelete();
      else if (onBack) onBack();
    } catch (err) {
      alert(err.response?.data?.errors?.[0] || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        </div>

        <div style={styles.snapshotInfo}>
          <div style={styles.titleRow}>
            <h1 style={styles.productTitle}>{product?.name || 'Product'}</h1>
            <div style={styles.menuWrapper} ref={menuRef}>
              <button
                type="button"
                style={styles.dotsButton}
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-label="Product actions"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#66767e" strokeWidth="2.5">
                  <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="17" r="1" />
                </svg>
              </button>
              {isMenuOpen && (
                <div style={styles.menuDropdown}>
                  <button
                    type="button"
                    style={styles.menuItem}
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onEdit) onEdit(product);
                    }}
                  >
                    Edit Product
                  </button>
                  <button
                    type="button"
                    style={{ ...styles.menuItem, color: '#dc3545' }}
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Product'}
                  </button>
                </div>
              )}
            </div>
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

      {/* RESTOCK SECTION */}
      <section style={styles.sectionBlock}>
        <h3 style={styles.sectionTitle}>Restock Product</h3>
        <div style={styles.restockRow}>
          <input
            type="number"
            min="1"
            placeholder="Qty to add"
            value={restockQty || ''}
            onChange={(e) => setRestockQty(parseInt(e.target.value) || 0)}
            style={styles.restockInput}
          />
          <button
            onClick={handleRestock}
            disabled={isRestocking || !restockQty || restockQty <= 0}
            style={styles.restockBtn}
          >
            {isRestocking ? 'Updating...' : 'Restock'}
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
  menuWrapper: { position: 'relative' },
  dotsButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '2px' },
  menuDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '4px',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    minWidth: '140px',
    zIndex: 20,
    overflow: 'hidden',
  },
  menuItem: {
    display: 'block',
    width: '100%',
    padding: '10px 14px',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#0e1e25',
    cursor: 'pointer',
  },
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
  },
  restockRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  restockInput: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    color: '#0e1e25',
    backgroundColor: '#fff',
  },
  restockBtn: {
    padding: '10px 20px',
    backgroundColor: '#00a84e',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
};
