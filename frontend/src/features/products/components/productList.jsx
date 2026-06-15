export const ProductList = ({ products, isLoading, onDelete, onPurchase, onEdit, onArchive, onAddToCart }) => {
  if (isLoading) return <p>Loading products from backend...</p>;
  if (products.length === 0) return <p>No products found.</p>;

  return (
    <div>
      <h3>Available Products</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map((product) => (
          <li key={product.id} style={{
            marginBottom: '12px',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{product.name}</strong>
                {product.user && (
                  <span style={{ fontSize: '0.85em', color: '#666' }}>
                    {' '}by {product.user.fullname || product.user.username}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onPurchase(product.id)}
                  disabled={product.quantity < 1}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: product.quantity < 1 ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: product.quantity < 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.85em'
                  }}
                >
                  {product.quantity < 1 ? 'Out of Stock' : 'Buy Now'}
                </button>
                <button
                  onClick={() => onAddToCart(product.id)}
                  disabled={product.quantity < 1}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: product.quantity < 1 ? '#6c757d' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: product.quantity < 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.85em'
                  }}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => onEdit(product)}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#ffc107',
                    color: '#000',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85em'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onArchive(product)}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: product.status === 'archived' ? '#28a745' : '#6f42c1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85em'
                  }}
                >
                  {product.status === 'archived' ? 'Activate' : 'Archive'}
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85em'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            {product.description && (
              <p style={{ margin: '6px 0', fontSize: '0.9em', color: '#555' }}>
                {product.description}
              </p>
            )}
            {product.image_urls && product.image_urls.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', margin: '8px 0', flexWrap: 'wrap' }}>
                {product.image_urls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`${product.name} ${idx + 1}`}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }}
                  />
                ))}
              </div>
            )}
            <div style={{ fontSize: '0.9em', color: '#333' }}>
              Price: <strong>ETB {parseFloat(product.price).toFixed(2)}</strong>
              {' | '}Qty: <strong>{product.quantity}</strong>
              {' | '}Status: <span style={{
                color: product.status === 'active' ? '#28a745' : '#dc3545'
              }}>{product.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
