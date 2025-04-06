import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Customers/CustomersList.css";

const CustomersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/getAllUser");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="customers-page">
      <div className="page-header">
        <h1>Customer</h1>
        <Link to="/signup?redirect=/customers" className="btn">
        Add customer User
        </Link>
      </div>
      {loading ? (
        <p>Loading customer...</p>
      ) : (
        <div className="customers-grid">
          {users.map((user) => (
            <div key={user._id} className="customer-item">
              <h3>{user.name}</h3>
              <p>Username: {user.username}</p>
              {/* Thêm link để xem chi tiết user */}
              <Link to={`/customers/${user._id}`} className="btn btn-detail">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomersList;
