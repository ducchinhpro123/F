import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useProductContext } from "../../context/ProductContext";
import { formatDate } from "../../utils/formatters";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./ProductView.css";

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentProduct, fetchProductById, loading, deleteProduct } =
    useProductContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const pageNumber = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get("page");
    if (page) {
      pageNumber.current = page;
    }
  }, [location.search]);

  useEffect(() => {
    fetchProductById(id);
  }, [id, fetchProductById]);

  const backToProducts = () => {
    const returnPage = pageNumber.current || 1;
    navigate(`/products?page=${returnPage}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setIsDeleting(true);
        await deleteProduct(id);
        const returnPage = pageNumber.current || 1;

        navigate(`/products?page=${returnPage}`);
      } catch (error) {
        console.error("Error deleting product:", error);
        setIsDeleting(false);
      }
    }
  };

  // Determine stock status
  const getStockStatus = (stock) => {
    if (!stock) return { label: "Out of Stock", className: "out-of-stock" };
    if (stock < 10) return { label: "Low Stock", className: "low-stock" };
    return { label: "In Stock", className: "in-stock" };
  };

  // Render skeleton loading state
  if (loading) {
    return (
      <div className="product-view-container">
        <div className="product-view-header">
          <Skeleton width={200} height={30} />
          <div className="product-view-actions">
            <Skeleton width={80} height={40} />
            <Skeleton width={80} height={40} />
          </div>
        </div>

        <div className="product-view-content">
          <div className="product-image-container">
            <Skeleton height={400} width="100%" />
          </div>

          <div className="product-info">
            <Skeleton height={40} width="80%" className="mb-2" />
            <Skeleton height={20} width="50%" className="mb-3" />
            <Skeleton height={30} width="40%" className="mb-2" />

            <div className="product-meta">
              <Skeleton height={25} width="100%" count={4} className="mb-1" />
            </div>

            <div className="product-description">
              <Skeleton height={20} width="90%" count={3} className="mb-1" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If the product couldn't be found
  if (!currentProduct || !currentProduct.product) {
    return (
      <div className="error-container">
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  const { product } = currentProduct;
  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="product-view-container">
      <div className="product-view-header">
        <h1>Product Details</h1>
        <div className="product-view-actions">
          <Link to={`/products/edit/${id}`} className="btn btn-primary">
            Edit Product
          </Link>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>

      <div className="product-view-content">
        <div className="product-image-container">
          <img
            src={`http://localhost:3000${product.image}`}
            alt={product.name}
            className="product-view-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/600x400?text=No+Image";
            }}
          />
          {product.featured && <span className="featured-badge">Featured</span>}
        </div>

        <div className="product-info">
          <h2 className="product-title">{product.name}</h2>
          <p className="product-category">
            {product.category?.name || "Uncategorized"}
          </p>
          <p className="product-price">${product.price?.toFixed(2)}</p>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Stock Status:</span>
              <span className={`stock-status ${stockStatus.className}`}>
                {stockStatus.label}
              </span>
            </div>

            <div className="meta-item">
              <span className="meta-label">In Stock:</span>
              <span>{product.stock} items</span>
            </div>

            {product.sold > 0 && (
              <div className="meta-item">
                <span className="meta-label">Sold:</span>
                <span>{product.sold} items</span>
              </div>
            )}

            <div className="meta-item">
              <span className="meta-label">Added by:</span>
              <span>{product.createdBy?.name || "Unknown"}</span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Added on:</span>
              <span>{formatDate(product.createdAt)}</span>
            </div>

            {product.updatedAt && product.updatedAt !== product.createdAt && (
              <div className="meta-item">
                <span className="meta-label">Last Updated:</span>
                <span>{formatDate(product.updatedAt)}</span>
              </div>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || "No description available."}</p>
          </div>
        </div>
      </div>

      <div className="product-view-footer">
        <button onClick={backToProducts} className="btn btn-secondary">
          Back to Products
        </button>
        {
          // <Link
          // to="/products" className="btn btn-secondary">
          //   Back to Products
          // </Link>
        }
      </div>
    </div>
  );
};

export default ProductView;
