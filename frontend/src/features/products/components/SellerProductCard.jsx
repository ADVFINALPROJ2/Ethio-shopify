import React from 'react';

export default function SellerProductCard({ product, onSelect }) {
  const formatCurrency = (value) => `ETB ${Number(value || 0).toLocaleString()}`;

  return (
    <div
      style={styles.card}
      onClick={() => onSelect?.(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(product)}
    >
      <div style={styles.imageWrapper}>
        {product.image_urls?.[0] ? (
          <img src={product.image_urls[0]} alt={product.name} style={styles.image} />
        ) : (
          <div style={styles.noImage}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        <span style={{
          ...styles.statusBadge,
          backgroundColor: product.status === 'active' ? '#e2f7ec' : '#f1f5f9',
          color: product.status === 'active' ? '#00a84e' : '#64748b',
        }}>
          {product.status || 'active'}
        </span>
      </div>

      <div style={styles.info}>
        <h3 style={styles.name}>{product.name}</h3>
        <div style={styles.footer}>
          <span style={styles.price}>{formatCurrency(product.price)}</span>
          <span style={styles.stock}>{product.quantity || 0} in stock</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    border: '1px solid #f0f4f8',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    cursor: 'pointer',
  },
  imageWrapper: {
    width: '100%',
    paddingBottom: '100%',
    position: 'relative',
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '4px',
    textTransform: 'capitalize',
  },
  info: {
    padding: '10px 10px 12px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  name: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#0e1e25',
    margin: '0 0 8px 0',
    lineHeight: '1.3',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    minHeight: '32px',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    gap: '8px',
  },
  price: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#00a84e',
  },
  stock: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#64748b',
    whiteSpace: 'nowrap',
  },
};
