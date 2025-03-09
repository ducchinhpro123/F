import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProductContext } from '../../context/ProductContext';
import ProductForm from '../../components/products/ProductForm';

const ProductDetail = () => {
  const { id } = useParams();
  const { currentProduct, fetchProductById } = useProductContext();

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  return (
    <div className="product-detail">
      <h1>{id ? 'Edit Product' : 'New Product'}</h1>
      <ProductForm product={currentProduct} />
    </div>
  );
};

export default ProductDetail;
