import { useState, useEffect } from 'react';
import { getCart } from '../api/getCart';
import { updateCartItem } from '../api/updateCartItem';
import { removeCartItem } from '../api/removeCartItem';
import { createCheckout } from '../api/checkout';

export const CartPage = ({ userId, onCartUpdated }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('cart');
    const [submitting, setSubmitting] = useState(false);
    const [order, setOrder] = useState(null);
    const [checkoutError, setCheckoutError] = useState(null);
    const [form, setForm] = useState({ phone: '', address: '', notes: '' });
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        let cancelled = false;
        if (!userId) {
            setLoading(false);
            setCart(null);
            setLoadError('');
            return;
        }
        setLoading(true);
        setLoadError('');
        setView('cart');
        setOrder(null);
        setCheckoutError(null);
        getCart(userId)
            .then((data) => {
                if (cancelled) return;
                setCart(data);
            })
            .catch((error) => {
                if (cancelled) return;
                setCart(null);
                setLoadError(error.response?.data?.errors?.[0] || 'Failed to load cart.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [userId]);

    const handleQuantityChange = async (itemId, newQty) => {
        if (newQty < 1) return;
        try {
            const data = await updateCartItem(itemId, userId, newQty);
            setCart(data);
            onCartUpdated();
        } catch (error) {
            const msg = error.response?.data?.errors?.[0] || 'Failed to update quantity.';
            alert(msg);
        }
    };

    const handleRemove = async (itemId) => {
        if (!window.confirm('Remove this item from your cart?')) return;
        try {
            const data = await removeCartItem(itemId, userId);
            setCart(data);
            onCartUpdated();
        } catch (error) {
            alert('Failed to remove item.');
        }
    };

    const handleProceedToCheckout = () => {
        setView('checkout');
        setCheckoutError(null);
    };

    const handleFormChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setCheckoutError(null);
        try {
            const data = await createCheckout(userId, form);
            setOrder(data);
            setView('confirmation');
            onCartUpdated();
        } catch (error) {
            const msg = error.response?.data?.errors?.[0] || 'Checkout failed. Please try again.';
            setCheckoutError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleBackToCart = () => {
        setView('cart');
        setOrder(null);
        setCheckoutError(null);
        getCart(userId)
            .then((data) => setCart(data))
            .catch(console.error);
    };

    if (!userId) {
        return (
            <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
                <h2>Your Cart</h2>
                <p>Please select a user from the dropdown in the navigation bar.</p>
            </div>
        );
    }

    if (loading) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading cart...</p>;

    if (loadError) {
        return (
            <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
                <h2>Your Cart</h2>
                <p>{loadError}</p>
            </div>
        );
    }

    if (!cart || !cart.cart || cart.cart.cart_items.length === 0) {
        return (
            <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
                <h2>Your Cart</h2>
                <p>Your cart is empty. Browse products and add items!</p>
            </div>
        );
    }

    if (view === 'confirmation' && order) {
        return (
            <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
                <div style={{
                    background: '#d4edda',
                    border: '1px solid #c3e6cb',
                    borderRadius: '8px',
                    padding: '32px 24px',
                    marginBottom: '24px'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>&#10003;</div>
                    <h2 style={{ color: '#155724', margin: '0 0 8px' }}>Order Placed!</h2>
                    <p style={{ color: '#155724', fontSize: '1.1em', margin: 0 }}>
                        Thank you for your purchase.
                    </p>
                </div>
                <div style={{
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '24px',
                    marginBottom: '24px'
                }}>
                    <p style={{ margin: '0 0 4px', color: '#666', fontSize: '0.85em' }}>Order Number</p>
                    <h3 style={{ margin: '0 0 16px', color: '#143d35', fontSize: '1.5em' }}>
                        #{order.id}
                    </h3>
                    <div style={{ textAlign: 'left', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                        <p style={{ margin: '4px 0', color: '#333' }}>
                            <strong>Phone:</strong> {order.phone || 'Not provided'}
                        </p>
                        <p style={{ margin: '4px 0', color: '#333' }}>
                            <strong>Address:</strong> {order.address || 'Not provided'}
                        </p>
                        <p style={{ margin: '4px 0', color: '#333' }}>
                            <strong>Notes:</strong> {order.notes || 'None'}
                        </p>
                    </div>
                    <div style={{ textAlign: 'left', borderTop: '1px solid #eee', paddingTop: '16px', marginTop: '16px' }}>
                        <h4 style={{ margin: '0 0 8px', color: '#333' }}>Items</h4>
                        {order.items.map((item, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '6px 0',
                                borderBottom: '1px solid #f0f0f0',
                                fontSize: '0.9em'
                            }}>
                                <span>{item.product_name} x{item.quantity}</span>
                                <span>ETB {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '10px 0 0',
                            fontWeight: 'bold',
                            fontSize: '1.1em',
                            borderTop: '2px solid #333',
                            marginTop: '8px'
                        }}>
                            <span>Total</span>
                            <span>ETB {parseFloat(order.total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleBackToCart}
                    style={{
                        padding: '10px 24px',
                        background: '#143d35',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1em'
                    }}
                >
                    Back to Cart
                </button>
            </div>
        );
    }

    if (view === 'checkout') {
        return (
            <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
                <h2>Checkout</h2>
                <div style={{
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '20px'
                }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '1em', color: '#555' }}>Order Summary</h3>
                    {cart.cart.cart_items.map((item) => (
                        <div key={item.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '6px 0',
                            borderBottom: '1px solid #f0f0f0',
                            fontSize: '0.9em'
                        }}>
                            <span>{item.product.name} x{item.quantity}</span>
                            <span>ETB {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '10px 0 0',
                        fontWeight: 'bold',
                        borderTop: '2px solid #333',
                        marginTop: '8px'
                    }}>
                        <span>Subtotal</span>
                        <span>ETB {parseFloat(cart.subtotal).toFixed(2)}</span>
                    </div>
                </div>
                <form onSubmit={handlePlaceOrder} style={{
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '24px'
                }}>
                    {checkoutError && (
                        <div style={{
                            background: '#f8d7da',
                            color: '#721c24',
                            border: '1px solid #f5c6cb',
                            borderRadius: '4px',
                            padding: '10px 14px',
                            marginBottom: '16px',
                            fontSize: '0.9em'
                        }}>
                            {checkoutError}
                        </div>
                    )}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9em', color: '#333' }}>
                            Phone <span style={{ color: '#999' }}>(optional)</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleFormChange}
                            placeholder="+251 9XX XXX XXX"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '1em',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9em', color: '#333' }}>
                            Delivery Address <span style={{ color: '#999' }}>(optional)</span>
                        </label>
                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleFormChange}
                            placeholder="Street, city, landmark..."
                            rows="3"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '1em',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '0.9em', color: '#333' }}>
                            Order Notes <span style={{ color: '#999' }}>(optional)</span>
                        </label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleFormChange}
                            placeholder="Any special instructions..."
                            rows="2"
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '1em',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={handleBackToCart}
                            style={{
                                padding: '10px 20px',
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.95em',
                                flex: 1
                            }}
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                padding: '10px 20px',
                                background: submitting ? '#6c9a8b' : '#143d35',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1em',
                                flex: 2
                            }}
                        >
                            {submitting ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
            <h2>Your Cart</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {cart.cart.cart_items.map((item) => (
                    <li key={item.id} style={{
                        marginBottom: '12px',
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <strong>{item.product.name}</strong>
                            <br />
                            <span style={{ fontSize: '0.85em', color: '#666' }}>
                                ETB {parseFloat(item.product.price).toFixed(2)} each
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                style={{
                                    padding: '4px 8px',
                                    background: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                -
                            </button>
                            <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                style={{
                                    padding: '4px 8px',
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                +
                            </button>
                            <button
                                onClick={() => handleRemove(item.id)}
                                style={{
                                    padding: '4px 10px',
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginLeft: '8px'
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div style={{
                marginTop: '20px',
                padding: '15px',
                borderTop: '2px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h3 style={{ margin: 0 }}>Subtotal: ETB {parseFloat(cart.subtotal).toFixed(2)}</h3>
                <button
                    onClick={handleProceedToCheckout}
                    style={{
                        padding: '10px 24px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1em'
                    }}
                >
                    Checkout
                </button>
            </div>
        </div>
    );
};
