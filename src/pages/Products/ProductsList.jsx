import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductContext } from "../../context/ProductContext";
import ProductItem from "../../components/products/ProductItem";
import ProductFilter from "../../components/products/ProductFilter";
import Pagination from "../../components/common/Pagination";

const ProductsList = () => {
  const { products, loading, error, fetchProducts } = useProductContext();

  const [filterCriteria, setFilterCriteria] = useState({
    searchTerm: "",
    category: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10
  });
  
  useEffect(() => {
    const queryParams = {
      page: pagination.currentPage,
      limit: pagination.limit
    };
    
    if (filterCriteria.searchTerm) {
      queryParams.search = filterCriteria.searchTerm;
    }
    if (filterCriteria.category) {
      queryParams.category = filterCriteria.category;
    }
    fetchProducts(queryParams);
  }, [filterCriteria.searchTerm, filterCriteria.category, pagination.currentPage, pagination.limit, fetchProducts]);

  useEffect(() => {
    if (products && (
      products.currentPage !== pagination.currentPage || 
      products.totalPages !== pagination.totalPages
    )) {
      setPagination(prev => ({
        ...prev,
        currentPage: products.currentPage || prev.currentPage,
        totalPages: products.totalPages || prev.totalPages
      }));
    }
  }, [products]);

  // Extract the actual products array from the response
  const productItems = products?.products || [];
  
  const handleFilterChange = (filters) => {
    setFilterCriteria(filters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            {products?.totalProducts > 0 && `${productItems.length} products found`}
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
        <>
          <div className="products-grid">
            {productItems.map((product) => (
              <ProductItem 
                key={product._id} 
                product={product} 
                pageInfo={`page=${pagination.currentPage}`} 
              />
            ))}
          </div>
          
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h2>No products found</h2>
          <p>
            {filterCriteria.searchTerm || filterCriteria.category
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
