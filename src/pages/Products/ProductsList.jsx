import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductContext } from "../../context/ProductContext";
import ProductItem from "../../components/products/ProductItem";
import ProductFilter from "../../components/products/ProductFilter";

const ProductsList = () => {
  const { products, loading, error, fetchProducts } = useProductContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({});

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Extract the actual products array from the response
  const productItems = products?.products || [];
  
  // Handle filter changes
  const handleFilterChange = (filters) => {
    setFilterCriteria(filters);
    // Apply client-side filtering if needed (or you can call fetchProducts with filters)
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(10).fill().map((_, index) => (
      <div key={index} className="product-skeleton">
        <div className="skeleton-image"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-category"></div>
          <div className="skeleton-price"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>Products</h1>
          <p className="products-count">
            {productItems.length > 0 && `${productItems.length} products found`}
          </p>
        </div>
        <div className="page-actions">
          <Link to="/products/new" className="btn btn-primary">
            <i className="icon-plus"></i> Add New Product
          </Link>
        </div>
      </div>
      
      <ProductFilter onFilterChange={handleFilterChange} />
      
      {error && (
        <div className="error-message">
          <p>Error loading products: {error}</p>
          <button className="btn" onClick={() => fetchProducts()}>
            Try Again
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="products-grid">
          {renderSkeletons()}
        </div>
      ) : productItems.length > 0 ? (
        <div className="products-grid">
          {productItems.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h2>No products found</h2>
          <p>
            {Object.keys(filterCriteria).length > 0
              ? "Try adjusting your filters"
              : "Start by adding some products"}
          </p>
          <Link to="/products/new" className="btn btn-primary">
            Add Your First Product
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
