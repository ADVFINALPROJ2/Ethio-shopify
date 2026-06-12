import { useState, useEffect } from 'react';

export const ProductForm = ({ users, onProductCreated, editingProduct, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [userId, setUserId] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setTitle(editingProduct.name || '');
      setDescription(editingProduct.description || '');
      setPrice(editingProduct.price || '');
      setStock(editingProduct.quantity || '');
      setUserId(editingProduct.user_id || '');
      setImages([]);
    }
  }, [editingProduct]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setStock('');
    setUserId('');
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price) {
      return alert('Please fill in Title and Price');
    }

    if (!editingProduct && !userId) {
      return alert('Please select a seller');
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('product[name]', title);
      formData.append('product[description]', description || '');
      formData.append('product[price]', parseFloat(price));
      formData.append('product[quantity]', stock ? parseInt(stock, 10) : 0);

      if (!editingProduct) {
        formData.append('product[user_id]', parseInt(userId, 10));
      }

      for (let i = 0; i < images.length; i++) {
        formData.append('product[images][]', images[i]);
      }

      await onProductCreated(formData, editingProduct);

      resetForm();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Error saving product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3 style={{ marginTop: 0 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Stock:</label>
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          disabled={isSubmitting}
          style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
          placeholder="e.g. 10"
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Image:</label>
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

      {!editingProduct && (
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
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '8px 16px',
            backgroundColor: editingProduct ? '#ffc107' : '#28a745',
            color: editingProduct ? '#000' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
        </button>
        {editingProduct && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSubmitting}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
