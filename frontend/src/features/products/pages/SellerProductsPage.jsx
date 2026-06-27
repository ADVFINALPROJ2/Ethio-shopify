import React, { useEffect, useMemo, useState } from 'react';
import ProductFilters from '../components/ProductFilters';
import SellerProductCard from '../components/SellerProductCard';
import { getProducts } from '../api/getProducts';
import { getMyShop } from '../../dashboard/api/getMyShop';

export const SellerProductsPage = ({ onBack, onSelectProduct, onAddProduct }) => {
  const [products, setProducts] = useState([]);
  const [shop, setShop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const [productData, shopData] = await Promise.all([
          getProducts(),
          getMyShop(),
        ]);
        setProducts(productData);
        setShop(shopData);
      } catch (error) {
        setErrorMessage(error.response?.data?.error || 'Unable to load products.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const categories = useMemo(() => {
    const cats = new Map();
    products.forEach((product) => {
      if (product.product_category_id && product.product_category_name) {
        cats.set(product.product_category_id, {
          id: product.product_category_id,
          name: product.product_category_name,
        });
      }
    });
    return Array.from(cats.values());
  }, [products]);

  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.product_category_id === selectedCategory
      : true;
    const matchesMinPrice = minPrice ? Number(product.price) >= Number(minPrice) : true;
    const matchesMaxPrice = maxPrice ? Number(product.price) <= Number(maxPrice) : true;
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  if (sortBy === 'price_low_high') {
    filteredProducts = [...filteredProducts].sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === 'newest') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.id - a.id);
  }

  if (isLoading) {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.spinner} />
        <p style={{ color: '#66767e', marginTop: '12px' }}>Loading products...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={onBack} style={styles.backButton} type="button">&larr; Back</button>
        <div style={styles.brandRow}>
          <span style={styles.brandMark}>ES</span>
          <span style={styles.brandName}>All Products</span>
        </div>
        <button onClick={onAddProduct} style={styles.addBtn} type="button">+ Add</button>
      </header>

      <section style={styles.storeBanner}>
        <div style={styles.storeAvatar}>
          {shop?.logo_url ? (
            <img src={shop.logo_url} alt={shop.name} style={styles.storeLogo} />
          ) : (
            <span role="img" aria-label="store">🏪</span>
          )}
        </div>
        <div style={styles.storeInfo}>
          <h1 style={styles.storeName}>{shop?.name || 'Your Shop'}</h1>
          <p style={styles.storeMeta}>{products.length} product{products.length === 1 ? '' : 's'} in inventory</p>
          <p style={styles.storeDescription}>Browse and manage your full product catalog.</p>
        </div>
      </section>

      <div style={styles.searchWrapper}>
        <svg style={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          aria-label="Search products"
          placeholder="Search your products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

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

      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}

      <main style={styles.gridContainer}>
        {filteredProducts.length > 0 ? (
          <div style={viewMode === 'list' ? { ...styles.grid, gridTemplateColumns: '1fr' } : styles.grid}>
            {filteredProducts.map((product) => (
              <SellerProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p>No products match your filters.</p>
            <button onClick={onAddProduct} style={styles.emptyAddBtn} type="button">Add your first product</button>
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    maxWidth: '480px',
    margin: '0 auto',
    paddingBottom: '90px',
  },
  centerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
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
  backButton: {
    border: 'none',
    background: 'none',
    color: '#64748b',
    fontSize: '14px',
    cursor: 'pointer',
    padding: 0,
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flex: 1,
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
  },
  addBtn: {
    border: '1px solid #00a84e',
    backgroundColor: '#fff',
    color: '#00a84e',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
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
    overflow: 'hidden',
  },
  storeLogo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  storeInfo: { flex: 1, textAlign: 'left' },
  storeName: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#0e1e25',
    margin: '0 0 2px 0',
  },
  storeMeta: {
    fontSize: '12px',
    color: '#66767e',
    margin: '0 0 6px 0',
  },
  storeDescription: {
    fontSize: '12px',
    color: '#94a3b8',
    margin: 0,
    lineHeight: '1.4',
  },
  searchWrapper: {
    position: 'relative',
    padding: '12px 16px 0',
    backgroundColor: '#fff',
  },
  searchIcon: {
    position: 'absolute',
    left: '26px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  searchInput: {
    width: '100%',
    padding: '10px 10px 10px 32px',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f1f5f9',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#0e1e25',
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
  emptyAddBtn: {
    marginTop: '12px',
    border: 'none',
    backgroundColor: '#00a84e',
    color: '#fff',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  errorMessage: {
    margin: '12px 16px 0',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '12px',
  },
};
