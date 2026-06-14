import React, { useState } from 'react';
import { ProductFormField } from '../components/ProductFormField';
import { createProduct } from '../api/createProduct';

export const AddProductPage = ({ onCancel, onSaveSuccess }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null
  });

  const [nameCount, setNameCount] = useState(0);
  const [descCount, setDescCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      if (value.length > 100) return;
      setNameCount(value.length);
    }
    
    if (name === 'description') {
      if (value.length > 1000) return;
      setDescCount(value.length);
    }

    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 5 * 1024 * 1024) {
        setProductData(prev => ({ ...prev, image: file }));
      } else {
        alert("The selected image file is too large. Maximum size allowed is 5MB.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('product[name]', productData.name);
    formData.append('product[description]', productData.description);
    formData.append('product[price]', productData.price);
    formData.append('product[quantity]', productData.stock);

    if (productData.image) {
      formData.append('product[images][]', productData.image);
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      await createProduct(formData);
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
      if (onSaveSuccess) onSaveSuccess();
    } catch (error) {
      setErrorMessage(error.response?.data?.errors?.join(', ') || 'Unable to save product.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* TOP HEADER GLOBAL BAR */}
      <header style={styles.header}>
        <button onClick={onCancel} style={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>🛍️</span>
          <span style={styles.logoText}>EthioShopify</span>
        </div>
        <div style={styles.userMenu}>
          <div style={styles.avatar}>S</div>
          <span style={styles.roleText}>Seller</span>
          <span style={styles.dropdownArrow}>▾</span>
        </div>
      </header>

      {/* HERO INTRODUCTION SEGMENT */}
      <section style={styles.heroSection}>
        <div>
          <h1 style={styles.heroTitle}>Add New Product</h1>
          <p style={styles.heroSubtitle}>
            Fill in the details below to add a new product to your shop.
          </p>
        </div>
      </section>

      {/* FORM INPUT FIELDS */}
      <form onSubmit={handleSubmit} style={styles.form}>
        
        {/* PRODUCT NAME */}
        <ProductFormField label="Product Name" subLabel="Choose a clear and descriptive name.">
          <div style={styles.inputWithCounterContainer}>
            <input 
              type="text"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              style={styles.inputField}
              required
            />
            <span style={styles.embeddedCounter}>{nameCount}/100</span>
          </div>
        </ProductFormField>

        {/* DESCRIPTION */}
        <ProductFormField label="Description" subLabel="Describe your product, its features, materials, and benefits.">
          <div style={styles.textareaContainer}>
            <textarea 
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              style={styles.textareaField}
              rows={4}
              required
            />
            <span style={styles.textareaCounter}>{descCount}/1000</span>
          </div>
        </ProductFormField>

        {/* PRICE */}
        <ProductFormField label="Price" trailingText="(ETB)" subLabel="Set the selling price of your product.">
          <input 
            type="number"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
            placeholder="Enter price"
            style={styles.inputField}
            min="0"
            step="0.01"
            required
          />
        </ProductFormField>

        {/* STOCK QUANTITY */}
        <ProductFormField label="Stock Quantity" subLabel="How many items do you have in stock?">
          <input 
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleInputChange}
            placeholder="Enter stock quantity"
            style={styles.inputField}
            min="0"
            required
          />
        </ProductFormField>

        {/* IMAGE UPLOAD TARGET BOX */}
        <ProductFormField label="Product Image" subLabel="Upload a clear image of your product.">
          <div style={styles.uploadBox}>
            <div style={styles.uploadIconCircle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00a84e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <div style={styles.miniPlusBadge}>＋</div>
            </div>
            <div style={styles.uploadTextContainer}>
              <span style={styles.uploadTitle}>Upload Product Image</span>
              <span style={styles.uploadSubtitle}>JPG, PNG or WEBP. Max size 5MB.</span>
            </div>
            <label style={styles.chooseImageLabel}>
              Choose Image
              <input 
                type="file" 
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </ProductFormField>

        {/* ACTION ACTION BUTTONS SPLIT BAR */}
        {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
        <div style={styles.actionButtonGroup}>
          <button type="button" onClick={onCancel} style={styles.cancelBtn} disabled={isSaving}>
            Cancel
          </button>
          <button type="submit" style={{ ...styles.saveBtn, opacity: isSaving ? 0.7 : 1 }} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>

      {/* STATIC DECORATIVE BOTTOM NAVIGATION TABS SIMULATOR */}
      <nav style={styles.bottomNav}>
        <div style={{ ...styles.navItem, color: '#00a84e' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
          <span style={{ marginTop: '2px' }}>Dashboard</span>
        </div>
        <div style={{ ...styles.navItem, color: '#66767e' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          </svg>
          <span style={{ marginTop: '2px' }}>Orders</span>
        </div>
        <div style={{ ...styles.navItem, color: '#66767e' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          <span style={{ marginTop: '2px' }}>Profile</span>
        </div>
      </nav>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '16px 16px 90px 16px',
    boxSizing: 'border-box',
    maxWidth: '480px',
    margin: '0 auto',
  },
  header: { display: 'flex', alignItems: 'center', marginBottom: '24px' },
  backButton: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: '4px 8px 4px 0',
    color: '#0e1e25',
    display: 'flex',
    alignItems: 'center',
  },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '4px' },
  logoIcon: { fontSize: '18px' },
  logoText: { fontWeight: '700', fontSize: '16px', color: '#00a84e' },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#f8fafc',
    padding: '4px 8px',
    borderRadius: '20px',
    border: '1px solid #eaeaea',
    marginLeft: 'auto',
  },
  avatar: {
    width: '20px',
    height: '20px',
    backgroundColor: '#e2f7ec',
    color: '#00a84e',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  roleText: { fontSize: '12px', color: '#4a555a' },
  dropdownArrow: { fontSize: '9px', color: '#888' },
  heroSection: {
    marginBottom: '28px',
  },
  heroTitle: { fontSize: '24px', fontWeight: '800', color: '#0e1e25', margin: '0 0 6px 0', textAlign: 'left' },
  heroSubtitle: { fontSize: '13px', color: '#66767e', margin: 0, lineHeight: '1.4', textAlign: 'left' },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputWithCounterContainer: {
    position: 'relative',
    width: '100%',
  },
  inputField: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#0e1e25',
  },
  embeddedCounter: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '11px',
    color: '#a0aec0',
  },
  textareaContainer: {
    position: 'relative',
    width: '100%',
  },
  textareaField: {
    width: '100%',
    padding: '12px 12px 28px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'none',
    fontFamily: 'inherit',
    color: '#0e1e25',
  },
  textareaCounter: {
    position: 'absolute',
    right: '12px',
    bottom: '10px',
    fontSize: '11px',
    color: '#a0aec0',
  },
  uploadBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px dashed #ccd4d8',
    padding: '14px 12px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    gap: '8px',
  },
  uploadIconCircle: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#edf9f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
  },
  miniPlusBadge: {
    position: 'absolute',
    bottom: '6px',
    right: '4px',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#00a84e',
    lineHeight: 1,
  },
  uploadTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  uploadTitle: { fontSize: '13px', fontWeight: '700', color: '#0e1e25' },
  uploadSubtitle: { fontSize: '11px', color: '#a0aec0', marginTop: '2px' },
  chooseImageLabel: {
    backgroundColor: '#ffffff',
    border: '1px solid #00a84e',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#00a84e',
    cursor: 'pointer',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  actionButtonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '10px',
  },
  errorMessage: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '12px',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    border: '1px solid #00a84e',
    color: '#00a84e',
    padding: '14px 0',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#00a84e',
    color: '#ffffff',
    border: 'none',
    padding: '14px 0',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center',
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '480px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '8px 0 20px 0',
    boxSizing: 'border-box',
    zIndex: 10,
  },
  navItem: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '11px',
    fontWeight: '500',
  }
};
