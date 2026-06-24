import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ProductFilters from '../components/ProductFilters';
import ProductCard from '../components/ProductCard';
import apiClient from '../../../lib/axios';
import addToCart from '../../cart/api/addToCart';
import getCart from '../../cart/api/getCart';

export default function ProductsPage({ slug, onGoToCart, userId }) {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const isAddingRef = useRef(false);

  const categories = useMemo(() => {
    if (!shop || !shop.products) return [];
    const cats = new Map();
    shop.products.forEach(p => {
      if (p.product_category) {
        cats.set(p.product_category.id, p.product_category);
      }
    });
    return Array.from(cats.values());
  }, [shop]);

  const fetchCartCount = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getCart(userId);
      const items = data?.cart?.cart_items || [];
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    } catch (err) {
      console.log('could not fetch cart');
    }
  }, [userId]);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const endpoint = slug ? `/shops/${slug}` : '/shops/me';
        const response = await apiClient.get(endpoint);
        setShop(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Shop not found');
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
    fetchCartCount();
  }, [slug, fetchCartCount]);

  if (loading) {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#66767e', marginTop: '12px' }}>Loading storefront...</p>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div style={styles.centerContainer}>
        <h2 style={{ color: '#0e1e25' }}>Oops!</h2>
        <p style={{ color: '#66767e' }}>{error || 'This shop does not exist or is unavailable.'}</p>
      </div>
    );
  }

  let filteredProducts = (shop.products || []).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? p.product_category?.id === selectedCategory : true;
    const matchesMinPrice = minPrice ? Number(p.price) >= Number(minPrice) : true;
    const matchesMaxPrice = maxPrice ? Number(p.price) <= Number(maxPrice) : true;
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  if (sortBy === 'price_low_high') {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === 'newest') {
    filteredProducts.sort((a, b) => b.id - a.id);
  }

  const handleAddToCart = async (product) => {
    if (!userId || isAddingRef.current) return;
    isAddingRef.current = true;

    setCartCount(prev => prev + 1);
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }

    try {
      await addToCart(userId, product.id);
      fetchCartCount();
    } catch (err) {
      fetchCartCount();
      const msg = err.response?.data?.errors?.[0] || 'could not add to cart';
      alert(msg);
    } finally {
      isAddingRef.current = false;
    }
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
            type="search"
            aria-label="Search in this shop"
            placeholder="Search in this shop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.cartIconWrapper} onClick={() => onGoToCart && onGoToCart()}>
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
          {shop.logo_url ? (
            <img src={shop.logo_url} alt={shop.name} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px'}} />
          ) : (
            <span role="img" aria-label="store">🏪</span>
          )}
        </div>
        <div style={styles.storeInfo}>
          <h1 style={styles.storeName}>{shop.name}</h1>
          <p style={styles.storeMeta}>
            {[shop.city, shop.region, shop.country].filter(Boolean).join(', ') || 'Location not specified'}
          </p>
          <p style={styles.storeDescription}>
            {shop.description || 'Welcome to our store!'}
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
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        isFilterPanelOpen={isFilterPanelOpen}
        onToggleFilterPanel={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
      />

      {/* Products Grid */}
      <main style={styles.gridContainer}>
        {filteredProducts.length > 0 ? (
          <div style={viewMode === 'list' ? { ...styles.grid, gridTemplateColumns: '1fr' } : styles.grid}>
            {filteredProducts.map((product) => {
              const formattedProduct = {
                ...product,
                price: `ETB ${Number(product.price || 0).toLocaleString()}`,
                img: product.image_urls?.[0]
              };
              return <ProductCard key={product.id} product={formattedProduct} onAddToCart={handleAddToCart} />
            })}
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
        <button style={styles.floatingCartBtn} onClick={() => onGoToCart && onGoToCart()}>
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
  centerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    textAlign: 'center',
    padding: '20px'
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #00a84e',
    borderRadius: '50%',
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
