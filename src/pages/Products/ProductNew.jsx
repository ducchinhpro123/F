import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductContext } from "../../context/ProductContext";
import { useCategoryContext } from "../../context/CategoryContext";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import "./ProductNew.css";

const ProductNew = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: 0,
      categoryId: "",
      featured: false,
      image: null,
    },
  });
  const navigate = useNavigate();

  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const { createProduct } = useProductContext();
  const {
    categories,
    fetchCategories,
    loading: categoriesLoading,
  } = useCategoryContext();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const categoryItems = categories?.categories || [];

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", parseFloat(data.price));
      formData.append("stock", parseInt(data.stock, 10));
      formData.append("categoryId", data.categoryId);
      formData.append("featured", data.featured);

      // Only append image if a file was selected
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const result = await createProduct(formData);

      setSubmitStatus({ loading: false, success: true, error: null });
      reset();

      setTimeout(() => navigate(`/products/${result._id}`), 1000);
    } catch (error) {
      // console.error(e);
      setSubmitStatus({
        loading: false,
        success: false,
        error: error.message || "Failed to create product. Please try again.",
      });
    }
  };

  const imageFile = watch("image");
  const previewImage =
    imageFile && imageFile[0] ? URL.createObjectURL(imageFile[0]) : null;

  return (
    <div className="product-new-container">
      <div className="product-new-header">
        <h1>Add New Product</h1>
        <p>Create a new product to add to your inventory</p>
      </div>
      {submitStatus.success && (
        <div className="success-message">
          Product created successfully! Redirecting to products list...
        </div>
      )}

      {submitStatus.error && (
        <div className="error-message">{submitStatus.error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="product-form">
        <div className="form-grid">
          <div className="form-left">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                id="name"
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Enter product name"
                {...register("name", {
                  required: "Product name is required",
                  maxLength: {
                    value: 100,
                    message: "Name cannot exceed 100 characters",
                  },
                })}
              />
              {errors.name && (
                <span className="error-text">{errors.name.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                rows="5"
                placeholder="Enter product description"
                {...register("description", {
                  required: "Description is required",
                  maxLength: {
                    value: 2000,
                    message: "Description cannot exceed 2000 characters",
                  },
                })}
              />
              {errors.description && (
                <span className="error-text">{errors.description.message}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  className={`form-control ${errors.price ? "is-invalid" : ""}`}
                  placeholder="0.00"
                  {...register("price", {
                    required: "Price is required",
                    min: {
                      value: 0,
                      message: "Price must be a positive number",
                    },
                    validate: (value) =>
                      !isNaN(parseFloat(value)) ||
                      "Price must be a valid number",
                  })}
                />
                {errors.price && (
                  <span className="error-text">{errors.price.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock *</label>
                <input
                  id="stock"
                  type="number"
                  className={`form-control ${errors.stock ? "is-invalid" : ""}`}
                  placeholder="0"
                  {...register("stock", {
                    required: "Stock is required",
                    min: {
                      value: 0,
                      message: "Stock must be a positive number",
                    },
                    validate: (value) =>
                      Number.isInteger(Number(value)) ||
                      "Stock must be an integer",
                  })}
                />
                {errors.stock && (
                  <span className="error-text">{errors.stock.message}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="categoryId">Category *</label>
              <select
                id="categoryId"
                className={`form-control ${errors.categoryId ? "is-invalid" : ""}`}
                {...register("categoryId", {
                  required: "Please select a category",
                })}
              >
                <option value="">Select a category</option>
                {categoryItems.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <span className="error-text">{errors.categoryId.message}</span>
              )}
            </div>

            <div className="form-group checkbox-group">
              <input id="featured" type="checkbox" {...register("featured")} />
              <label htmlFor="featured">Featured Product</label>
            </div>
          </div>

          <div className="form-right">
            <div className="form-group image-upload">
              <label>Product Image</label>
              <div
                className={`image-preview ${errors.image ? "is-invalid" : ""}`}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="preview-image"
                  />
                ) : (
                  <div className="placeholder-image">
                    <span>No image selected</span>
                  </div>
                )}
              </div>

              <div className="file-input-container">
                <label htmlFor="image" className="file-input-label">
                  Choose Image
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="file-input"
                  {...register("image", {
                    validate: {
                      fileSize: (files) => {
                        if (!files || !files[0]) return true;
                        return (
                          files[0].size <= 5 * 1024 * 1024 ||
                          "Image size must be less than 5MB"
                        );
                      },
                      fileFormat: (files) => {
                        if (!files || !files[0]) return true;
                        const acceptedFormats = [
                          "image/jpeg",
                          "image/jpg",
                          "image/png",
                          "image/webp",
                        ];
                        return (
                          acceptedFormats.includes(files[0].type) ||
                          "Only JPEG, PNG and WebP formats are supported"
                        );
                      },
                    },
                  })}
                />
                <span className="selected-file-name">
                  {imageFile && imageFile[0]
                    ? imageFile[0].name
                    : "No file selected"}
                </span>
                {errors.image && (
                  <span className="error-text">{errors.image.message}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitStatus.loading}
          >
            {submitStatus.loading ? "Creating..." : "Create Product"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/products")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductNew;
