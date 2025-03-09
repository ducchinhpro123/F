import { Link } from 'react-router-dom';

const SaleItem = ({ sale }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="sale-item">
      <div className="sale-header">
        <h3>Order #{sale.id}</h3>
        <span className={`status ${sale.status.toLowerCase()}`}>{sale.status}</span>
      </div>
      <div className="sale-body">
        <p><strong>Customer:</strong> {sale.customer.name}</p>
        <p><strong>Date:</strong> {formatDate(sale.date)}</p>
        <p><strong>Amount:</strong> ${sale.total.toFixed(2)}</p>
        <p><strong>Items:</strong> {sale.items.length}</p>
      </div>
      <div className="actions">
        <Link to={`/sales/${sale.id}`}>View Details</Link>
      </div>
    </div>
  );
};

export default SaleItem;
