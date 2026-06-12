import React from 'react';

export const StatCard = ({ iconBg, iconColor, icon: Icon, title, value }) => {
  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <div style={{ ...styles.iconCircle, backgroundColor: iconBg, color: iconColor }}>
          <Icon />
        </div>
        <div style={styles.textBlock}>
          <span style={styles.title}>{title}</span>
          <span style={styles.value}>{value}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f4f8',
    borderRadius: '10px',
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
    gap: '6px',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  iconCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    fontSize: '10px',
    color: '#66767e',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  value: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0e1e25',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  textBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
    textAlign: 'left',
  }
};
