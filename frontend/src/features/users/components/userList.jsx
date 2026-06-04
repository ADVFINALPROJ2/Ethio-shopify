export const UserList = ({ users, isLoading }) => {
  if (isLoading) return <p>Loading users from Rails backend...</p>;
  if (users.length === 0) return <p>No users found.</p>;

  return (
    <div>
      <h3>Registered Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id || user.username} style={{ marginBottom: '8px' }}>
            <strong>{user.fullname}</strong> (@{user.username}) — {user.phone_number}
          </li>
        ))}
      </ul>
    </div>
  );
};