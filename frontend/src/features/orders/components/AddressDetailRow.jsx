import React from 'react';

export const AddressDetailRow = ({ icon: Icon, label, value }) => {
  return (
    <div style={styles.row}>
      <div style={styles.leftLabelGroup}>
        <div style={styles.iconWrapper}>
          <Icon />
        </div>
        <span style={styles.labelText}>{label}</span>
      </div>
      <span style={styles.valueText}>{value}</span>
    </div>
  );
};

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f1f5f9',
    gap: '16px',
  },
  leftLabelGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#a0aec0',
    width: '16px',
  },
  labelText: {
    fontSize: '13px',
    color: '#66767e',
    fontWeight: '500',
  },
  valueText: {
    fontSize: '13px',
    color: '#0e1e25',
    fontWeight: '600',
    textAlign: 'right',
  },
};
