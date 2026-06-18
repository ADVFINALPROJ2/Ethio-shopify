import React from 'react';

export default function ProductFilters() {
  return (
    <div style={styles.container}>
      {/* Filter Button */}
      <button style={styles.filterBtn}>
        <span role="img" aria-label="filter">🎛️</span>
        <span>Filter</span>
      </button>

      {/* Sort Selector */}
      <div style={styles.selectWrapper}>
        <select style={styles.select}>
          <option>Sort by: Popular</option>
          <option>Sort by: Price Low-High</option>
          <option>Sort by: Newest</option>
        </select>
        <span style={styles.selectArrow}>▼</span>
      </div>

      {/* Grid / List Toggle */}
      <div style={styles.toggleGroup}>
        <button style={styles.toggleActive}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="8" height="8" rx="1" />
            <rect x="13" y="3" width="8" height="8" rx="1" />
            <rect x="3" y="13" width="8" height="8" rx="1" />
            <rect x="13" y="13" width="8" height="8" rx="1" />
          </svg>
        </button>
        <button style={styles.toggleInactive}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    gap: '8px',
    backgroundColor: '#fff',
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#4a555a',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  selectWrapper: {
    position: 'relative',
    flex: 1,
  },
  select: {
    width: '100%',
    appearance: 'none',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '8px 28px 8px 12px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#4a555a',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  selectArrow: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '10px',
    color: '#94a3b8',
    pointerEvents: 'none',
  },
  toggleGroup: {
    display: 'flex',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  toggleActive: {
    padding: '8px 10px',
    border: 'none',
    borderRight: '1px solid #e2e8f0',
    backgroundColor: '#f0fdf4',
    color: '#00a84e',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  toggleInactive: {
    padding: '8px 10px',
    border: 'none',
    backgroundColor: '#fff',
    color: '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
};
