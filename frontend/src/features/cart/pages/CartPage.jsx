import React, { useState, useEffect } from 'react';
import getCart from '../api/getCart';
import updateCartItem from '../api/updateCartItem';
import removeCartItem from '../api/removeCartItem';
import checkoutCart from '../api/checkoutCart';

const CartPage = ({ userId, onBack }) => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  const fetchCart = async () => {
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      const data = await getCart(userId);
      setCartData(data);
    } catch (err) {
      console.log('error fetching cart', err);
      setError('Could not load your cart right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const handleQtyChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      const data = await updateCartItem(userId, itemId, newQty);
      setCartData(data);
    } catch (err) {
      alert(err.response?.data?.errors?.[0] || 'cant update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    if (!window.confirm('Remove this item from cart?')) return;
    try {
      const data = await removeCartItem(userId, itemId);
      setCartData(data);
    } catch (err) {
      alert('failed to remove item');
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const data = await checkoutCart(userId);
      alert(`Order created! Order #${data.order.order_number}`);
      setCartData(null);
      if (onBack) onBack();
    } catch (err) {
      const msg = err.response?.data?.errors?.[0] || 'Checkout failed';
      alert(msg);
    } finally {
      setCheckingOut(false);
    }
  };

  if (!userId) {
    return (
      <div style={styles.container}>
        <p style={{ textAlign: 'center', padding: '40px', color: '#66767e' }}>Please sign in to view your cart</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={{ textAlign: 'center', padding: '40px', color: '#66767e' }}>loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={onBack} style={styles.backBtn}>&larr; Back</button>
          <h2 style={{ margin: 0, fontSize: '18px' }}>Cart</h2>
          <div style={{ width: '60px' }}></div>
        </div>
        <p style={{ textAlign: 'center', padding: '40px', color: '#66767e' }}>{error}</p>
      </div>
    );
  }

  const items = cartData?.cart?.cart_items || [];
  const subtotal = cartData?.subtotal || 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>&larr; Back</button>
        <h2 style={{ margin: 0, fontSize: '18px' }}>Your Cart</h2>
        <div style={{ width: '60px' }}></div>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#66767e', fontSize: '16px' }}>Your cart is empty</p>
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>add some products from the store</p>
          <button onClick={onBack} style={{
            marginTop: '20px',
            padding: '10px 24px',
            backgroundColor: '#00a84e',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer'
          }}>Browse Products</button>
        </div>
      ) : (
        <>
          <div style={styles.itemList}>
            {items.map((item) => (
              <div key={item.id} style={styles.itemCard}>
                <div style={styles.itemInfo}>
                  <p style={styles.itemName}>{item.product?.name || 'Product'}</p>
                  <p style={styles.itemPrice}>ETB {Number(item.product?.price || 0).toLocaleString()} each</p>
                </div>
                <div style={styles.qtyControl}>
                  <button
                    onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                    style={styles.qtyBtn}
                  >-</button>
                  <span style={styles.qtyValue}>{item.quantity}</span>
                  <button
                    onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                    style={{ ...styles.qtyBtn, backgroundColor: '#00a84e', color: '#fff' }}
                  >+</button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    style={styles.removeBtn}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.footer}>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Subtotal</span>
              <span style={styles.totalValue}>ETB {Number(subtotal).toLocaleString()}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              style={{
                ...styles.checkoutBtn,
                opacity: checkingOut ? 0.7 : 1
              }}
            >
              {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    maxWidth: '480px',
    margin: '0 auto',
    paddingBottom: '120px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #f0f4f8',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#00a84e',
    fontWeight: '600',
    padding: '4px 0',
    width: '60px',
    textAlign: 'left',
  },
  itemList: {
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '12px',
    border: '1px solid #f0f4f8',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    margin: '0 0 4px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0e1e25',
  },
  itemPrice: {
    margin: 0,
    fontSize: '12px',
    color: '#66767e',
  },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  qtyBtn: {
    width: '30px',
    height: '30px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#0e1e25',
  },
  qtyValue: {
    fontWeight: '700',
    fontSize: '14px',
    minWidth: '20px',
    textAlign: 'center',
  },
  removeBtn: {
    width: '30px',
    height: '30px',
    borderRadius: '6px',
    border: '1px solid #fce4e4',
    backgroundColor: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '4px',
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '480px',
    backgroundColor: '#fff',
    borderTop: '1px solid #e2e8f0',
    padding: '12px 16px',
    paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
    boxSizing: 'border-box',
    boxShadow: '0 -4px 12px rgba(0,0,0,0.06)',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  totalLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0e1e25',
  },
  totalValue: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#00a84e',
  },
  checkoutBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#00a84e',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};

export default CartPage;
