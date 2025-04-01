import { Link } from "react-router-dom";
import { useProductContext } from "../../context/ProductContext";
import { useState } from 'react';

const ProductItem = ({ product, pageInfo = '' }) => {
  // Determine stock status
  const [isDeleting, setIsDeleting] = useState();

  const getStockStatus = () => {
    if (!product.stock)
      return { label: "Out of Stock", className: "out-of-stock" };
    if (product.stock < 10)
      return { label: "Low Stock", className: "low-stock" };
    return { label: "In Stock", className: "in-stock" };
  };

  const { deleteProduct } = useProductContext();

  const stockStatus = getStockStatus();

  const handleDelete = async (e) => {
    e.preventDefault();
    if (window.confirm(`Are you sure you want to delete ${product.name}`)) {
      try {
        setIsDeleting(true);
        await deleteProduct(product._id);
      } catch (e) {
        console.log(e);
        alert("Failed to delete. Please try again!");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="product-item">
      {product.featured && <span className="featured-badge">Featured</span>}

      <div className="product-image">
        <img
          src={`http://localhost:3000${product.image}`}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
      </div>

      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">
          {product.category?.name || "Uncategorized"}
        </p>

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
        <Link to={`/products/edit/${product._id}?${pageInfo}`} className="btn btn-edit">
          Edit
        </Link>
        <Link to={`/products/view/${product._id}?${pageInfo}`} className="btn btn-primary">
          View
        </Link>
        <button 
          className="btn btn-danger" 
          onClick={handleDelete} 
          disabled={isDeleting}
        > 
          {isDeleting ? "Deleting..." : "Delete"} 
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
