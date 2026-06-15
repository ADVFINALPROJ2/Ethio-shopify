import { useState, useEffect } from 'react';
import { getCart } from '../api/getCart';
import { updateCartItem } from '../api/updateCartItem';
import { removeCartItem } from '../api/removeCartItem';

export const CartPage = ({ userId, onCartUpdated }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            setCart(null);
            return;
        }
        setLoading(true);
        getCart(userId)
            .then((data) => {
                setCart(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
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

    const handleCheckout = () => {
        alert('Checkout feature coming soon!');
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

    if (!cart || !cart.cart || cart.cart.cart_items.length === 0) {
        return (
            <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
                <h2>Your Cart</h2>
                <p>Your cart is empty. Browse products and add items!</p>
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
                    onClick={handleCheckout}
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
