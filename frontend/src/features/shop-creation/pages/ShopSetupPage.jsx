import { useState } from 'react';
import { FormField } from '../components/FormField';

/* ---------- SVG Icon Components ---------- */

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0e1e25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00a84e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const ChevronDownIcon = ({ color = '#a0aec0' }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CloudUploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00a84e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19H9a7 7 0 116.71-9h1.79a4.5 4.5 0 110 9z" />
    <line x1="12" y1="13" x2="12" y2="22" />
    <polyline points="8 17 12 13 16 17" />
  </svg>
);

const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00a84e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const ShopSetupPage = ({ onBack, onComplete }) => {
  const [formData, setFormData] = useState({
    shopName: '',
    category: '',
    description: '',
    email: '',
    phoneCode: '+251',
    phoneNumber: '',
    address: '',
    country: '',
    region: '',
    city: '',
    logo: null
  });

  const [descriptionCount, setDescriptionCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'description') {
      if (value.length > 500) return;
      setDescriptionCount(value.length);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
      setFormData(prev => ({ ...prev, logo: file }));
    } else {
      alert("File is too large or invalid. Max size is 2MB.");
    }
  };

  const handleNextSubmit = (e) => {
    e.preventDefault();
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
    console.log("Submitting Shop Data: ", formData);
    if (onComplete) {
      onComplete(formData);
    }
  };

  return (
    <div style={styles.container}>
      {/* TOP HEADER NAVIGATION */}
      <header style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          <ChevronLeftIcon />
        </button>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}><ShoppingBagIcon /></span>
          <span style={styles.logoText}>EthioShopify</span>
        </div>
        <div style={styles.userMenu}>
          <div style={styles.avatar}>S</div>
          <span style={styles.roleText}>Seller</span>
          <span style={styles.dropdownArrow}><ChevronDownIcon color="#888" /></span>
        </div>
      </header>

      {/* HERO TITLE BLOCK */}
      <section style={styles.heroSection}>
        <h1 style={styles.heroTitle}>Let's set up your shop</h1>
        <p style={styles.heroSubtitle}>
          Fill in your shop details below. You can change these later if needed.
        </p>
      </section>

      {/* FORM BODY */}
      <form onSubmit={handleNextSubmit} style={styles.formContainer}>
        <h3 style={styles.sectionHeader}>Shop Details</h3>

        {/* SHOP NAME */}
        <FormField label="Shop Name" subLabel="Choose a name that represents your brand.">
          <input 
            type="text" 
            name="shopName"
            value={formData.shopName}
            onChange={handleInputChange}
            placeholder="Enter your shop name"
            style={styles.inputField}
            required
          />
        </FormField>

        {/* SHOP CATEGORY */}
        <FormField label="Shop Category">
          <div style={styles.selectWrapper}>
            <select 
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={styles.selectField}
              required
            >
              <option value="" disabled>Select a category</option>
              <option value="electronics">Electronics & Gadgets</option>
              <option value="clothing">Clothing & Apparel</option>
              <option value="cosmetics">Cosmetics & Beauty</option>
              <option value="food">Food & Groceries</option>
            </select>
            <span style={styles.selectArrow}><ChevronDownIcon /></span>
          </div>
        </FormField>

        {/* SHOP DESCRIPTION */}
        <FormField label="Shop Description">
          <div style={styles.textareaContainer}>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell customers about your shop and what makes it special..."
              style={styles.textareaField}
              rows={4}
            />
            <span style={styles.charCounter}>{descriptionCount}/500</span>
          </div>
          <span style={styles.textareaSubtext}>This will be displayed on your shop profile.</span>
        </FormField>

        {/* DUAL COLUMN EMAIL & PHONE */}
        <div style={styles.rowGrid}>
          <FormField label="Shop Email">
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              style={styles.inputField}
              required
            />
          </FormField>

          <FormField label="Shop Phone Number">
            <div style={styles.phoneInputGroup}>
              <select 
                name="phoneCode" 
                value={formData.phoneCode} 
                onChange={handleInputChange}
                style={styles.phoneCodeSelect}
              >
                <option value="+251">🇪🇹 +251</option>
                <option value="+1">🇺🇸 +1</option>
              </select>
              <input 
                type="tel" 
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="9XX XXX XXX"
                style={styles.phoneInputField}
                required
              />
            </div>
          </FormField>
        </div>

        {/* SHOP ADDRESS */}
        <FormField label="Shop Address">
          <input 
            type="text" 
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your shop address"
            style={styles.inputField}
            required
          />
        </FormField>

        {/* TRIPLE LOCATION GRID DROPDOWNS */}
        <div style={styles.tripleGrid}>
          <FormField label="Country">
            <div style={styles.selectWrapper}>
              <select name="country" value={formData.country} onChange={handleInputChange} style={styles.selectField} required>
                <option value="" disabled>Select country</option>
                <option value="ethiopia">Ethiopia</option>
              </select>
              <span style={styles.selectArrow}><ChevronDownIcon /></span>
            </div>
          </FormField>

          <FormField label="Region">
            <div style={styles.selectWrapper}>
              <select name="region" value={formData.region} onChange={handleInputChange} style={styles.selectField} required>
                <option value="" disabled>Select region</option>
                <option value="addis_ababa">Addis Ababa</option>
                <option value="oromia">Oromia</option>
                <option value="amhara">Amhara</option>
              </select>
              <span style={styles.selectArrow}><ChevronDownIcon /></span>
            </div>
          </FormField>

          <FormField label="City">
            <div style={styles.selectWrapper}>
              <select name="city" value={formData.city} onChange={handleInputChange} style={styles.selectField} required>
                <option value="" disabled>Select city</option>
                <option value="addis">Addis Ababa</option>
                <option value="adama">Adama</option>
                <option value="gondar">Gondar</option>
              </select>
              <span style={styles.selectArrow}><ChevronDownIcon /></span>
            </div>
          </FormField>
        </div>

        {/* LOGO UPLOAD AREA */}
        <FormField label="Shop Logo (Optional)">
          <div style={styles.uploadZone}>
            <div style={styles.uploadLeft}>
              <div style={styles.uploadIconCircle}>
                <CloudUploadIcon />
              </div>
              <div style={styles.uploadTexts}>
                <span style={styles.uploadTitle}>Upload your shop logo</span>
                <span style={styles.uploadSubtitle}>JPG, PNG or SVG. Max size 2MB.</span>
              </div>
            </div>
            <label style={styles.uploadButtonLabel}>
              <UploadIcon /> Choose File
              <input 
                type="file" 
                accept=".jpg,.jpeg,.png,.svg" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
              />
            </label>
          </div>
        </FormField>

        {/* STICKY BOTTOM NEXT CTA */}
        <button type="submit" style={styles.nextButton}>
          Next <ChevronRightIcon />
        </button>
      </form>
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
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  backButton: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: '0 12px 0 0',
    display: 'flex',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
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
    marginBottom: '24px',
  },
  heroTitle: { fontSize: '24px', fontWeight: '800', color: '#0e1e25', margin: '0 0 8px 0', textAlign: 'left' },
  heroSubtitle: { fontSize: '13px', color: '#66767e', margin: 0, lineHeight: '1.4', textAlign: 'left' },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  sectionHeader: { fontSize: '16px', fontWeight: '700', color: '#0e1e25', margin: '0 0 4px 0', textAlign: 'left' },
  inputField: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#fdfdfd',
  },
  selectWrapper: {
    position: 'relative',
    width: '100%',
  },
  selectField: {
    width: '100%',
    padding: '12px 30px 12px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    backgroundColor: '#fdfdfd',
    appearance: 'none',
    outline: 'none',
    boxSizing: 'border-box',
  },
  selectArrow: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: '#a0aec0',
    fontSize: '12px',
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
    backgroundColor: '#fdfdfd',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'none',
    fontFamily: 'inherit',
  },
  charCounter: {
    position: 'absolute',
    right: '10px',
    bottom: '10px',
    fontSize: '11px',
    color: '#a0aec0',
  },
  textareaSubtext: {
    fontSize: '11px',
    color: '#66767e',
    marginTop: '-12px',
  },
  rowGrid: {
    display: 'flex',
    gap: '12px',
  },
  phoneInputGroup: {
    display: 'flex',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fdfdfd',
  },
  phoneCodeSelect: {
    padding: '0 8px',
    border: 'none',
    borderRight: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    fontSize: '13px',
    outline: 'none',
  },
  phoneInputField: {
    flex: 1,
    padding: '12px',
    border: 'none',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
  },
  tripleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
  },
  uploadZone: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px dashed #ccd4d8',
    padding: '12px',
    borderRadius: '10px',
    backgroundColor: '#fdfdfd',
  },
  uploadLeft: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  uploadIconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#edf9f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  uploadTexts: {
    display: 'flex',
    flexDirection: 'column',
  },
  uploadTitle: { fontSize: '13px', fontWeight: '600', color: '#0e1e25' },
  uploadSubtitle: { fontSize: '11px', color: '#a0aec0' },
  uploadButtonLabel: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#00a84e',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  nextButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#00a84e',
    color: '#ffffff',
    border: 'none',
    padding: '14px 16px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '12px',
    width: '100%',
    boxSizing: 'border-box',
  },
};
