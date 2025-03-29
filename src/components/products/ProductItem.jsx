import { Link } from 'react-router-dom';

const ProductItem = ({ product }) => {
  return (
    <div className="product-item">
      <h3>{product.name}</h3>
      <p className="product-category">{product.category?.name || 'Uncategorized'}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      <div className="actions">
        <Link to={`/products/${product._id}`} className="btn btn-sm">Edit</Link>
      </div>
    </div>
  );
};

export default ProductItem;
