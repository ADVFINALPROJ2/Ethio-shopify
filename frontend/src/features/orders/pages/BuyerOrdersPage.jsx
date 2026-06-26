import React, { useEffect, useState } from 'react';
import { getBuyerOrders } from '../api/getBuyerOrders';

const STATUS_LABELS = {
  pending_payment: 'Pending payment',
  paid: 'Paid',
  processing: 'Processing',
  accepted: 'Accepted',
  shipped: 'Shipped',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const BuyerOrdersPage = ({ onBack }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const data = await getBuyerOrders();
        setOrders(data);
      } catch (error) {
        setErrorMessage(error.response?.data?.error || 'Unable to load orders.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const formatCurrency = (value) => `ETB ${Number(value || 0).toLocaleString()}`;
  const formatDate = (value) => value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>&larr; Back</button>
        <h1 style={styles.title}>My Orders</h1>
        <div style={{ width: '64px' }} />
      </header>

      {isLoading && <div style={styles.message}>Loading orders...</div>}
      {errorMessage && <div style={{ ...styles.message, color: '#b91c1c' }}>{errorMessage}</div>}
      {!isLoading && !errorMessage && orders.length === 0 && (
        <div style={styles.emptyState}>
          <p style={styles.emptyTitle}>No orders yet</p>
          <p style={styles.emptyText}>Orders you place from this shop will appear here.</p>
        </div>
      )}

      {!isLoading && !errorMessage && orders.length > 0 && (
        <main style={styles.list}>
          {orders.map((order) => (
            <article key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <p style={styles.orderId}>{order.order_number}</p>
                  <p style={styles.orderMeta}>{formatDate(order.created_at)}{order.seller_name ? ` · ${order.seller_name}` : ''}</p>
                </div>
                <span style={styles.statusBadge}>{STATUS_LABELS[order.status] || order.status}</span>
              </div>

              <div style={styles.items}>
                {(order.order_items || []).map((item) => {
                  const imageUrl = item.product?.image_urls?.[0];
                  return (
                    <div key={item.id} style={styles.itemRow}>
                      <div style={styles.itemImage}>
                        {imageUrl ? (
                          <img src={imageUrl} alt={item.product_name || item.product?.name} style={styles.image} />
                        ) : (
                          <span style={styles.noImage}>No image</span>
                        )}
                      </div>
                      <div style={styles.itemInfo}>
                        <p style={styles.itemName}>{item.product_name || item.product?.name || 'Product'}</p>
                        <p style={styles.itemMeta}>Qty {item.quantity} · {formatCurrency(item.price)}</p>
                      </div>
                      <strong style={styles.lineTotal}>{formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}</strong>
                    </div>
                  );
                })}
              </div>

              <div style={styles.totalRow}>
                <span>Total</span>
                <strong>{formatCurrency(order.total)}</strong>
              </div>
            </article>
          ))}
        </main>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    maxWidth: '480px',
    margin: '0 auto',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e2e8f0',
  },
  backButton: {
    width: '64px',
    border: 'none',
    background: 'transparent',
    color: '#64748b',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  title: {
    margin: 0,
    color: '#0e1e25',
    fontSize: '18px',
    fontWeight: '800',
  },
  message: {
    padding: '48px 20px',
    textAlign: 'center',
    color: '#66767e',
    fontSize: '14px',
  },
  emptyState: {
    padding: '70px 24px',
    textAlign: 'center',
  },
  emptyTitle: {
    margin: '0 0 6px',
    color: '#0e1e25',
    fontSize: '17px',
    fontWeight: '800',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: '13px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
  },
  orderCard: {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '14px',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  },
  orderId: {
    margin: '0 0 3px',
    color: '#0e1e25',
    fontSize: '15px',
    fontWeight: '800',
  },
  orderMeta: {
    margin: 0,
    color: '#94a3b8',
    fontSize: '12px',
  },
  statusBadge: {
    flexShrink: 0,
    color: '#065f46',
    backgroundColor: '#ecfdf5',
    border: '1px solid #bbf7d0',
    borderRadius: '6px',
    padding: '4px 7px',
    fontSize: '11px',
    fontWeight: '800',
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  itemImage: {
    width: '54px',
    height: '54px',
    borderRadius: '8px',
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    fontSize: '10px',
    color: '#94a3b8',
  },
  itemInfo: {
    minWidth: 0,
    flex: 1,
  },
  itemName: {
    margin: '0 0 3px',
    color: '#0e1e25',
    fontSize: '13px',
    fontWeight: '700',
  },
  itemMeta: {
    margin: 0,
    color: '#64748b',
    fontSize: '12px',
  },
  lineTotal: {
    color: '#0e1e25',
    fontSize: '12px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9',
    color: '#0e1e25',
    fontSize: '14px',
  },
};
