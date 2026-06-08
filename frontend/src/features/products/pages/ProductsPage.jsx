import { useState, useEffect } from 'react';
import { getUsers } from '../../users/api/getUsers';
import { getProducts } from '../api/getProducts';
import { createProduct } from '../api/createProduct';
import { deleteProduct } from '../api/deleteProduct';
import { purchaseProduct } from '../api/purchaseProduct';
import { ProductForm } from '../components/productForm';
import { ProductList } from '../components/productList';

export const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [productsData, usersData] = await Promise.all([
                    getProducts(),
                    getUsers()
                ]);
                setProducts(productsData);
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleProductCreated = async (newProductData) => {
        const createdProduct = await createProduct(newProductData);
        setProducts((prev) => [...prev, createdProduct]);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Error deleting product.');
        }
    };

    const handlePurchase = async (id) => {
        try {
            const updatedProduct = await purchaseProduct(id, 1);
            setProducts((prev) =>
                prev.map((p) => (p.id === id ? updatedProduct : p))
            );
            alert('Purchase successful! Stock updated.');
        } catch (error) {
            const msg = error.response?.data?.errors?.[0] || 'Purchase failed.';
            alert(msg);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
            <h2>Ethio-Shopify Products</h2>
            <ProductForm users={users} onProductCreated={handleProductCreated} />
            <hr />
            <ProductList
                products={products}
                isLoading={isLoading}
                onDelete={handleDelete}
                onPurchase={handlePurchase}
            />
        </div>
    );
};
