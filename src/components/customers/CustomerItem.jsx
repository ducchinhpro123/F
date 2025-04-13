import React from 'react';
import { Link } from 'react-router-dom';

const CustomerItem = ({ customer, onDelete, isDeleting }) => {
  return (
    <div className="customer-item">
      <h3>{customer.name}</h3>
      <p>{customer.email}</p>
      <div className="actions">
        <Link to={`/customers/${customer._id}`} className="btn btn-view">View</Link>
        <Link to={`/customers/${customer._id}/edit`} className="btn btn-edit">Edit</Link>
        <button
          onClick={() => onDelete(customer._id)}
          className="btn btn-delete"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default CustomerItem;
