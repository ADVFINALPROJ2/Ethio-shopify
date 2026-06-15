import { useState, useEffect } from 'react';
import { getUsers } from '../../users/api/getUsers';
import { getProducts } from '../api/getProducts';
import { createProduct } from '../api/createProduct';
import { updateProduct } from '../api/updateProduct';
import { deleteProduct } from '../api/deleteProduct';
import { purchaseProduct } from '../api/purchaseProduct';
import { ProductForm } from '../components/productForm';
import { ProductList } from '../components/productList';

export const ProductsPage = ({ onAddToCart }) => {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);

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

    const handleProductCreated = async (formData, productToEdit) => {
        if (productToEdit) {
            const updatedProduct = await updateProduct(productToEdit.id, formData);
            setProducts((prev) =>
                prev.map((p) => (p.id === productToEdit.id ? updatedProduct : p))
            );
            setEditingProduct(null);
        } else {
            const createdProduct = await createProduct(formData);
            setProducts((prev) => [...prev, createdProduct]);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
            if (editingProduct && editingProduct.id === id) {
                setEditingProduct(null);
            }
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

    const handleArchive = async (product) => {
        const newStatus = product.status === 'archived' ? 'active' : 'archived';
        if (!window.confirm(`Are you sure you want to ${newStatus === 'archived' ? 'archive' : 'activate'} this product?`)) return;
        try {
            const updatedProduct = await updateProduct(product.id, { status: newStatus });
            setProducts((prev) =>
                prev.map((p) => (p.id === product.id ? updatedProduct : p))
            );
        } catch (error) {
            console.error('Failed to update product status:', error);
            alert('Error updating product status.');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
            <h2>Ethio-Shopify Products</h2>
            <ProductForm
                users={users}
                onProductCreated={handleProductCreated}
                editingProduct={editingProduct}
                onCancelEdit={handleCancelEdit}
            />
            <hr />
            <ProductList
                products={products}
                isLoading={isLoading}
                onDelete={handleDelete}
                onPurchase={handlePurchase}
                onEdit={handleEdit}
                onArchive={handleArchive}
                onAddToCart={onAddToCart}
            />
        </div>
    );
};
