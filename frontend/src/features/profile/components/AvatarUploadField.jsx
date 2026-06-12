import React from 'react';

export const AvatarUploadField = ({ fallbackLetter, hintText, onUploadClick }) => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.avatarCircle}>
        <span style={styles.avatarText}>{fallbackLetter}</span>
        
        {/* Overlapping Camera Trigger Button */}
        <button 
          type="button" 
          onClick={onUploadClick} 
          style={styles.cameraBadge}
          aria-label="Upload profile picture"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
        </button>
      </div>
      
      {/* Constraints Description */}
      <span style={styles.hint}>{hintText}</span>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    margin: '16px 0 24px 0',
  },
  avatarCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#e2f7ec',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#00a84e',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#1e293b',
    border: '2px solid #ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: 0,
  },
  hint: {
    fontSize: '11px',
    color: '#66767e',
    fontWeight: '500',
  },
};
