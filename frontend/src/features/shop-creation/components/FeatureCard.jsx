import React from 'react';

export const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div style={styles.card}>
      <div style={styles.iconContainer}>
        <Icon style={styles.icon} />
      </div>
      <div style={styles.content}>
        <h4 style={styles.title}>{title}</h4>
        <p style={styles.description}>{description}</p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    gap: '12px',
    backgroundColor: '#ffffff',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
    alignItems: 'flex-start',
  },
  iconContainer: {
    backgroundColor: '#f2fbf5',
    padding: '10px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    width: '20px',
    height: '20px',
    color: '#00a84e',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: '#0e1e25',
  },
  description: {
    margin: 0,
    fontSize: '12px',
    color: '#66767e',
    lineHeight: '1.4',
  },
};
