import React, { useEffect, useState } from 'react';
import { getStorefrontProduct } from '../api/getStorefrontProduct';
import addToCart from '../../cart/api/addToCart';

export const BuyerProductDetailsPage = ({ slug, productId, userId, onBack, onCartChanged, onGoToCart }) => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!slug || !productId) return;

    const loadProduct = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const data = await getStorefrontProduct(slug, productId);
        setProduct(data);
        setSelectedImage(data.image_urls?.[0] || '');
      } catch (error) {
        setErrorMessage(error.response?.data?.error || 'Unable to load product.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [slug, productId]);

  const handleAddToCart = async () => {
    if (!product || isAdding) return;
    setIsAdding(true);
    try {
      const cart = await addToCart(userId, product.id, 1);
      onCartChanged?.(cart.item_count || 0);
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
    } catch (error) {
      alert(error.response?.data?.errors?.[0] || 'Could not add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const formatCurrency = (value) => `ETB ${Number(value || 0).toLocaleString()}`;
  const images = product?.image_urls || [];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={onBack} style={styles.iconButton} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <span style={styles.headerTitle}>Product Details</span>
        <button onClick={onGoToCart} style={styles.iconButton} aria-label="Cart">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </button>
      </header>

      {isLoading && <div style={styles.message}>Loading product...</div>}
      {errorMessage && <div style={{ ...styles.message, color: '#b91c1c' }}>{errorMessage}</div>}

      {!isLoading && product && (
        <>
          <section style={styles.gallery}>
            <div style={styles.heroImage}>
              {selectedImage ? (
                <img src={selectedImage} alt={product.name} style={styles.image} />
              ) : (
                <div style={styles.noImage}>No image</div>
              )}
            </div>
            {images.length > 1 && (
              <div style={styles.thumbs}>
                {images.map((imageUrl) => (
                  <button
                    key={imageUrl}
                    type="button"
                    onClick={() => setSelectedImage(imageUrl)}
                    style={{
                      ...styles.thumb,
                      borderColor: selectedImage === imageUrl ? '#00a84e' : '#e2e8f0'
                    }}
                  >
                    <img src={imageUrl} alt="" style={styles.thumbImage} />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section style={styles.details}>
            <p style={styles.category}>{product.product_category_name || 'Uncategorized'}</p>
            <h1 style={styles.name}>{product.name}</h1>
            <p style={styles.price}>{formatCurrency(product.price)}</p>
            <p style={styles.description}>{product.description || 'No description provided.'}</p>
            
          </section>

          <footer style={styles.footer}>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding || Number(product.quantity || 0) < 1}
              style={{
                ...styles.addButton,
                opacity: isAdding || Number(product.quantity || 0) < 1 ? 0.65 : 1
              }}
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </footer>
        </>
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
    paddingBottom: '88px',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e2e8f0',
  },
  iconButton: {
    width: '36px',
    height: '36px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#0e1e25',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  headerTitle: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#0e1e25',
  },
  message: {
    padding: '40px 20px',
    textAlign: 'center',
    color: '#66767e',
    fontSize: '14px',
  },
  gallery: {
    backgroundColor: '#fff',
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
  },
  heroImage: {
    aspectRatio: '1 / 1',
    width: '100%',
    borderRadius: '8px',
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    color: '#94a3b8',
    fontSize: '14px',
  },
  thumbs: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingTop: '12px',
  },
  thumb: {
    width: '64px',
    height: '64px',
    flex: '0 0 64px',
    padding: 0,
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#fff',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  details: {
    padding: '18px 16px',
    backgroundColor: '#fff',
  },
  category: {
    margin: '0 0 6px',
    color: '#00a84e',
    fontSize: '12px',
    fontWeight: '800',
  },
  name: {
    margin: '0 0 8px',
    color: '#0e1e25',
    fontSize: '24px',
    fontWeight: '800',
    lineHeight: '1.2',
    textAlign: 'left',
  },
  price: {
    margin: '0 0 14px',
    color: '#00a84e',
    fontSize: '20px',
    fontWeight: '800',
  },
  description: {
    margin: '0 0 18px',
    color: '#4b5563',
    fontSize: '14px',
    lineHeight: '1.55',
  },
  footer: {
    position: 'fixed',
    left: '50%',
    bottom: 0,
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '480px',
    padding: '12px 16px calc(12px + env(safe-area-inset-bottom, 0px))',
    backgroundColor: '#fff',
    borderTop: '1px solid #e2e8f0',
    boxSizing: 'border-box',
  },
  addButton: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#00a84e',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '800',
    cursor: 'pointer',
  },
};
