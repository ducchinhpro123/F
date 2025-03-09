import { useState, useEffect } from 'react';
import { useCustomerContext } from '../../context/CustomerContext';
import { useProductContext } from '../../context/ProductContext';

const SaleForm = ({ onSubmit }) => {
  const { customers, fetchCustomers } = useCustomerContext();
  const { products, fetchProducts } = useProductContext();
  
  const [saleData, setSaleData] = useState({
    customerId: '',
    items: [],
    paymentMethod: 'credit',
    status: 'pending',
    notes: ''
  });
  
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, [fetchCustomers, fetchProducts]);
  
  const handleCustomerChange = (e) => {
    setSaleData({ ...saleData, customerId: e.target.value });
  };
  
  const handleAddProduct = (productId, quantity = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newItem = {
      productId,
      name: product.name,
      price: product.price,
      quantity
    };
    
    setSelectedProducts([...selectedProducts, newItem]);
    
    const updatedItems = [...saleData.items, {
      productId,
      quantity,
      price: product.price
    }];
    
    setSaleData({ ...saleData, items: updatedItems });
  };
  
  const handlePaymentMethodChange = (e) => {
    setSaleData({ ...saleData, paymentMethod: e.target.value });
  };
  
  const handleNotesChange = (e) => {
    setSaleData({ ...saleData, notes: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(saleData);
  };
  
  const calculateTotal = () => {
    return selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <form onSubmit={handleSubmit} className="sale-form">
      <div className="form-group">
        <label htmlFor="customer">Customer</label>
        <select 
          id="customer" 
          value={saleData.customerId} 
          onChange={handleCustomerChange}
          required
        >
          <option value="">Select a customer</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>{customer.name}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <h3>Products</h3>
        {selectedProducts.length > 0 ? (
          <div className="selected-products">
            {selectedProducts.map((item, index) => (
              <div key={index} className="selected-product-item">
                <span>{item.name}</span>
                <span>Qty: {item.quantity}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="total">
              <strong>Total: ${calculateTotal().toFixed(2)}</strong>
            </div>
          </div>
        ) : (
          <p>No products selected</p>
        )}
        
        <div className="product-selector">
          <select 
            id="productSelect"
            onChange={(e) => {
              if (e.target.value) handleAddProduct(e.target.value);
              e.target.value = ""; // Reset select after adding
            }}
          >
            <option value="">Add a product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="paymentMethod">Payment Method</label>
        <select 
          id="paymentMethod" 
          value={saleData.paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          <option value="credit">Credit Card</option>
          <option value="cash">Cash</option>
          <option value="transfer">Bank Transfer</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea 
          id="notes" 
          value={saleData.notes}
          onChange={handleNotesChange}
          rows="3"
        ></textarea>
      </div>
      
      <button type="submit" className="btn">Complete Sale</button>
    </form>
  );
};

export default SaleForm;
