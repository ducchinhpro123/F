import { Link } from 'react-router-dom';
import { useCustomerContext } from '../../context/CustomerContext';

const CustomerItem = ({ customer }) => {
  const { deleteCustomer } = useCustomerContext();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      deleteCustomer(customer.id);
    }
  };

  return (
    <div className="customer-item">
      <div className="customer-info">
        <h3>{customer.name}</h3>
        <p className="customer-email">{customer.email}</p>
        {customer.phone && <p className="customer-phone">{customer.phone}</p>}
      </div>
      <div className="customer-actions">
        <Link to={`/customers/${customer.id}/edit`} className="btn btn-edit">
          Edit
        </Link>
        <button 
          className="btn btn-delete" 
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CustomerItem;
