import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../../context/ProductContext';

const ProductForm = ({ product = null }) => {
  const navigate = useNavigate();
  const { createProduct, updateProduct } = useProductContext();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
  });
  
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        category: product.category || '',
      });
    }
  }, [product]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (product?.id) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
      navigate('/products');
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };
  
  const categories = [
    'Laptops',
    'Desktops',
    'Tablets',
    'Smartphones',
    'Accessories',
    'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="price">Price ($)</label>
        <input
          type="number"
          id="price"
          name="price"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {product ? 'Update Product' : 'Create Product'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={() => navigate('/products')}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;