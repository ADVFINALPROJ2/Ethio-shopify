import React from 'react';

export const OrderListRow = ({ orderId, customerName, date, time, status, amount, onClick }) => {
  const isPending = status.toLowerCase() === 'pending';
  const statusStyles = {
    color: isPending ? '#d97706' : '#00a84e',
    backgroundColor: isPending ? '#fffbeb' : '#f2fbf5',
  };

  return (
    <div style={styles.row} onClick={onClick}>
      <div style={styles.bagIconWrapper}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#66767e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      </div>

      <div style={styles.metaColumn}>
        <span style={styles.orderId}>{orderId}</span>
        <span style={styles.customerName}>{customerName}</span>
        <span style={styles.timestamp}>{date}  •  {time}</span>
      </div>

      <div style={styles.rightColumn}>
        <span style={{ ...styles.statusBadge, ...statusStyles }}>{status}</span>
        <span style={styles.amountText}>{amount}</span>
      </div>

      <div style={styles.chevronWrapper}>
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
    cursor: 'pointer',
    gap: '12px',
  },
  bagIconWrapper: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  metaColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
    textAlign: 'left',
  },
  orderId: {
    fontSize: '14px',
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
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  },
  statusBadge: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
    textTransform: 'capitalize',
  },
  amountText: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0e1e25',
  },
  chevronWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '2px',
  },
};
