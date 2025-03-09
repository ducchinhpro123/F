import { useState } from 'react';

const CustomerFilter = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    onFilterChange({ searchTerm: e.target.value });
  };

  return (
    <div className="filter-container">
      <div className="filter-group">
        <input
          type="text"
          name="searchTerm"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
        />
      </div>
    </div>
  );
};

export default CustomerFilter;
