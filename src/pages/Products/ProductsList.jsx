import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProductContext } from "../../context/ProductContext";
import ProductItem from "../../components/products/ProductItem";
import ProductFilter from "../../components/products/ProductFilter";
import Pagination from "../../components/common/Pagination";

const ProductsList = () => {
  const { products, loading, error, fetchProducts } = useProductContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 1,
    limit: 10,
    totalProducts: 0,
  });

  const loadProducts = useCallback(() => {
    const queryParams = {
      page: currentPage,
      limit: paginationInfo.limit,
    };

    if (searchParams.get("search") !== "") {
      queryParams.search = searchParams.get("search");
    }

    if (searchParams.get("category") !== "") {
      queryParams.category = searchParams.get("category");
    }

    fetchProducts(queryParams);
  }, [
    currentPage,
    paginationInfo.limit,
    fetchProducts,
    searchParams
  ]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (products) {
      setPaginationInfo((prev) => ({
        ...prev,
        totalPages: products.totalPages || 1,
        totalProducts: products.totalProducts || 0,
      }));
    }
  }, [products]);

  const productItems = products?.products || [];

  const handleFilterChange = (filters) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        filters.searchTerm && newParams.set("search", filters.searchTerm);
        filters.category && newParams.set("category", filters.category);

        // Default page is 1
        newParams.set("page", "1");
        return newParams;
      },
      { replace: false }
    );
  };

  const handlePageChange = (newPage) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", newPage.toString());
        return newParams;
      },
      { replace: false }
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderSkeletons = () => {
    return Array(paginationInfo.limit).fill().map((_, index) => (
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
            {paginationInfo.totalProducts > 0 && `${paginationInfo.totalProducts} products found`}
          </p>
        </div>
        <div className="page-actions">
          <Link to="/products/new" className="btn btn-primary">
            <i className="icon-plus"></i> Add New Product
          </Link>
        </div>
      </div>

      <ProductFilter onFilterChange={handleFilterChange}  />

      {error && (
        <div className="error-message">
          <p>Error loading products: {error}</p>
          <button className="btn" onClick={loadProducts}>
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="products-grid">{renderSkeletons()}</div>
      ) : productItems.length > 0 ? (
        <>
          <div className="products-grid">
            {productItems.map((product) => (
              <ProductItem
                key={product._id}
                product={product}
                pageInfo={`page=${currentPage}`}
              />
            ))}
          </div>

          {paginationInfo.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={paginationInfo.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h2>No products found</h2>
          {/*
          <p>
            {filterCriteria.searchTerm || filterCriteria.category
              ? "Try adjusting your filters"
              : "Start by adding some products"}
          </p>
            */}
          <Link to="/products/new" className="btn btn-primary">
            Add Your New Product
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
