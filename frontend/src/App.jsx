import { useState } from 'react';
import { UsersPage } from './features/users/pages/UsersPage';
import { ProductsPage } from './features/products/pages/ProductsPage';

const NAV_ITEMS = [
  { key: 'users', label: 'Users' },
  { key: 'products', label: 'Products' }
];

function App() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <nav style={{
        background: '#343a40',
        padding: '12px 20px',
        display: 'flex',
        gap: '16px',
        justifyContent: 'center'
      }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            style={{
              padding: '8px 20px',
              background: activeTab === item.key ? '#007bff' : 'transparent',
              color: 'white',
              border: '1px solid #fff',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: activeTab === item.key ? 'bold' : 'normal'
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
      {activeTab === 'users' && <UsersPage />}
      {activeTab === 'products' && <ProductsPage />}
    </div>
  );
}

export default App;
