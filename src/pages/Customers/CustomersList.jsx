import React, { useEffect, useState, useCallback } from 'react';
import { useCustomerContext } from '../../context/CustomerContext';
import CustomerItem from '../../components/customers/CustomerItem';
import CustomerFilter from '../../components/customers/CustomerFilter';
import { searchCustomers } from '../../services/customerService';

const CustomersList = () => {
  const { customers, setCustomers, fetchCustomers, removeCustomer, addCustomer, error, setError } = useCustomerContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', username: '', password: '' });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setIsDeleting(true);
      await removeCustomer(id);
      setIsDeleting(false);
    }
  };

  const handleFilterChange = useCallback(async ({ searchTerm }) => {
    if (!searchTerm) {
      await fetchCustomers();
      return;
    }
    try {
      const filtered = await searchCustomers(searchTerm);
      setCustomers(filtered);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }, [fetchCustomers, setCustomers]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', username: '', password: '' });
    setFormError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await addCustomer(formData);
      // Không cần fetchCustomers() vì đã được gọi trong addCustomer
      closeModal();
    } catch (err) {
      setFormError(err.message || 'Failed to add customer');
    }
  };

  return (
    <div className="customers-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Customers</h1>
        <button
          onClick={openModal}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
        >
          Add Customer
        </button>
      </div>

      <CustomerFilter onFilterChange={handleFilterChange} />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!customers || customers.length === 0 ? (
        <p>No customers found. Try adding some!</p>
      ) : (
        <div className="customer-items">
          {customers.map((customer, index) => {
            console.log('Customer:', customer); // Debug dữ liệu customer
            // Chuẩn hóa key để tránh thiếu _id
            const key = customer._id || customer.id || `temp-${index}`;
            return (
              <CustomerItem
                key={key}
                customer={customer}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              width: '400px',
              maxWidth: '90%',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h2 style={{ margin: '0 0 20px', textAlign: 'center' }}>Add New Customer</h2>
            {formError && <p style={{ color: 'red', textAlign: 'center' }}>{formError}</p>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersList;