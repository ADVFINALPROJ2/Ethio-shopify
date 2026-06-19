import { useState } from 'react';

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0e1e25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CloudUploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00a84e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19H9a7 7 0 116.71-9h1.79a4.5 4.5 0 110 9z" />
    <line x1="12" y1="13" x2="12" y2="22" />
    <polyline points="8 17 12 13 16 17" />
  </svg>
);

const STEPS = [
  { key: 'shopName', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'contact', label: 'Contact' },
  { key: 'location', label: 'Location' },
  { key: 'logo', label: 'Logo' },
  { key: 'description', label: 'Description' },
  { key: 'review', label: 'Review' },
];

const categories = [
  { id: 1, name: 'Electronics & Gadgets' },
  { id: 2, name: 'Clothing & Apparel' },
  { id: 3, name: 'Cosmetics & Beauty' },
  { id: 4, name: 'Food & Groceries' },
  { id: 5, name: 'Books & Stationery' },
  { id: 6, name: 'Others' }
];

export const ShopSetupPage = ({ onBack, onComplete, error, isLoading }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    shopName: '',
    categoryId: null,
    email: '',
    phoneCode: '+251',
    phoneNumber: '',
    country: 'Ethiopia',
    region: '',
    city: '',
    address: '',
    description: '',
    logo: null,
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const setField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
    if (step === 2 && !formData.categoryId) newErrors.categoryId = 'Please select a category';

    if (step === 3) {
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      }

      if (
        formData.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
      ) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (step === 4 && !formData.city.trim()) newErrors.city = 'City is required';
    return newErrors;
  };

  const handleNext = () => {
    const fieldErrors = validateStep();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    if (step < STEPS.length) {
      setStep(s => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(s => s - 1);
    } else {
      onBack();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, logo: 'File too large. Max 2MB.' }));
      e.target.value = '';
      return;
    }

    if (logoPreview) URL.revokeObjectURL(logoPreview);

    setLogoPreview(URL.createObjectURL(file));
    setField('logo', file);
    setErrors(prev => ({ ...prev, logo: null }));
  };

  const handleSubmit = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
    if (onComplete) onComplete(formData);
  };

  const progress = (step / STEPS.length) * 100;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={handleBack} style={styles.backButton}>
          <ChevronLeftIcon />
        </button>
        <span style={styles.stepCount}>Step {step} of {STEPS.length}</span>
      </header>

      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      <div style={styles.stepDots}>
        {STEPS.map((s, i) => (
          <div key={s.key} style={styles.dotWrapper}>
            <div style={{
              ...styles.dot,
              backgroundColor: i + 1 <= step ? '#00a84e' : '#e2e8f0',
              color: i + 1 <= step ? '#fff' : '#94a3b8',
            }}>
              {i + 1 < step ? <CheckIcon /> : i + 1}
            </div>
            {/* Hiding labels on mobile to prevent clutter with 7 steps, optionally keeping it simple */}
          </div>
        ))}
      </div>

      <div style={styles.content}>
        {step === 1 && (
          <div style={styles.stepBlock}>
            <h2 style={styles.title}>What's your shop called?</h2>
            <p style={styles.subtitle}>Choose a name that represents your brand.</p>
            <input
              type="text"
              value={formData.shopName}
              onChange={e => setField('shopName', e.target.value)}
              placeholder="e.g. Ethio Fashion"
              style={styles.input}
              autoFocus
            />
            {errors.shopName && <span style={styles.error}>{errors.shopName}</span>}
          </div>
        )}

        {step === 2 && (
          <div style={styles.stepBlock}>
            <h2 style={styles.title}>Pick a category</h2>
            <p style={styles.subtitle}>What type of products do you sell?</p>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setField('categoryId', cat.id)}
                style={{
                  ...styles.categoryCard,
                  borderColor: formData.categoryId === cat.id ? '#00a84e' : '#e2e8f0',
                  backgroundColor: formData.categoryId === cat.id ? '#edf9f2' : '#fff',
                }}
              >
                <span style={{
                  ...styles.radio,
                  borderColor: formData.categoryId === cat.id ? '#00a84e' : '#ccd4d8',
                }}>
                  {formData.categoryId === cat.id && <span style={styles.radioInner} />}
                </span>
                {cat.name}
              </button>
            ))}
            {errors.categoryId && <span style={styles.error}>{errors.categoryId}</span>}
          </div>
        )}

        {step === 3 && (
          <div style={styles.stepBlock}>
            <h2 style={styles.title}>Contact Information</h2>
            <p style={styles.subtitle}>How can customers reach you?</p>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={formData.phoneCode}
                  onChange={e => setField('phoneCode', e.target.value)}
                  style={{ ...styles.input, width: '80px', flexShrink: 0 }}
                />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={e => setField('phoneNumber', e.target.value)}
                  placeholder="911 234 567"
                  style={{ ...styles.input, flex: 1 }}
                  autoFocus
                />
              </div>
              {errors.phoneNumber && <span style={styles.error}>{errors.phoneNumber}</span>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setField('email', e.target.value)}
                placeholder="store@example.com"
                style={styles.input}
              />
              {errors.email && <span style={styles.error}>{errors.email}</span>}
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={styles.stepBlock}>
            <h2 style={styles.title}>Shop Location</h2>
            <p style={styles.subtitle}>Where is your business located?</p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>Country</label>
                <input type="text" value={formData.country} onChange={e => setField('country', e.target.value)} style={styles.input} />
              </div>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>Region (Optional)</label>
                <input type="text" value={formData.region} onChange={e => setField('region', e.target.value)} style={styles.input} />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>City</label>
              <input type="text" value={formData.city} onChange={e => setField('city', e.target.value)} placeholder="e.g. Addis Ababa" style={styles.input} autoFocus />
              {errors.city && <span style={styles.error}>{errors.city}</span>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Street Address (Optional)</label>
              <input type="text" value={formData.address} onChange={e => setField('address', e.target.value)} placeholder="e.g. Bole Road, House 123" style={styles.input} />
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={styles.stepBlock}>
            <h2 style={styles.title}>Add your logo</h2>
            <p style={styles.subtitle}>Upload a logo to make your shop recognizable.</p>
            <label style={styles.uploadArea}>
              {logoPreview ? (
                <img src={logoPreview} alt="preview" style={styles.logoPreview} />
              ) : (
                <div style={styles.uploadPlaceholder}>
                  <CloudUploadIcon />
                  <span style={styles.uploadText}>Tap to upload</span>
                  <span style={styles.uploadHint}>JPG, PNG or SVG. Max 2MB.</span>
                </div>
              )}
              <input type="file" accept=".jpg,.jpeg,.png,.svg" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
            {logoPreview && (
              <button onClick={() => { setField('logo', null); setLogoPreview(null); }} style={styles.removeBtn}>
                Remove
              </button>
            )}
            {errors.logo && <span style={styles.error}>{errors.logo}</span>}
          </div>
        )}

        {step === 6 && (
          <div style={styles.stepBlock}>
            <h2 style={styles.title}>Describe your shop</h2>
            <p style={styles.subtitle}>Tell customers what makes your shop special.</p>
            <div style={styles.textareaWrapper}>
              <textarea
                value={formData.description}
                onChange={e => {
                  if (e.target.value.length <= 500) setField('description', e.target.value);
                }}
                placeholder="Share your story, what you sell, and what makes you unique..."
                style={styles.textarea}
                rows={5}
                autoFocus
              />
              <span style={styles.charCount}>{formData.description.length}/500</span>
            </div>
          </div>
        )}

        {step === 7 && (
          <div style={styles.stepBlock}>
            <h2 style={styles.title}>Review & Create</h2>
            <p style={styles.subtitle}>Make sure everything looks good before launching your shop.</p>

            <div style={styles.reviewCard}>
              {logoPreview && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <img src={logoPreview} alt="Shop logo" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
              )}

              <div style={styles.reviewRow}>
                <span style={styles.reviewLabel}>Shop Name</span>
                <span style={styles.reviewValue}>{formData.shopName}</span>
              </div>
              <div style={styles.reviewRow}>
                <span style={styles.reviewLabel}>Category</span>
                <span style={styles.reviewValue}>{categories.find(c => c.id === formData.categoryId)?.name}</span>
              </div>
              <div style={styles.reviewRow}>
                <span style={styles.reviewLabel}>Phone</span>
                <span style={styles.reviewValue}>{formData.phoneCode} {formData.phoneNumber}</span>
              </div>
              {formData.email && (
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Email</span>
                  <span style={styles.reviewValue}>{formData.email}</span>
                </div>
              )}
              <div style={styles.reviewRow}>
                <span style={styles.reviewLabel}>Location</span>
                <span style={styles.reviewValue}>{[formData.city, formData.region, formData.country].filter(Boolean).join(', ')}</span>
              </div>
              {formData.description && (
                <div style={{ ...styles.reviewRow, flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                  <span style={styles.reviewLabel}>Description</span>
                  <span style={{ ...styles.reviewValue, textAlign: 'left', fontSize: '13px' }}>{formData.description}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p style={styles.errorBanner}>{error}</p>}

      <button 
        onClick={handleNext} 
        style={{ ...styles.nextButton, opacity: isLoading ? 0.7 : 1 }} 
        disabled={isLoading}
      >
        {step < STEPS.length ? 'Continue' : (isLoading ? 'Creating Shop...' : 'Create Shop')}
      </button>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '16px',
    boxSizing: 'border-box',
    maxWidth: '480px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  backButton: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
  },
  stepCount: {
    fontSize: '13px',
    color: '#66767e',
    fontWeight: '500',
  },
  progressBar: {
    width: '100%',
    height: '4px',
    backgroundColor: '#e2e8f0',
    borderRadius: '2px',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00a84e',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  stepDots: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  dotWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  dot: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    transition: 'all 0.2s ease',
  },
  content: {
    flex: 1,
  },
  stepBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0e1e25',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#66767e',
    margin: 0,
    lineHeight: '1.4',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4a5568',
  },
  input: {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#fdfdfd',
  },
  categoryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0',
    backgroundColor: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0e1e25',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
    boxSizing: 'border-box',
  },
  radio: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2px solid #ccd4d8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioInner: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#00a84e',
  },
  uploadArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed #ccd4d8',
    borderRadius: '12px',
    padding: '32px',
    cursor: 'pointer',
    backgroundColor: '#fafafa',
    transition: 'border-color 0.2s ease',
  },
  uploadPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  uploadText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0e1e25',
  },
  uploadHint: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  logoPreview: {
    width: '120px',
    height: '120px',
    objectFit: 'contain',
    borderRadius: '8px',
  },
  removeBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#ef4444',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '4px 0',
  },
  textareaWrapper: {
    position: 'relative',
    width: '100%',
  },
  textarea: {
    width: '100%',
    padding: '14px 14px 32px 14px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'none',
    fontFamily: 'inherit',
    backgroundColor: '#fdfdfd',
    lineHeight: '1.5',
  },
  charCount: {
    position: 'absolute',
    right: '10px',
    bottom: '10px',
    fontSize: '11px',
    color: '#94a3b8',
  },
  reviewCard: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  reviewRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '8px'
  },
  reviewLabel: {
    fontSize: '13px',
    color: '#66767e',
    fontWeight: '500'
  },
  reviewValue: {
    fontSize: '14px',
    color: '#0e1e25',
    fontWeight: '600',
    textAlign: 'right'
  },
  nextButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00a84e',
    color: '#ffffff',
    border: 'none',
    padding: '14px 16px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: 'auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  error: {
    fontSize: '12px',
    color: '#ef4444',
  },
  errorBanner: {
    fontSize: '13px',
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center',
    margin: 0,
    marginBottom: '16px'
  },
};
