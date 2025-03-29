import { Link } from 'react-router-dom';

const ProductItem = ({ product }) => {
  // Determine stock status
  const getStockStatus = () => {
    if (!product.stock) return { label: 'Out of Stock', className: 'out-of-stock' };
    if (product.stock < 10) return { label: 'Low Stock', className: 'low-stock' };
    return { label: 'In Stock', className: 'in-stock' };
  };
  
  const stockStatus = getStockStatus();

  return (
    <div className="product-item">
      {product.featured && <span className="featured-badge">Featured</span>}
      
      <div className="product-image">
        <img 
          src={`http://localhost:3000${product.image}`}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
      </div>
      
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category?.name || 'Uncategorized'}</p>
        
        <div className="product-details">
          <p className="price">${product.price.toFixed(2)}</p>
          
          <div className="stock-info">
            <span className={`stock-status ${stockStatus.className}`}>
              {stockStatus.label}
            </span>
            <span className="stock-quantity">Stock: {product.stock}</span>
          </div>
        </div>
      </div>
      
      <div className="product-actions">
        <Link to={`/products/${product._id}`} className="btn btn-edit">
          Edit
        </Link>
        <Link to={`/products/view/${product._id}`} className="btn btn-primary">
          View
        </Link>
      </div>
    </div>
  );
};

export default ProductItem;
