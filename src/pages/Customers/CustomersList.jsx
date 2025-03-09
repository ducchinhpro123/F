import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCustomerContext } from '../../context/CustomerContext';
import CustomerItem from '../../components/customers/CustomerItem';
import CustomerFilter from '../../components/customers/CustomerFilter';

const CustomersList = () => {
  const { customers, loading, fetchCustomers } = useCustomerContext();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <div className="customers-page">
      <div className="page-header">
        <h1>Customers</h1>
        <Link to="/customers/new" className="btn">Add New Customer</Link>
      </div>
      <CustomerFilter />
      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <div className="customers-grid">
          {customers.map(customer => (
            <CustomerItem key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomersList;
