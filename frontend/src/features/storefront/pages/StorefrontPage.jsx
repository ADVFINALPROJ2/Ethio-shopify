import React, { useState, useEffect } from 'react';
import apiClient from '../../../lib/axios';
import { purchaseProduct } from '../../products/api/purchaseProduct';

const BagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const StorefrontPage = ({ slug }) => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasing, setPurchasing] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await apiClient.get(`/shops/${slug}`);
        setShop(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Shop not found');
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [slug]);

  const handlePurchase = async (product) => {
    setPurchasing(product.id);
    setMessage('');
    try {
      await purchaseProduct(product.id, 1);
      
      // Update local stock to reflect purchase
      setShop(prev => ({
        ...prev,
        products: prev.products.map(p => 
          p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
        )
      }));
      
      setMessage(`Successfully placed order for ${product.name}!`);
      
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.errors?.join(', ') || 'Failed to place order.');
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
      }
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setPurchasing(null);
    }
  };

  const formatCurrency = (value) => `ETB ${Number(value || 0).toLocaleString()}`;
  const getInitials = (name = '') => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SH';

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

  const products = shop.products || [];

  return (
    <div style={styles.container}>
      {/* Toast Notification */}
      {message && (
        <div style={styles.toastBanner}>
          {message}
        </div>
      )}

      {/* Header Profile Section */}
      <div style={styles.headerCover}></div>
      <div style={styles.profileSection}>
        <div style={styles.logoContainer}>
          {shop.logo_url ? (
            <img src={shop.logo_url} alt={shop.name} style={styles.logoImage} />
          ) : (
            <span style={styles.logoInitials}>{getInitials(shop.name)}</span>
          )}
        </div>
        <h1 style={styles.shopName}>{shop.name}</h1>
        {shop.description && (
          <p style={styles.description}>{shop.description}</p>
        )}
        
        <div style={styles.contactRow}>
          {(shop.city || shop.region || shop.country) && (
            <span style={styles.contactItem}>
              <LocationIcon />
              {[shop.city, shop.region, shop.country].filter(Boolean).join(', ')}
            </span>
          )}
          {shop.phone_number && (
            <span style={styles.contactItem}>
              <PhoneIcon />
              {shop.phone_code} {shop.phone_number}
            </span>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div style={styles.productsContainer}>
        <h2 style={styles.sectionTitle}>Products ({products.length})</h2>
        
        {products.length > 0 ? (
          <div style={styles.grid}>
            {products.map(product => {
              const inStock = product.quantity > 0;
              const imageUrl = product.image_urls?.[0];
              
              return (
                <div key={product.id} style={styles.productCard}>
                  <div style={styles.imageWrapper}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} style={styles.productImage} />
                    ) : (
                      <div style={styles.noImage}>No Image</div>
                    )}
                    {!inStock && <div style={styles.outOfStockBadge}>Sold Out</div>}
                  </div>
                  
                  <div style={styles.productInfo}>
                    <h3 style={styles.productName}>{product.name}</h3>
                    <p style={styles.productPrice}>{formatCurrency(product.price)}</p>
                    <button 
                      onClick={() => handlePurchase(product)}
                      disabled={!inStock || purchasing === product.id}
                      style={{
                        ...styles.buyButton,
                        backgroundColor: !inStock ? '#e2e8f0' : (purchasing === product.id ? '#059669' : '#00a84e'),
                        color: !inStock ? '#94a3b8' : '#fff',
                        cursor: !inStock ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {purchasing === product.id ? 'Ordering...' : (inStock ? 'Buy Now' : 'Sold Out')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <BagIcon />
            <p>This shop hasn't added any products yet.</p>
          </div>
        )}
      </div>
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
    position: 'relative',
    paddingBottom: '40px'
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
  toastBanner: {
    position: 'fixed',
    top: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#0e1e25',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '30px',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    width: 'max-content',
    maxWidth: '90%',
    textAlign: 'center'
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #00a84e',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  headerCover: {
    height: '120px',
    backgroundColor: '#00a84e',
    backgroundImage: 'linear-gradient(135deg, #00a84e 0%, #059669 100%)',
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: '0 20px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderBottom: '1px solid #e2e8f0',
    position: 'relative',
    marginTop: '-40px'
  },
  logoContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    border: '4px solid #fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: '12px'
  },
  logoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  logoInitials: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#00a84e'
  },
  shopName: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0e1e25',
    margin: '0 0 8px 0',
    textAlign: 'center'
  },
  description: {
    fontSize: '14px',
    color: '#4a5568',
    margin: '0 0 16px 0',
    textAlign: 'center',
    lineHeight: '1.5'
  },
  contactRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#66767e',
    backgroundColor: '#f1f5f9',
    padding: '6px 12px',
    borderRadius: '20px'
  },
  productsContainer: {
    padding: '20px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0e1e25',
    margin: '0 0 16px 0'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column'
  },
  imageWrapper: {
    width: '100%',
    paddingBottom: '100%', // 1:1 aspect ratio
    position: 'relative',
    backgroundColor: '#f1f5f9'
  },
  productImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
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
    fontSize: '12px',
    color: '#94a3b8'
  },
  outOfStockBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  productInfo: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  productName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0e1e25',
    margin: '0 0 4px 0',
    lineHeight: '1.3'
  },
  productPrice: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#00a84e',
    margin: '0 0 12px 0'
  },
  buyButton: {
    border: 'none',
    padding: '8px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    width: '100%',
    marginTop: 'auto',
    transition: 'all 0.2s ease'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    color: '#94a3b8',
    textAlign: 'center',
    gap: '12px'
  }
};
