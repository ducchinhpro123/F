import { useEffect, useState } from "react";
import { useCategoryContext } from "../../context/CategoryContext";

const ProductFilter = ({ onFilterChange  }) => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "",
  });

  const { categories, fetchCategories, loading } = useCategoryContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const categoryItems = categories?.categories || [];

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
            <option value="">All Categories</option>
            {loading ? (
              <option disabled>Loading categories...</option>
            ) : (
              categoryItems.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
