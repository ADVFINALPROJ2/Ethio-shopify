import React, { useState } from 'react';
import { OrderHistoryRow } from '../components/OrderHistoryRow';

export const ProductDetailsPage = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const orderLogs = [
    { id: 1, orderId: '#ORD-10248', customer: 'Selam Tesfaye', date: 'May 20, 2024', time: '2:30 PM', status: 'Pending', amount: 'ETB 1,850' },
    { id: 2, orderId: '#ORD-10235', customer: 'Liya Ahmed', date: 'May 19, 2024', time: '6:15 PM', status: 'Delivered', amount: 'ETB 1,850' },
    { id: 3, orderId: '#ORD-10221', customer: 'Mekdes Abebe', date: 'May 18, 2024', time: '11:45 AM', status: 'Delivered', amount: 'ETB 1,850' },
    { id: 4, orderId: '#ORD-10205', customer: 'Betelhem Desta', date: 'May 17, 2024', time: '9:20 PM', status: 'Pending', amount: 'ETB 1,850' },
    { id: 5, orderId: '#ORD-10198', customer: 'Nahom Kidane', date: 'May 17, 2024', time: '3:10 PM', status: 'Delivered', amount: 'ETB 1,850' },
  ];

  const filteredOrders = orderLogs.filter(order => 
    order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <span style={{ fontSize: '40px' }}>👗</span>
          <div style={styles.imageLabelTag}>[ Main Product Pic ]</div>
          <button style={styles.editImageBtn}>✏️ Edit</button>
        </div>

        <div style={styles.snapshotInfo}>
          <div style={styles.titleRow}>
            <h1 style={styles.productTitle}>Elegant Green Dress</h1>
            <button style={styles.dotsButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#66767e" strokeWidth="2.5">
                <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="17" r="1" />
              </svg>
            </button>
          </div>
          <span style={styles.activeBadge}>Active</span>
          <span style={styles.categorySubtext}>🏷️ Fashion & Apparel • Dress</span>
          <p style={styles.productDescription}>
            A stylish and elegant green dress perfect for casual outings and special occasions.
          </p>
        </div>
      </section>

      {/* QUAD ANALYTICS METRIC HUB */}
      <section style={styles.analyticsGrid}>
        <div style={styles.metricBox}>
          <span style={styles.metricLabel}>Price</span>
          <span style={styles.metricValue}>ETB 1,850</span>
        </div>
        <div style={styles.metricBox}>
          <span style={styles.metricLabel}>Stock Quantity</span>
          <span style={{ ...styles.metricValue, color: '#00a84e' }}>25 <span style={styles.stockUnit}>in stock</span></span>
        </div>
        <div style={styles.metricBox}>
          <span style={styles.metricLabel}>Total Sold</span>
          <span style={styles.metricValue}>48</span>
        </div>
        <div style={styles.metricBox}>
          <span style={styles.metricLabel}>Total Revenue</span>
          <span style={styles.metricValue}>ETB 88,880</span>
        </div>
      </section>

      {/* GALLERY MANAGEMENT SECTION */}
      <section style={styles.sectionBlock}>
        <h3 style={styles.sectionTitle}>Product Images</h3>
        <div style={styles.galleryRow}>
          <div style={{ ...styles.thumbPlaceholder, border: '2px solid #00a84e' }}>
            <span>👗</span>
            <span style={styles.thumbLabel}>[ Pic 1 ]</span>
          </div>
          <div style={styles.thumbPlaceholder}>
            <span>💃</span>
            <span style={styles.thumbLabel}>[ Pic 2 ]</span>
          </div>
          <div style={styles.thumbPlaceholder}>
            <span>🧵</span>
            <span style={styles.thumbLabel}>[ Pic 3 ]</span>
          </div>
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
                orderId={order.orderId}
                customerName={order.customer}
                date={order.date}
                time={order.time}
                status={order.status}
                amount={order.amount}
              />
            ))
          ) : (
            <div style={styles.emptyState}>No matching orders found</div>
          )}
        </div>

        {/* PAGINATION LINK ROWFOOTER */}
        <div style={styles.tableFooter}>
          <span style={styles.paginationText}>Showing 1 to {filteredOrders.length} of {orderLogs.length} orders</span>
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
