import React, { useEffect, useState } from 'react';
import apiClient from '../../../lib/axios';
import { getMyShop } from '../../dashboard/api/getMyShop';
import { updateMyShop } from '../../dashboard/api/updateMyShop';

const emptyForm = {
  name: '',
  slug: '',
  category_id: '',
  description: '',
  email: '',
  phone_code: '+251',
  phone_number: '',
  address: '',
  country: 'Ethiopia',
  region: '',
  city: '',
};

export const ShopProfilePage = ({ onSave }) => {
  const [shop, setShop] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const hydrateForm = (shopData) => {
    setShop(shopData);
    setFormData({
      name: shopData?.name || '',
      slug: shopData?.slug || '',
      category_id: shopData?.category_id || '',
      description: shopData?.description || '',
      email: shopData?.email || '',
      phone_code: shopData?.phone_code || '+251',
      phone_number: shopData?.phone_number || '',
      address: shopData?.address || '',
      country: shopData?.country || 'Ethiopia',
      region: shopData?.region || '',
      city: shopData?.city || '',
    });
    setLogoPreview(shopData?.logo_url || '');
    setLogoFile(null);
  };

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [shopData, categoryResponse] = await Promise.all([
          getMyShop(),
          apiClient.get('/categories'),
        ]);
        hydrateForm(shopData);
        setCategories(categoryResponse.data || []);
      } catch (error) {
        setErrorMessage(error.response?.data?.error || 'Unable to load shop profile.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (logoPreview && logoFile) URL.revokeObjectURL(logoPreview);
    };
  }, [logoFile, logoPreview]);

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Logo must be 2MB or smaller.');
      event.target.value = '';
      return;
    }

    if (logoPreview && logoFile) URL.revokeObjectURL(logoPreview);
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setSuccessMessage('');
  };

  const removeSelectedLogo = () => {
    if (logoPreview && logoFile) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(shop?.logo_url || '');
  };

  const validate = () => {
    if (!formData.name.trim()) return 'Shop name is required.';
    if (!formData.category_id) return 'Please choose a shop category.';
    if (!formData.phone_number.trim()) return 'Phone number is required.';
    if (!formData.city.trim()) return 'City is required.';
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(`shop[${key}]`, value ?? '');
    });
    if (logoFile) payload.append('shop[logo]', logoFile);

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updatedShop = await updateMyShop(payload);
      hydrateForm(updatedShop);
      setSuccessMessage('Shop profile updated.');
      onSave?.(updatedShop);
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.errors?.join(', ') || 'Unable to update shop profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name = '') => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SH';

  if (isLoading) {
    return <div style={styles.message}>Loading shop profile...</div>;
  }

  if (errorMessage && !shop) {
    return <div style={{ ...styles.message, color: '#b91c1c' }}>{errorMessage}</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Shop Profile</h1>
          <p style={styles.subtitle}>Keep your storefront details accurate for buyers.</p>
        </div>
      </header>

      <section style={styles.summary}>
        <div style={styles.logoBlock}>
          {shop?.logo_url ? (
            <img src={shop.logo_url} alt={shop.name} style={styles.logoImage} />
          ) : (
            <span style={styles.logoFallback}>{getInitials(shop?.name)}</span>
          )}
        </div>
        <div style={styles.summaryInfo}>
          <h2 style={styles.shopName}>{shop?.name}</h2>
          <p style={styles.summaryText}>{shop?.category_name || 'Category not set'}</p>
          <p style={styles.summaryText}>{[shop?.city, shop?.region, shop?.country].filter(Boolean).join(', ') || 'Location not set'}</p>
        </div>
      </section>

      {errorMessage && <div style={styles.errorBanner}>{errorMessage}</div>}
      {successMessage && <div style={styles.successBanner}>{successMessage}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.logoUpload}>
          {logoPreview ? (
            <img src={logoPreview} alt="Shop logo preview" style={styles.logoPreview} />
          ) : (
            <span style={styles.logoFallbackLarge}>{getInitials(formData.name)}</span>
          )}
          <span style={styles.logoUploadText}>Update logo</span>
          <input type="file" accept=".jpg,.jpeg,.png,.webp,.svg" onChange={handleLogoChange} style={{ display: 'none' }} />
        </label>
        {logoFile && (
          <button type="button" onClick={removeSelectedLogo} style={styles.removeLogoButton}>
            Remove selected logo
          </button>
        )}

        <div style={styles.inputGrid}>
          <Field label="Shop name">
            <input value={formData.name} onChange={(e) => setField('name', e.target.value)} style={styles.input} required />
          </Field>

          <Field label="Slug">
            <input value={formData.slug} onChange={(e) => setField('slug', e.target.value)} style={styles.input} placeholder="auto-generated if empty" />
          </Field>

          <Field label="Category">
            <select value={formData.category_id} onChange={(e) => setField('category_id', e.target.value)} style={styles.input} required>
              <option value="">Choose category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Email">
            <input type="email" value={formData.email} onChange={(e) => setField('email', e.target.value)} style={styles.input} placeholder="store@example.com" />
          </Field>

          <Field label="Phone code">
            <input value={formData.phone_code} onChange={(e) => setField('phone_code', e.target.value)} style={styles.input} />
          </Field>

          <Field label="Phone number">
            <input value={formData.phone_number} onChange={(e) => setField('phone_number', e.target.value)} style={styles.input} required />
          </Field>

          <Field label="Country">
            <input value={formData.country} onChange={(e) => setField('country', e.target.value)} style={styles.input} />
          </Field>

          <Field label="Region">
            <input value={formData.region} onChange={(e) => setField('region', e.target.value)} style={styles.input} />
          </Field>

          <Field label="City">
            <input value={formData.city} onChange={(e) => setField('city', e.target.value)} style={styles.input} required />
          </Field>

          <Field label="Address">
            <input value={formData.address} onChange={(e) => setField('address', e.target.value)} style={styles.input} />
          </Field>
        </div>

        <Field label="Description">
          <textarea
            value={formData.description}
            onChange={(e) => setField('description', e.target.value)}
            style={styles.textarea}
            rows={5}
          />
        </Field>

        <button type="submit" disabled={isSaving} style={{ ...styles.saveButton, opacity: isSaving ? 0.7 : 1 }}>
          {isSaving ? 'Saving...' : 'Save Shop Profile'}
        </button>
      </form>
    </div>
  );
};

