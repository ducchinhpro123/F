import { useParams, useNavigate } from "react-router-dom";
import { useProductContext } from "../../context/ProductContext";
import { useCategoryContext } from "../../context/CategoryContext";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./ProductEdit.css";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, fetchProductById, updateProduct, loading } =
    useProductContext();
  const {
    categories,
    fetchCategories,
    loading: categoriesLoading,
  } = useCategoryContext();

  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      image: null,
    },
  });

  const categoryItems = categories?.categories || [];

  useEffect(() => {
    fetchProductById(id);
    fetchCategories(); // Fetch categories when component mounts
  }, [id, fetchProductById, fetchCategories]);

  useEffect(() => {
    if (currentProduct?.product) {
      reset(currentProduct.product);
    }
  }, [currentProduct, reset]);

  // Render skeleton UI with react-loading-skeleton
  const renderSkeletons = () => {
    return (
      <div className="product-edit-container">
        <div className="product-edit-header">
          <h1>
            <Skeleton width={300} />
          </h1>
          <p>
            <Skeleton width={200} />
          </p>
        </div>

        <div className="product-card">
          <div className="image-container">
            <Skeleton height={300} width="70%" />
            <div className="image-upload-control">
              <Skeleton height={40} width="70%" />
              <Skeleton height={20} width="50%" />
            </div>
          </div>

          <div className="product-details">
            <div className="form-group">
              <label>
                <Skeleton width={120} />
              </label>
              <Skeleton height={45} />
            </div>

            <div className="form-group">
              <label>
                <Skeleton width={100} />
              </label>
              <Skeleton height={120} />
            </div>

            <div className="form-group">
              <label>
                <Skeleton width={80} />
              </label>
              <Skeleton height={45} />
            </div>

            <div className="product-meta">
              <div className="meta-item form-group">
                <label>
                  <Skeleton width={90} />
                </label>
                <Skeleton height={45} />
              </div>

              <div className="meta-item form-group">
                <label>
                  <Skeleton width={70} />
                </label>
                <Skeleton height={45} />
              </div>
            </div>

            <div className="form-actions">
              <Skeleton height={45} width={120} />
              <Skeleton height={45} width={100} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading || categoriesLoading) {
    return renderSkeletons();
  }

  if (!loading && !currentProduct) {
    return (
      <div className="error-container">
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/products")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const { product } = currentProduct;

  const onSubmit = async (data) => {
    setUpdateStatus({ loading: true, success: false, error: null });
    try {
      // Convert numeric fields
      const productData = {
        ...data,
        price: parseFloat(data.price),
        stock: parseInt(data.stock, 10),
      };

      let formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", parseFloat(productData.price));
      formData.append("stock", parseInt(productData.stock, 10));
      formData.append("categoryId", productData.categoryId);

      if (productData.image && productData.image.length > 0) {
        console.log("Image being uploaded:", productData.image[0].name);
        formData.append("image", productData.image[0]);
      }
      
      await updateProduct(id, formData);
      setUpdateStatus({ loading: false, success: true, error: null });

      // Show success message briefly before redirecting
      setTimeout(() => {
        navigate("/products");
      }, 1500);
    } catch (error) {
      setUpdateStatus({
        loading: false,
        success: false,
        error: error.message || "Failed to update product",
      });
    }
  };


  return (
    <div className="product-edit-container">
      <div className="product-edit-header">
        <h1>Edit Product</h1>
        <p className="product-id">Product ID: {id}</p>
      </div>

      {updateStatus.success && (
        <div className="success-message">
          Product updated successfully! Redirecting to products list...
        </div>
      )}

      {updateStatus.error && (
        <div className="error-message">
          <p>Error: {updateStatus.error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="product-edit-form"
        encType="multipart/form-data"
      >
        <div className="product-card">
          <div className="image-container">
            <img
              src={`http://localhost:3000${product.image}`}
              alt={product.name}
              className="product-detail-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/300x200?text=No+Image";
              }}
            />
            <div className="image-upload-control">
              <label htmlFor="image">Update Image</label>
              <Controller
                name="image"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                )}
              />
              {errors.image && (
                <p className="error-text">{errors.image.message}</p>
              )}
              <p className="hint-text">Select an image to update</p>
            </div>
          </div>

          <div className="product-details">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                defaultValue={product.name}
                id="name"
                className={errors.name ? "error" : ""}
                {...register("name", { required: "Product name is required" })}
              />
              {errors.name && (
                <p className="error-text">{errors.name.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                defaultValue={product.description}
                id="description"
                rows="4"
                className={errors.description ? "error" : ""}
                {...register("description", {
                  required: "Product description is required",
                })}
              />
              {errors.description && (
                <p className="error-text">{errors.description.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                defaultValue={product.price}
                type="number"
                step="0.01"
                min="0"
                id="price"
                className={errors.price ? "error" : ""}
                {...register("price", {
                  required: "Product price is required",
                  min: {
                    value: 0,
                    message: "Price must be positive",
                  },
                })}
              />
              {errors.price && (
                <p className="error-text">{errors.price.message}</p>
              )}
            </div>

            <div className="product-meta">
              <div className="meta-item form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  className={errors.categoryId ? "error" : ""}
                  defaultValue={product.category.name}
                  {...register("categoryId", {
                    required: "Product category is required",
                  })}
                >
                  <option value="">Select a category</option>
                  {categoriesLoading ? (
                    <p>loading categories...</p>
                  ) : (
                    categoryItems.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
                {errors.categoryId && (
                  <p className="error-text">{errors.categoryId.message}</p>
                )}
              </div>

              <div className="meta-item form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  defaultValue={product.stock}
                  type="number"
                  min="0"
                  id="stock"
                  className={errors.stock ? "error" : ""}
                  {...register("stock", {
                    required: "Product stock is required",
                    min: {
                      value: 0,
                      message: "Stock cannot be negative",
                    },
                  })}
                />
                {errors.stock && (
                  <p className="error-text">{errors.stock.message}</p>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={updateStatus.loading}
              >
                {updateStatus.loading ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/products")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
