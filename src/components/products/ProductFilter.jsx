import { useState } from 'react';

const ProductFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'all',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = {
      ...filters,
      [name]: value
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
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
    <div className="filter-container">
      <div className="filter-row">
        <div className="filter-group">
          <input
            type="text"
            name="searchTerm"
            placeholder="Search products..."
            value={filters.searchTerm}
            onChange={handleInputChange}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleInputChange}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
