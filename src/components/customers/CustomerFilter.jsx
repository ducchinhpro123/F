import { useState } from 'react';

const CustomerFilter = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    onFilterChange({ searchTerm: e.target.value });
  };

  const handleClear = () => {
    setSearchTerm('');
    onFilterChange({ searchTerm: '' });
  };

  return (
    <div className="filter-container">
      <div className="filter-group">
        <input
          type="text"
          name="searchTerm"
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
        />
        <button onClick={handleClear} className="btn btn-clear">Clear</button>
      </div>
    </div>
  );
};

export default CustomerFilter;