import React, { useState, useEffect, useRef } from 'react';
import { ProductFormField } from '../components/ProductFormField';
import { createProduct } from '../api/createProduct';
import { updateProduct } from '../api/updateProduct';
import { getProductCategories } from '../api/getProductCategories';

export const AddProductPage = ({ onCancel, onSaveSuccess }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    productCategoryId: ''
  });
  const [selectedImages, setSelectedImages] = useState([]);

  const [nameCount, setNameCount] = useState(0);
  const [descCount, setDescCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [productCategories, setProductCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedImagesRef = useRef([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    selectedImagesRef.current = selectedImages;
  }, [selectedImages]);

  useEffect(() => {
    return () => {
      selectedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getProductCategories();
        setProductCategories(categories);
      } catch (error) {
        console.error('Failed to load product categories:', error);
      }
    };

    loadCategories();
  }, []);

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

  const addSelectedFiles = (fileList) => {
    const files = Array.from(fileList || []);
    const validImages = [];
    const rejectedFiles = [];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        rejectedFiles.push(file.name);
        return;
      }

      const imageId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

      validImages.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${imageId}`,
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        status: 'pending'
      });
    });

    if (validImages.length) {
      setSelectedImages(prev => [...prev, ...validImages]);
    }

    if (rejectedFiles.length) {
      alert(`Some images are larger than 5MB: ${rejectedFiles.join(', ')}`);
    }
  };

  const handleFileChange = (e) => {
    addSelectedFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    addSelectedFiles(e.dataTransfer.files);
  };

  const removeSelectedImage = (imageId) => {
    setSelectedImages(prev => {
      const image = prev.find(item => item.id === imageId);
      if (image) URL.revokeObjectURL(image.previewUrl);
      return prev.filter(item => item.id !== imageId);
    });
  };

  const updateImageProgress = (imageId, updates) => {
    setSelectedImages(prev => prev.map(image => (
      image.id === imageId ? { ...image, ...updates } : image
    )));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('product[name]', productData.name);
    formData.append('product[description]', productData.description);
    formData.append('product[price]', productData.price);
    formData.append('product[quantity]', productData.stock);
    formData.append('product[product_category_id]', productData.productCategoryId);

    setIsSaving(true);
    setErrorMessage('');

    try {
      const createdProduct = await createProduct(formData);

      for (const image of selectedImages) {
        const imageData = new FormData();
        imageData.append('product[images][]', image.file);
        updateImageProgress(image.id, { progress: 0, status: 'uploading' });
        await updateProduct(createdProduct.id, imageData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            updateImageProgress(image.id, { progress });
          }
        });
        updateImageProgress(image.id, { progress: 100, status: 'done' });
      }

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

        <ProductFormField
          label="Category"
          subLabel="Choose the category that best matches your product."
        >
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <div 
              style={{
                ...styles.inputField, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              <span>
                {productData.productCategoryId 
                  ? productCategories.find(c => c.id == productData.productCategoryId)?.name 
                  : 'Select Category'}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '10px' }}>▼</span>
            </div>
            
            {isCategoryDropdownOpen && (
              <div style={styles.dropdownMenu}>
                {productCategories.map((category) => (
                  <div
                    key={category.id}
                    style={{
                      ...styles.dropdownItem,
                      backgroundColor: productData.productCategoryId == category.id ? '#f0fdf4' : '#fff',
                      color: productData.productCategoryId == category.id ? '#00a84e' : '#0e1e25',
                    }}
                    onClick={() => {
                      handleInputChange({ target: { name: 'productCategoryId', value: category.id } });
                      setIsCategoryDropdownOpen(false);
                    }}
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ProductFormField>

        {/* IMAGE UPLOAD TARGET BOX */}
        <ProductFormField label="Product Images" subLabel="Upload clear images of your product.">
          <div
            style={styles.uploadBox}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div style={styles.uploadIconCircle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00a84e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <div style={styles.miniPlusBadge}>＋</div>
            </div>
            <div style={styles.uploadTextContainer}>
              <span style={styles.uploadTitle}>Upload Product Images</span>
              <span style={styles.uploadSubtitle}>Select or drop multiple JPG, PNG or WEBP files.</span>
            </div>
            <label style={styles.chooseImageLabel}>
              Choose Images
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          {selectedImages.length > 0 && (
            <div style={styles.previewGrid}>
              {selectedImages.map((image) => (
                <div key={image.id} style={styles.previewCard}>
                  <img src={image.previewUrl} alt={image.file.name} style={styles.previewImage} />
                  <button
                    type="button"
                    onClick={() => removeSelectedImage(image.id)}
                    disabled={isSaving}
                    style={styles.removeImageBtn}
                    aria-label={`Remove ${image.file.name}`}
                  >
                    ×
                  </button>
                  <div style={styles.previewMeta}>
                    <span style={styles.previewName}>{image.file.name}</span>
                    {image.status !== 'pending' && (
                      <div style={styles.progressTrack}>
                        <div style={{ ...styles.progressFill, width: `${image.progress}%` }} />
                      </div>
                    )}
                    {image.status !== 'pending' && (
                      <span style={styles.progressText}>{image.progress}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '10px',
    marginTop: '10px',
  },
  previewCard: {
    position: 'relative',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  previewImage: {
    width: '100%',
    aspectRatio: '1 / 1',
    objectFit: 'cover',
    display: 'block',
    backgroundColor: '#f8fafc',
  },
  removeImageBtn: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    color: '#fff',
    fontSize: '18px',
    lineHeight: 1,
    cursor: 'pointer',
  },
  previewMeta: {
    padding: '8px',
  },
  previewName: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: '#475569',
    fontSize: '11px',
    fontWeight: '600',
  },
  progressTrack: {
    height: '5px',
    marginTop: '7px',
    borderRadius: '999px',
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00a84e',
    transition: 'width 0.15s ease',
  },
  progressText: {
    display: 'block',
    marginTop: '3px',
    color: '#00a84e',
    fontSize: '11px',
    fontWeight: '700',
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
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginTop: '4px',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 100,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  dropdownItem: {
    padding: '12px',
    fontSize: '14px',
    cursor: 'pointer',
    borderBottom: '1px solid #f0f4f8',
  }
};
