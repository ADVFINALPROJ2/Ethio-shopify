import React from 'react';

export const OrderHistoryRow = ({ orderId, customerName, date, time, status, amount, onClick }) => {
  const isPending = status.toLowerCase() === 'pending';
  const badgeStyles = {
    color: isPending ? '#d97706' : '#00a84e',
    backgroundColor: isPending ? '#fffbeb' : '#f2fbf5',
  };

  return (
    <div onClick={onClick} style={{ ...styles.row, cursor: onClick ? 'pointer' : 'default' }}>
      <div style={styles.iconContainer}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#66767e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      </div>
      
      <div style={styles.meta}>
        <span style={styles.orderId}>{orderId}</span>
        <span style={styles.customerName}>{customerName}</span>
        <span style={styles.timestamp}>{date} • {time}</span>
      </div>

      <div style={styles.rightBlock}>
        <span style={{ ...styles.statusBadge, ...badgeStyles }}>{status}</span>
        <span style={styles.amount}>{amount}</span>
      </div>

      <div style={styles.chevron}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </div>
  );
};

const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 0',
    borderBottom: '1px solid #f1f5f9',
    gap: '12px',
  },
  iconContainer: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
    textAlign: 'left',
  },
  orderId: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0e1e25',
    textAlign: 'left',
  },
  customerName: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#4a555a',
    textAlign: 'left',
  },
  timestamp: {
    fontSize: '11px',
    color: '#a0aec0',
  },
  rightBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
  },
  statusBadge: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
    textTransform: 'capitalize',
  },
  amount: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0e1e25',
  },
  chevron: {
    display: 'flex',
    alignItems: 'center',
  },
};
