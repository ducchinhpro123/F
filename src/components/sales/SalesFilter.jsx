import { useState } from 'react';

const SalesFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    dateRange: 'all',
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

  return (
    <div className="filter-container">
      <div className="filter-row">
        <div className="filter-group">
          <input
            type="text"
            name="searchTerm"
            placeholder="Search customer or invoice #"
            value={filters.searchTerm}
            onChange={handleInputChange}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="dateRange">Date Range:</label>
          <select
            id="dateRange"
            name="dateRange"
            value={filters.dateRange}
            onChange={handleInputChange}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SalesFilter;
