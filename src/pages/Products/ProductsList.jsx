import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductContext } from '../../context/ProductContext';
import ProductItem from '../../components/products/ProductItem';
import ProductFilter from '../../components/products/ProductFilter';

const ProductsList = () => {
  const { products, loading, fetchProducts } = useProductContext();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Products</h1>
        <Link to="/products/new" className="btn">Add New Product</Link>
      </div>
      <ProductFilter />
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;
