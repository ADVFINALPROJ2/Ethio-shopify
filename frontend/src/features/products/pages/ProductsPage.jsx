import React, { useState } from 'react';
import ProductFilters from '../components/ProductFilters';
import ProductCard from '../components/ProductCard';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Modern Sofa Set', price: 'ETB 18,900', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop' },
  { id: 2, name: 'Indoor Plant', price: 'ETB 750', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop' },
  { id: 3, name: 'Decorative Cushion', price: 'ETB 650', img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop' },
  { id: 4, name: 'Table Lamp', price: 'ETB 1,250', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop' },
  { id: 5, name: 'Storage Basket', price: 'ETB 950', img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop' },
  { id: 6, name: 'Dining Table Set', price: 'ETB 12,500', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop' },
  { id: 7, name: 'Wall Art Frame', price: 'ETB 550', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop' },
  { id: 8, name: 'Throw Blanket', price: 'ETB 850', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop' },
];

export default function ProductsPage() {
  const [cartCount, setCartCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');

  let filteredProducts = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortBy === 'price_low_high') {
    filteredProducts.sort((a, b) => {
      const priceA = parseInt(a.price.replace(/[^0-9]/g, ''), 10);
      const priceB = parseInt(b.price.replace(/[^0-9]/g, ''), 10);
      return priceA - priceB;
    });
  } else if (sortBy === 'newest') {
    filteredProducts.sort((a, b) => b.id - a.id);
  }

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <header style={styles.header}>
        <div style={styles.brandRow}>
          <span style={styles.brandMark}>ES</span>
          <span style={styles.brandName}>EthioShopify</span>
        </div>
        <div style={styles.searchWrapper}>
          <svg style={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            aria-label="Search in this shop"
            placeholder="Search in this shop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.cartIconWrapper}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0e1e25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {cartCount > 0 && (
            <span style={styles.cartBadge}>{cartCount}</span>
          )}
        </div>
      </header>

      {/* Store Info Banner */}
      <section style={styles.storeBanner}>
        <div style={styles.storeAvatar}>
          <span role="img" aria-label="store">🏪</span>
        </div>
        <div style={styles.storeInfo}>
          <h1 style={styles.storeName}>Green Life Store</h1>
          <p style={styles.storeMeta}>Home & Living &bull; Addis Ababa, Ethiopia</p>
          <p style={styles.storeDescription}>
            Quality home & living products to make your home beautiful and comfortable.
          </p>
        </div>
      </section>

      {/* Products Tab */}
      <nav style={styles.tabBar}>
        <button style={styles.tabActive}>Products</button>
      </nav>

      {/* Filters */}
      <ProductFilters 
        sortBy={sortBy} 
        onSortChange={setSortBy} 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
      />

      {/* Products Grid */}
      <main style={styles.gridContainer}>
        {filteredProducts.length > 0 ? (
          <div style={viewMode === 'list' ? { ...styles.grid, gridTemplateColumns: '1fr' } : styles.grid}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p>No products match your search.</p>
          </div>
        )}
      </main>

      {/* Floating Bottom Bar */}
      <footer style={styles.bottomBar}>
        <div style={styles.securitySection}>
          <span style={styles.shieldIcon} role="img" aria-label="shield">🛡️</span>
          <div>
            <p style={styles.securityTitle}>Shop with confidence</p>
            <p style={styles.securitySubtext}>
              Your payments are secure with EthioShopify Buyer Protection.
            </p>
          </div>
        </div>
        <button style={styles.floatingCartBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {cartCount > 0 && (
            <span style={styles.floatingBadge}>{cartCount}</span>
          )}
        </button>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    maxWidth: '480px',
    margin: '0 auto',
    position: 'relative',
    paddingBottom: '80px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #f0f4f8',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexShrink: 0,
  },
  brandMark: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    backgroundColor: '#00a84e',
    color: '#fff',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '800',
  },
  brandName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#00a84e',
    whiteSpace: 'nowrap',
  },
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
    padding: '8px 10px 8px 32px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#f1f5f9',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#0e1e25',
    fontFamily: 'inherit',
  },
  cartIconWrapper: {
    position: 'relative',
    padding: '6px',
    cursor: 'pointer',
  },
  cartBadge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    backgroundColor: '#00a84e',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  storeBanner: {
    display: 'flex',
    gap: '14px',
    padding: '16px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #f0f4f8',
  },
  storeAvatar: {
    width: '60px',
    height: '60px',
    backgroundColor: '#f0fdf4',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    border: '1px solid #e2e8f0',
    flexShrink: 0,
  },
  storeInfo: {
    flex: 1,
    textAlign: 'left',
  },
  storeName: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#0e1e25',
    margin: '0 0 2px 0',
    textAlign: 'left',
  },
  storeMeta: {
    fontSize: '12px',
    color: '#66767e',
    margin: '0 0 6px 0',
    textAlign: 'left',
  },
  storeDescription: {
    fontSize: '12px',
    color: '#94a3b8',
    margin: 0,
    lineHeight: '1.4',
    textAlign: 'left',
  },
  tabBar: {
    display: 'flex',
    padding: '0 16px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e2e8f0',
  },
  tabActive: {
    padding: '12px 4px 10px',
    border: 'none',
    borderBottom: '2px solid #00a84e',
    backgroundColor: 'transparent',
    color: '#00a84e',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  gridContainer: {
    padding: '4px 16px 16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 16px',
    color: '#94a3b8',
    fontSize: '14px',
  },
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '480px',
    backgroundColor: '#fff',
    borderTop: '1px solid #e2e8f0',
    padding: '10px 16px',
    paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    boxShadow: '0 -4px 12px rgba(0,0,0,0.06)',
    zIndex: 100,
  },
  securitySection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
  },
  shieldIcon: {
    fontSize: '18px',
  },
  securityTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#0e1e25',
    margin: 0,
  },
  securitySubtext: {
    fontSize: '10px',
    color: '#94a3b8',
    margin: '2px 0 0 0',
    lineHeight: '1.3',
  },
  floatingCartBtn: {
    position: 'relative',
    backgroundColor: '#00a84e',
    border: 'none',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,168,78,0.3)',
    flexShrink: 0,
  },
  floatingBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: '#059669',
    border: '2px solid #fff',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '800',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
};
