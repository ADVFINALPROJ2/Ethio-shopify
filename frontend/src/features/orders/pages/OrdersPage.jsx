import React, { useEffect, useState } from 'react';
import { OrderListRow } from '../components/OrderListRow';
import { getOrders } from '../api/getOrders';

export const OrdersPage = ({ onSelectOrder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formatCurrency = (value) => `ETB ${Number(value || 0).toLocaleString()}`;
  const formatDate = (value) => value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const formatTime = (value) => value ? new Date(value).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const ordersData = await getOrders();
        setOrders(ordersData);
      } catch (error) {
        setErrorMessage(error.response?.data?.error || 'Unable to load orders.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = orders.filter(item => 
    item.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* GLOBAL APPLICATION TOP BAR */}
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

      {/* VIEW HEADLINE INTRO */}
      <div style={styles.titleContainer}>
        <h1 style={styles.viewTitle}>Orders</h1>
        <p style={styles.viewSubtitle}>View and manage all orders from your customers.</p>
      </div>

      {/* FILTER SEARCH INPUT BAR */}
      <div style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <svg style={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
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

      {/* MAIN LIST CARD CONTAINER */}
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
      {isLoading && <div style={styles.loadingMessage}>Loading orders...</div>}
      <div style={styles.listCard}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderListRow 
              key={order.id}
              orderId={order.order_number}
              customerName={order.customer_name || 'Customer'}
              date={formatDate(order.created_at)}
              time={formatTime(order.created_at)}
              status={order.status || 'pending'}
              amount={formatCurrency(order.total)}
              onClick={() => onSelectOrder && onSelectOrder(order.id)}
            />
          ))
        ) : (
          <div style={styles.emptyState}>No orders match your current search queries.</div>
        )}
      </div>

      {/* INFRASTRUCTURE CONTROLS LINE FOOTER */}
      <div style={styles.tableFooter}>
        <span style={styles.paginationText}>Showing 1 to {filteredOrders.length} of {orders.length} orders</span>
        <button style={styles.viewAllBtn}>View all orders ›</button>
      </div>

      {/* STICKY DISPATCH BOTTOM NAVBAR CONTAINER */}
      <nav style={styles.bottomNav}>
        <div style={{ ...styles.navItem, color: '#66767e' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
          <span style={{ marginTop: '2px' }}>Dashboard</span>
        </div>
        <div style={{ ...styles.navItem, color: '#00a84e' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
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
  titleContainer: {
    marginBottom: '16px',
  },
  viewTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0e1e25',
    margin: '0 0 4px 0',
  },
  viewSubtitle: {
    fontSize: '13px',
    color: '#66767e',
    margin: 0,
    lineHeight: '1.4',
  },
  filterBar: { display: 'flex', gap: '8px', marginBottom: '12px' },
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
  listCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f4f8',
    borderRadius: '14px',
    padding: '0 14px',
  },
  emptyState: {
    padding: '24px',
    textAlign: 'center',
    color: '#a0aec0',
    fontSize: '13px',
  },
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
    padding: 0,
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
    cursor: 'pointer',
  }
};
