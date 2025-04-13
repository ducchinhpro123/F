import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomerContext } from '../../context/CustomerContext';

// Ảnh mặc định khi avatar là null
const DEFAULT_AVATAR = '/images/default-avatar.png'; // Đặt ảnh mặc định trong thư mục public/images

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentCustomer, fetchCustomerById, loading, error } = useCustomerContext();

  useEffect(() => {
    if (id) {
      fetchCustomerById(id);
    }
  }, [id, fetchCustomerById]);

  if (loading) return <p>Loading customer details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!currentCustomer) return <p>No customer details available.</p>;

  // Xác định đường dẫn avatar
  const avatarUrl = currentCustomer.avatar 
    ? `http://localhost:3000${currentCustomer.avatar}` 
    : DEFAULT_AVATAR;

  return (
    <div style={{
      maxWidth: '500px',
      margin: '50px auto',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <img
        src={avatarUrl}
        alt="Avatar"
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '3px solid #ccc',
          marginBottom: '20px'
        }}
        onError={(e) => {
          e.target.src = DEFAULT_AVATAR; // Nếu ảnh lỗi, dùng ảnh mặc định
        }}
      />

      <h2 style={{ margin: '10px 0', color: '#333' }}>{currentCustomer.name}</h2>
      <p style={{ margin: '6px 0', color: '#555' }}><strong>Role:</strong> {currentCustomer.role}</p>
      <p style={{ margin: '6px 0', color: '#555' }}>
        <strong>Created At:</strong> {new Date(currentCustomer.createdAt).toLocaleString()}
      </p>

      {/* Nút quay về */}
      <button
        onClick={() => navigate('/customers')}
        style={{
          marginTop: '25px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#007BFF')}
      >
        Back
      </button>
    </div>
  );
};

export default CustomerDetail;