const Field = ({ label, children }) => (
  <label style={styles.field}>
    <span style={styles.label}>{label}</span>
    {children}
  </label>
);

const inputBase = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  color: '#0e1e25',
  caretColor: '#00a84e',
  WebkitTextFillColor: '#0e1e25',
  colorScheme: 'light',
  boxSizing: 'border-box',
  outline: 'none',
  fontFamily: 'inherit',
};

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    maxWidth: '480px',
    margin: '0 auto',
    padding: '16px 16px 104px',
    boxSizing: 'border-box',
  },
  header: {
    marginBottom: '16px',
  },
  title: {
    margin: '0 0 4px',
    color: '#0e1e25',
    fontSize: '22px',
    fontWeight: '800',
  },
  subtitle: {
    margin: 0,
    color: '#66767e',
    fontSize: '13px',
    lineHeight: '1.4',
  },
  summary: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '14px',
    marginBottom: '14px',
  },
  logoBlock: {
    width: '62px',
    height: '62px',
    borderRadius: '8px',
    backgroundColor: '#e2f7ec',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  logoFallback: {
    color: '#00a84e',
    fontWeight: '800',
  },
  summaryInfo: {
    minWidth: 0,
  },
  shopName: {
    margin: '0 0 5px',
    color: '#0e1e25',
    fontSize: '17px',
    fontWeight: '800',
  },
  summaryText: {
    margin: '2px 0',
    color: '#64748b',
    fontSize: '12px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  logoUpload: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#ffffff',
    border: '1px dashed #94a3b8',
    borderRadius: '8px',
    padding: '12px',
    cursor: 'pointer',
  },
  logoPreview: {
    width: '58px',
    height: '58px',
    borderRadius: '8px',
    objectFit: 'cover',
    backgroundColor: '#f1f5f9',
  },
  logoFallbackLarge: {
    width: '58px',
    height: '58px',
    borderRadius: '8px',
    backgroundColor: '#e2f7ec',
    color: '#00a84e',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoUploadText: {
    color: '#0e1e25',
    fontSize: '13px',
    fontWeight: '700',
  },
  removeLogoButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#ef4444',
    fontSize: '13px',
    fontWeight: '700',
    textAlign: 'left',
    cursor: 'pointer',
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#4b5563',
    fontSize: '12px',
    fontWeight: '700',
  },
  input: {
    ...inputBase,
    minHeight: '42px',
    padding: '10px 11px',
    fontSize: '14px',
  },
  textarea: {
    ...inputBase,
    minHeight: '110px',
    padding: '11px',
    fontSize: '14px',
    lineHeight: '1.45',
    resize: 'vertical',
  },
  saveButton: {
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#00a84e',
    color: '#ffffff',
    padding: '13px 16px',
    fontSize: '14px',
    fontWeight: '800',
    cursor: 'pointer',
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '13px',
    marginBottom: '12px',
  },
  successBanner: {
    backgroundColor: '#ecfdf5',
    border: '1px solid #bbf7d0',
    color: '#047857',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '13px',
    marginBottom: '12px',
  },
  message: {
    maxWidth: '480px',
    margin: '0 auto',
    padding: '56px 20px',
    textAlign: 'center',
    color: '#66767e',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
};
