import { useState, useEffect } from 'react';
import { getUsers } from '../api/getUsers';
import { createUser } from '../api/createUser';
import { UserForm } from '../components/userForm';
import { UserList } from '../components/userList';

export const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Fetch users on initial page mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // 2. Action triggered when the child Form successfully pushes a new user to Rails
    const handleUserCreated = async (newUserData) => {
        const createdUser = await createUser(newUserData);
        // Optimistically or explicitly append the freshly saved DB record to UI state
        setUsers((prevUsers) => [...prevUsers, createdUser]);
    };

    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'sans-serif' }}>
            <h2>Ethio-Shopify User Management</h2>
            <UserForm onUserCreated={handleUserCreated} />
            <hr />
            <UserList users={users} isLoading={isLoading} />
        </div>
    );
};
