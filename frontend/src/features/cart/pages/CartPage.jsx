import React, { useState, useEffect, useRef, useCallback } from 'react';
import getCart from '../api/getCart';
import updateCartItem from '../api/updateCartItem';
import removeCartItem from '../api/removeCartItem';
import checkoutCart from '../api/checkoutCart';

const CartPage = ({ userId, onBack, onCartChanged, onViewOrders }) => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState('cart');
  const [form, setForm] = useState({ phone: '', address: '', notes: '' });
  const [orderResult, setOrderResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const onCartChangedRef = useRef(onCartChanged);
  useEffect(() => {
    onCartChangedRef.current = onCartChanged;
  }, [onCartChanged]);

  const applyCartData = useCallback((data) => {
    setCartData(data);
    onCartChangedRef.current?.(data?.item_count || 0);
  }, []);

  const getSummary = (items = []) => ({
    subtotal: items.reduce((sum, item) => {
      return sum + Number(item.product?.price || 0) * Number(item.quantity || 0);
    }, 0),
    item_count: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  });

  const updateCartItems = (updater) => {
    setCartData(prev => {
      if (!prev) return prev;
      const nextItems = updater(prev.cart?.cart_items || []);
      const summary = getSummary(nextItems);
      onCartChangedRef.current?.(summary.item_count);
      return {
        ...prev,
        cart: {
          ...prev.cart,
          cart_items: nextItems
        },
        subtotal: summary.subtotal,
        item_count: summary.item_count
      };
    });
  };

  const fetchCart = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await getCart();
      applyCartData(data);
    } catch (err) {
      console.error('error fetching cart', err);
      setError('Could not load your cart right now.');
    } finally {
      setLoading(false);
    }
  }, [applyCartData, userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQtyChange = async (itemId, newQty) => {
    if (newQty < 1 || isUpdating) return;
    setIsUpdating(true);

    const prevCartData = cartData;
    updateCartItems(items => items.map(item =>
      item.id === itemId ? { ...item, quantity: newQty } : item
    ));

    try {
      const data = await updateCartItem(userId, itemId, newQty);
      applyCartData(data);
    } catch (err) {
      applyCartData(prevCartData);
      alert(err.response?.data?.errors?.[0] || 'cant update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async (itemId) => {
    if (!window.confirm('Remove this item from cart?')) return;

    const prevCartData = cartData;
    updateCartItems(items => items.filter(item => item.id !== itemId));

    try {
      const data = await removeCartItem(userId, itemId);
      applyCartData(data);
    } catch (_err) {
      applyCartData(prevCartData);
      alert('failed to remove item');
    }
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      const data = await checkoutCart(userId, form);
      setOrderResult({ ...data.order, ...form });
      setStep('done');
      applyCartData(data.cart);
      setForm({ phone: '', address: '', notes: '' });
    } catch (err) {
      const msg = err.response?.data?.errors?.[0] || 'Checkout failed';
      alert(msg);
    } finally {
      setSubmitting(false);
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

  if (step === 'done' && orderResult) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={onBack} style={styles.backBtn}>&larr; Back</button>
          <h2 style={{ margin: 0, fontSize: '18px' }}>Order Confirmed</h2>
          <div style={{ width: '60px' }}></div>
        </div>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#d4edda',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ color: '#0e1e25', margin: '0 0 8px', fontSize: '22px' }}>Order Placed!</h2>
          <p style={{ color: '#66767e', margin: '0 0 24px', fontSize: '15px' }}>
            Your order number is <strong style={{ color: '#00a84e' }}>{orderResult.order_number}</strong>
          </p>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            border: '1px solid #f0f4f8',
            padding: '16px',
            textAlign: 'left',
            marginBottom: '20px'
          }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#66767e' }}>ORDER DETAILS</p>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#0e1e25' }}>
              Phone: {orderResult.phone || 'N/A'}
            </p>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#0e1e25' }}>
              Address: {orderResult.address || 'N/A'}
            </p>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#0e1e25' }}>
              Total: ETB {Number(orderResult.total).toLocaleString()}
            </p>
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            <button onClick={onViewOrders} style={styles.checkoutBtn}>
              View Orders
            </button>
            <button onClick={onBack} style={styles.secondaryBtn}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'checkout') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => setStep('cart')} style={styles.backBtn}>&larr; Back</button>
          <h2 style={{ margin: 0, fontSize: '18px' }}>Checkout</h2>
          <div style={{ width: '60px' }}></div>
        </div>
        <div style={{ padding: '16px' }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            border: '1px solid #f0f4f8',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: '#66767e' }}>Order Summary</h3>
            {cartData?.cart?.cart_items?.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: '1px solid #f0f4f8',
                fontSize: '14px'
              }}>
                <span style={{ color: '#0e1e25' }}>{item.product?.name} x{item.quantity}</span>
                <span style={{ color: '#0e1e25' }}>ETB {Number(item.product?.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0 0',
              fontWeight: '700',
              fontSize: '15px',
              borderTop: '2px solid #0e1e25',
              marginTop: '8px',
              color: '#0e1e25'
            }}>
              <span>Total</span>
              <span>ETB {Number(cartData?.subtotal || 0).toLocaleString()}</span>
            </div>
          </div>
          <form onSubmit={handleCheckout}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              border: '1px solid #f0f4f8',
              padding: '16px'
            }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '600', color: '#0e1e25' }}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  placeholder="+251 9XX XXX XXX"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '600', color: '#0e1e25' }}>Delivery Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleFormChange}
                  placeholder="Street, city, landmark..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '600', color: '#0e1e25' }}>Order Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  placeholder="Any special instructions..."
                  rows="2"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: submitting ? '#6c9a8b' : '#00a84e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
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
                    disabled={isUpdating}
                    style={styles.qtyBtn}
                  >-</button>
                  <span style={styles.qtyValue}>{item.quantity}</span>
                  <button
                    onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                    disabled={isUpdating}
                    style={{ ...styles.qtyBtn, backgroundColor: '#00a84e', color: '#fff' }}
                  >+</button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    aria-label="Remove item"
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
              onClick={() => setStep('checkout')}
              style={styles.checkoutBtn}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e2e8f0'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '8px'
  },
  itemList: {
    padding: '16px'
  },
  itemCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '12px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    margin: '0 0 4px 0',
    fontSize: '15px',
    fontWeight: '500',
    color: '#0f172a'
  },
  itemPrice: {
    margin: 0,
    fontSize: '14px',
    color: '#64748b'
  },
  qtyControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  qtyBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    padding: 0
  },
  qtyValue: {
    fontSize: '15px',
    fontWeight: '500',
    minWidth: '20px',
    textAlign: 'center'
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '8px'
  },
  footer: {
    position: 'sticky',
    bottom: 0,
    backgroundColor: '#fff',
    padding: '20px',
    borderTop: '1px solid #e2e8f0',
    boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  totalLabel: {
    fontSize: '16px',
    color: '#64748b'
  },
  totalValue: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#0f172a'
  },
  checkoutBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#00a84e',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  secondaryBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#fff',
    color: '#00a84e',
    border: '1px solid #00a84e',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default CartPage;
