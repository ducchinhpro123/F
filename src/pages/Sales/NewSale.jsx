import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSalesContext } from '../../context/SalesContext';
import { useProductContext } from '../../context/ProductContext';
import { useCustomerContext } from '../../context/CustomerContext';
import SaleForm from '../../components/sales/SaleForm';

const NewSale = () => {
  const navigate = useNavigate();
  const { createSale } = useSalesContext();
  
  const handleSubmit = (saleData) => {
    createSale(saleData)
      .then(() => navigate('/sales'));
  };

  return (
    <div className="new-sale">
      <h1>Create New Sale</h1>
      <SaleForm onSubmit={handleSubmit} />
    </div>
  );
};

export default NewSale;
