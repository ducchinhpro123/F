import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSalesContext } from '../../context/SalesContext';
import SaleItem from '../../components/sales/SaleItem';
import SalesFilter from '../../components/sales/SalesFilter';

const SalesList = () => {
  const { sales, loading, fetchSales } = useSalesContext();

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return (
    <div className="sales-page">
      <div className="page-header">
        <h1>Sales</h1>
        <Link to="/sales/new" className="btn">New Sale</Link>
      </div>
      <SalesFilter />
      {loading ? (
        <p>Loading sales...</p>
      ) : (
        <div className="sales-list">
          {sales.map(sale => (
            <SaleItem key={sale.id} sale={sale} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesList;
