import React from 'react';

export default function ProductFilters({ 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange,
  categories = [],
  selectedCategory,
  onCategoryChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  isFilterPanelOpen,
  onToggleFilterPanel
}) {
  return (
    <>
    <div style={styles.container}>
      {/* Filter Button */}
      <button 
        type="button" 
        aria-label="Filter products" 
        style={{
          ...styles.filterBtn, 
          backgroundColor: isFilterPanelOpen ? '#f0fdf4' : '#fff',
          borderColor: isFilterPanelOpen ? '#00a84e' : '#e2e8f0',
          color: isFilterPanelOpen ? '#00a84e' : '#4a555a'
        }}
        onClick={onToggleFilterPanel}
      >
        <span role="img" aria-label="filter">🎛️</span>
        <span>Filter</span>
      </button>

      {/* Sort Selector */}
      <div style={styles.selectWrapper}>
        <select 
          aria-label="Sort products by" 
          style={styles.select}
          value={sortBy}
          onChange={(e) => onSortChange && onSortChange(e.target.value)}
        >
          <option value="popular">Sort by: Popular</option>
          <option value="price_low_high">Sort by: Price Low-High</option>
          <option value="newest">Sort by: Newest</option>
        </select>
        <span style={styles.selectArrow}>▼</span>
      </div>

      {/* Grid / List Toggle */}
      <div style={styles.toggleGroup}>
        <button 
          type="button" 
          aria-label="Grid view" 
          style={viewMode === 'grid' ? styles.toggleActive : styles.toggleInactive}
          onClick={() => onViewModeChange && onViewModeChange('grid')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={viewMode === 'grid' ? "currentColor" : "none"} stroke="currentColor" strokeWidth={viewMode === 'grid' ? "1" : "2"}>
            <rect x="3" y="3" width="8" height="8" rx="1" />
            <rect x="13" y="3" width="8" height="8" rx="1" />
            <rect x="3" y="13" width="8" height="8" rx="1" />
            <rect x="13" y="13" width="8" height="8" rx="1" />
          </svg>
        </button>
        <button 
          type="button" 
          aria-label="List view" 
          style={viewMode === 'list' ? styles.toggleActive : styles.toggleInactive}
          onClick={() => onViewModeChange && onViewModeChange('list')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </div>
    
    {isFilterPanelOpen && (
      <div style={styles.filterPanel}>
        <div style={styles.filterSection}>
          <label style={styles.filterLabel}>Category</label>
          <div style={styles.categoryChips}>
            <button
              style={!selectedCategory ? styles.chipActive : styles.chipInactive}
              onClick={() => onCategoryChange && onCategoryChange('')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                style={selectedCategory === cat.id ? styles.chipActive : styles.chipInactive}
                onClick={() => onCategoryChange && onCategoryChange(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        <div style={styles.filterSection}>
          <label style={styles.filterLabel}>Price Range (ETB)</label>
          <div style={styles.priceInputs}>
            <input 
              type="number" 
              placeholder="Min" 
              value={minPrice} 
              onChange={(e) => onMinPriceChange && onMinPriceChange(e.target.value)}
              style={styles.priceInput}
              min="0"
            />
            <span style={styles.priceSeparator}>-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={maxPrice} 
              onChange={(e) => onMaxPriceChange && onMaxPriceChange(e.target.value)}
              style={styles.priceInput}
              min="0"
            />
          </div>
        </div>
      </div>
    )}
    </>
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
  filterPanel: {
    padding: '16px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  filterLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0e1e25',
  },
  categoryChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  chipActive: {
    padding: '6px 12px',
    backgroundColor: '#00a84e',
    color: '#fff',
    border: 'none',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  chipInactive: {
    padding: '6px 12px',
    backgroundColor: '#f1f5f9',
    color: '#4a555a',
    border: 'none',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  priceInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  priceInput: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '13px',
    outline: 'none',
  },
  priceSeparator: {
    color: '#94a3b8',
    fontWeight: '600',
  }
};
