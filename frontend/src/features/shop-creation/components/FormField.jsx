export const FormField = ({ label, subLabel, children, error }) => {
  return (
    <div style={styles.container}>
      <label style={styles.label}>{label}</label>
      <div style={styles.fieldWrapper}>
        {children}
      </div>
      {subLabel && <span style={styles.subLabel}>{subLabel}</span>}
      {error && <span style={styles.errorText}>{error}</span>}
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
    fontWeight: '600',
    color: '#0e1e25',
    textAlign: 'left',
    lineHeight: '1.4',
  },
  fieldWrapper: {
    width: '100%',
  },
  subLabel: {
    fontSize: '11px',
    color: '#66767e',
  },
  errorText: {
    fontSize: '11px',
    color: '#e53e3e',
  }
};
