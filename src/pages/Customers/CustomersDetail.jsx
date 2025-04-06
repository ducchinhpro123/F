import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Customers/CustomersDetail.css";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`http://localhost:3000/api/users/user/${id}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        console.log(data);
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  // Handle delete user
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Redirect to customers list page after successful deletion
      navigate('/customers');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="loading-text">Loading user details...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="customer-detail-container">
      <div className="customer-card">
        <h2 className="customer-title">User Details</h2>
        <div className="user-info">
          <div className="user-avatar">
            {user.avatar ? (
              <img
                src={`http://localhost:3000/avatars/${user.avatar.split('/').pop()}`}
                alt="Avatar"
                className="avatar-img"
              />
            ) : (
              <p>No avatar available</p>
            )}
          </div>
          <div className="user-details">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="button-group">
          <button className="back-btn" onClick={() => navigate('/customers')}>Go Back</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
          <button className="edit-btn" onClick={() => navigate(`/customers/edit/${id}`)}>Edit</button>
        </div>
      </div>
    </div>
  );
}
