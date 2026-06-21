import React from 'react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div style={styles.card}>
      {/* Product Image */}
      <div style={styles.imageWrapper}>
        {product.img ? (
          <img src={product.img} alt={product.name} style={styles.image} />
        ) : (
          <div style={styles.noImage}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div style={styles.info}>
        <h3 style={styles.name}>{product.name}</h3>
        <div style={styles.footer}>
          <span style={styles.price}>{product.price}</span>
          <button type="button" aria-label="Add to cart" style={styles.cartBtn} onClick={() => onAddToCart && onAddToCart(product)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
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
    transition: 'box-shadow 0.2s ease',
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
    mixBlendMode: 'multiply',
  },
  noImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  price: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#00a84e',
  },
  cartBtn: {
    padding: '6px',
    border: '1px solid #dcfce7',
    borderRadius: '6px',
    backgroundColor: '#fff',
    color: '#00a84e',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.15s ease',
  },
};
