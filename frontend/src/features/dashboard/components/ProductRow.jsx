import React from 'react';

const PLACEHOLDER_COLORS = ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe'];
const PLACEHOLDER_LETTERS = ['D', 'T', 'B', 'S', 'G'];

let placeholderIndex = 0;
const getNextPlaceholder = () => {
  const idx = placeholderIndex % PLACEHOLDER_COLORS.length;
  placeholderIndex++;
  return { bg: PLACEHOLDER_COLORS[idx], letter: PLACEHOLDER_LETTERS[idx] };
};

export const ProductRow = ({ name, price, stockCount, onClick }) => {
  const isLowStock = stockCount <= 5;
  const placeholder = getNextPlaceholder();
  
  return (
    <div onClick={onClick} style={{ ...styles.row, cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ ...styles.imgPlaceholder, backgroundColor: placeholder.bg }}>
        <span style={styles.imgText}>{placeholder.letter}</span>
      </div>
      <div style={styles.details}>
        <h4 style={styles.name}>{name}</h4>
        <span style={styles.price}>{price}</span>
        <span style={{ 
          ...styles.stockStatus, 
          color: isLowStock ? '#d97706' : '#00a84e',
          backgroundColor: isLowStock ? '#fffbeb' : '#f2fbf5'
        }}>
          {isLowStock ? `Low Stock (${stockCount})` : 'In Stock'}
        </span>
      </div>
      <button style={styles.optionsBtn}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#66767e" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="17" r="1" />
        </svg>
      </button>
    </div>
  );
};

const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f1f5f9',
    gap: '12px',
  },
  imgPlaceholder: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  imgText: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#4a5568',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    minWidth: 0,
  },
  name: {
    margin: 0,
    fontSize: '13px',
    fontWeight: '600',
    color: '#0e1e25',
    textAlign: 'left',
  },
  price: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0e1e25',
    textAlign: 'left',
  },
  stockStatus: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '4px',
    width: 'fit-content',
  },
  optionsBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    flexShrink: 0,
  }
};
