import React, { useState } from 'react';
import { AvatarUploadField } from '../components/AvatarUploadField';

export const EditProfilePage = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || 'Selam Tesfaye',
    emailAddress: initialData?.emailAddress || 'selam.tesfaye@example.com',
    phoneNumber: initialData?.phoneNumber || '+251 912 345 678',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(formData);
  };

  return (
    <div style={styles.container}>
      {/* GLOBAL APPLICATION TOP BAR */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>🛍️</span>
          <span style={styles.logoText}>EthioShopify</span>
        </div>
        <div style={styles.userMenu}>
          <div style={styles.avatarThumb}>S</div>
          <span style={styles.roleText}>Seller</span>
          <span style={styles.dropdownArrow}>▾</span>
        </div>
      </header>

      {/* VIEW HEADLINE INTRO */}
      <div style={styles.titleContainer}>
        <h1 style={styles.viewTitle}>Edit Profile</h1>
        <p style={styles.viewSubtitle}>Update your personal information.</p>
      </div>

      {/* CORE INPUT CONFIGURATION FORM */}
      <form onSubmit={handleSubmit} style={styles.formContainer}>
        <h3 style={styles.fieldGroupTitle}>Profile Picture</h3>
        
        {/* DYNAMIC AVATAR CHIP TRIGGER */}
        <AvatarUploadField 
          fallbackLetter={formData.fullName.charAt(0).toUpperCase()} 
          hintText="JPG, PNG or GIF. Max size 2MB."
          onUploadClick={() => console.log('Trigger media browser asset allocation')}
        />

        {/* INPUT INPUT CONTROLS GROUPING */}
        <div style={styles.inputStack}>
          <div style={styles.inputControl}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={styles.textInput}
              required
            />
          </div>

          <div style={styles.inputControl}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              style={styles.textInput}
              required
            />
          </div>

          <div style={styles.inputControl}>
            <label style={styles.label}>Phone Number</label>
            <input 
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              style={styles.textInput}
              required
            />
          </div>
        </div>

        {/* PRIMARY CALL TO ACTION OPERATIONS BAR */}
        <div style={styles.actionButtonGroup}>
          <button type="submit" style={styles.primarySaveBtn}>
            Save Changes
          </button>
          <button type="button" onClick={onCancel} style={styles.secondaryCancelBtn}>
            Cancel
          </button>
        </div>
      </form>

      {/* STICKY DISPATCH BOTTOM NAVBAR CONTAINER */}
      <nav style={styles.bottomNav}>
        <div style={{ ...styles.navItem, color: '#66767e' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        <div style={{ ...styles.navItem, color: '#00a84e' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
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
    padding: '16px 16px 110px 16px',
    boxSizing: 'border-box',
    maxWidth: '480px',
    margin: '0 auto',
  },
  header: { display: 'flex', alignItems: 'center', marginBottom: '20px' },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '4px' },
  logoIcon: { fontSize: '18px' },
  logoText: { fontWeight: '700', fontSize: '16px', color: '#00a84e' },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#ffffff',
    padding: '4px 8px',
    borderRadius: '20px',
    border: '1px solid #eaeaea',
    marginLeft: 'auto',
  },
  avatarThumb: {
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
  titleContainer: {
    marginBottom: '24px',
  },
  viewTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0e1e25',
    margin: '0 0 4px 0',
  },
  viewSubtitle: {
    fontSize: '13px',
    color: '#66767e',
    margin: 0,
    lineHeight: '1.4',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  fieldGroupTitle: {
    margin: 0,
    fontSize: '13px',
    fontWeight: '700',
    color: '#0e1e25',
  },
  inputStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '40px',
  },
  inputControl: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#66767e',
    textAlign: 'left',
  },
  textInput: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    color: '#0e1e25',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  actionButtonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  primarySaveBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#00a84e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'center',
  },
  secondaryCancelBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#ffffff',
    color: '#00a84e',
    border: '1px solid #00a84e',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
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
    cursor: 'pointer',
  }
};
