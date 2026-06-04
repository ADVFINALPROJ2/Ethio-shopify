import { useState } from 'react';

export const UserForm = ({ onUserCreated }) => {
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple verification check before making the API call
    if (!username || !fullname || !phoneNumber) {
      return alert('Please fill in all fields (Username, Full Name, and Phone Number)');
    }

    setIsSubmitting(true);
    try {
      // Maps javascript snakeCase state variables to match your exact Rails database columns
      await onUserCreated({
        username: username,
        fullname: fullname,
        phone_number: phoneNumber
      });

      // Reset form fields after successful backend creation
      setUsername('');
      setFullname('');
      setPhoneNumber('');
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Error creating user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3 style={{ marginTop: 0 }}>Create New User Account</h3>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
          placeholder="e.g. abekesht"
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Full Name:</label>
        <input
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
          placeholder="e.g. Abebe Bekele"
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Phone Number:</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
          placeholder="e.g. +251..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubmitting ? 'Creating...' : 'Add User'}
      </button>
    </form>
  );
};
