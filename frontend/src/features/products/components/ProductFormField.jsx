import React from 'react';

export const ProductFormField = ({ label, subLabel, children, trailingText }) => {
  return (
    <div style={styles.container}>
      <label style={styles.label}>
        {label} {trailingText && <span style={styles.trailing}>{trailingText}</span>}
      </label>
      <div style={styles.fieldWrapper}>
        {children}
      </div>
      {subLabel && <span style={styles.subLabel}>{subLabel}</span>}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
    boxSizing: 'border-box',
  },
  label: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0e1e25',
    textAlign: 'left',
  },
  trailing: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#66767e',
  },
  fieldWrapper: {
    width: '100%',
  },
  subLabel: {
    fontSize: '11px',
    color: '#66767e',
    marginTop: '2px',
    lineHeight: '1.4',
    textAlign: 'left',
  },
};
