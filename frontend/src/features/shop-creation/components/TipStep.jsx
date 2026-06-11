import React from 'react';

export const TipStep = ({ icon: Icon, text }) => {
  return (
    <div style={styles.container}>
      <div style={styles.imgWrapper}>
        <Icon style={styles.iconSvg} />
      </div>
      <p style={styles.text}>{text}</p>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '8px',
  },
  imgWrapper: {
    width: '40px',
    height: '40px',
    backgroundColor: '#f2fbf5',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSvg: {
    width: '20px',
    height: '20px',
    color: '#00a84e',
  },
  text: {
    margin: 0,
    fontSize: '11px',
    fontWeight: '500',
    color: '#4a555a',
    lineHeight: '1.3',
  },
};
