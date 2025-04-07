import { Link } from "react-router-dom";
import { useProductContext } from "../../context/ProductContext";
import { useState } from 'react';

const ProductItem = ({ product, pageInfo = '', compact = false }) => {
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
  
  // Format price safely
  const formatPrice = (price) => {
    const parsedPrice = parseFloat(price);
    return isNaN(parsedPrice) ? '0.00' : parsedPrice.toFixed(2);
  };

  // Render compact mode (used in dashboard)
  if (compact) {
    return (
      <div className="product-item">
        <div className="product-image">
          <img
            src={product.image ? `http://localhost:3000${product.image}` : "https://placehold.jp/150x150.png"}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.jp/150x150.png";
            }}
          />
        </div>

        <div className="product-details">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">
            {product.category?.name || "Uncategorized"}
          </p>
          <p className="product-price">${formatPrice(product.price)}</p>
        </div>
      </div>
    );
  }

  // Render full product item
  return (
    <div className="product-item">
      {product.featured && <span className="featured-badge">Featured</span>}

      <div className="product-image">
        <img
          src={`http://localhost:3000${product.image}`}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.jp/150x150.png";
          }}
        />
      </div>

      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">
          {product.category?.name || "Uncategorized"}
        </p>

        <div className="product-details">
          <p className="price">${formatPrice(product.price)}</p>

          <div className="stock-info">
            <span className={`stock-status ${stockStatus.className}`}>
              {stockStatus.label}
            </span>
            <span className="stock-quantity">Stock: {product.stock || 0}</span>
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
