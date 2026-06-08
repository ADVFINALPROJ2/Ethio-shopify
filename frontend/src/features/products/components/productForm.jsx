import { useState } from 'react';

export const ProductForm = ({ users, onProductCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [userId, setUserId] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !userId) {
      return alert('Please fill in Product Name, Price, and select a seller');
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('product[name]', name);
      formData.append('product[description]', description || '');
      formData.append('product[price]', parseFloat(price));
      formData.append('product[quantity]', quantity ? parseInt(quantity, 10) : 0);
      formData.append('product[user_id]', parseInt(userId, 10));

      for (let i = 0; i < images.length; i++) {
        formData.append('product[images][]', images[i]);
      }

      await onProductCreated(formData);

      setName('');
      setDescription('');
      setPrice('');
      setQuantity('');
      setUserId('');
      setImages([]);
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Error creating product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3 style={{ marginTop: 0 }}>Add New Product</h3>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Product Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
          placeholder="e.g. Handwoven Scarf"
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '6px', boxSizing: 'border-box', minHeight: '60px' }}
          placeholder="Describe your product..."
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Price (ETB):</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
          placeholder="e.g. 299.99"
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Quantity:</label>
        <input
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
          placeholder="e.g. 10"
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Product Images:</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages([...e.target.files])}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
        />
        {images.length > 0 && (
          <p style={{ fontSize: '0.85em', color: '#666', margin: '4px 0 0' }}>
            {images.length} file(s) selected
          </p>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Seller:</label>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
        >
          <option value="">Select a seller</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.fullname} (@{user.username})
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: '8px 16px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubmitting ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
};
