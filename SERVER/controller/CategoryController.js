const Category = require('../models/Category');
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

class CategoryController {
  // Get all categories
  static async getAllCategories(req, res) {
    try {
      const categories = await Category.find().sort({ name: 1 });
      
      return res.json({
        success: true,
        categories
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
  
  // Get single category by ID
  static async getCategoryById(req, res) {
    try {
      const categoryId = req.params.id;
      
      const category = await Category.findById(categoryId);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      
      return res.json({
        success: true,
        category
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
  
  // Create new category
  static async createCategory(req, res) {
    try {
      const { name, description } = req.body;
      
      // Check if category with the same name already exists
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        // If file was uploaded, delete it since we're returning an error
        if (req.file) {
          fs.unlinkSync(path.join(__dirname, '../public/images/categories', req.file.filename));
        }
        return res.status(400).json({
          success: false,
          message: 'A category with this name already exists'
        });
      }
      
      // Create category with image if uploaded
      const category = await Category.create({
        name,
        description,
        image: req.file ? `/images/categories/${req.file.filename}` : 'default-category.jpg'
      });
      
      return res.status(201).json({
        success: true,
        category
      });
    } catch (error) {
      // If file was uploaded, delete it since we encountered an error
      if (req.file) {
        const filePath = path.join(__dirname, '../public/images/categories', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
  
  // Update category
  static async updateCategory(req, res) {
    try {
      const categoryId = req.params.id;
      const { name, description } = req.body;
      
      // Find category
      const category = await Category.findById(categoryId);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      
      // Check if new name already exists (only if name is being changed)
      if (name && name !== category.name) {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
          return res.status(400).json({
            success: false,
            message: 'A category with this name already exists'
          });
        }
      }
      
      // Update category
      category.name = name || category.name;
      category.description = description || category.description;
      
      // If image was uploaded, save it
      if (req.file) {
        // Delete old image if it's not the default
        if (category.image && category.image !== 'default-category.jpg') {
          const oldImagePath = path.join(__dirname, '../public', category.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        category.image = `/images/categories/${req.file.filename}`;
      }
      
      await category.save();
      
      return res.json({
        success: true,
        category
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
  
  // Delete category
  static async deleteCategory(req, res) {
    try {
      const categoryId = req.params.id;
      
      // Check if category exists
      const category = await Category.findById(categoryId);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      
      // Check if category is used by any product
      const productsWithCategory = await Product.countDocuments({ category: categoryId });
      
      if (productsWithCategory > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete category because it is used by ${productsWithCategory} products.`
        });
      }
      
      // Delete category image if it's not the default
      if (category.image && category.image !== 'default-category.jpg') {
        const imagePath = path.join(__dirname, '../public', category.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      // Delete category
      await Category.findByIdAndDelete(categoryId);
      
      return res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
  
  // Get products by category
  static async getProductsByCategory(req, res) {
    try {
      const categoryId = req.params.id;
      const { page = 1, limit = 10, sort } = req.query;
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      
      // Check if category exists
      const category = await Category.findById(categoryId);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      
      // Build sort options
      let sortOptions = {};
      if (sort) {
        const sortFields = sort.split(',');
        sortFields.forEach(field => {
          if (field.startsWith('-')) {
            sortOptions[field.substring(1)] = -1;
          } else {
            sortOptions[field] = 1;
          }
        });
      } else {
        // Default sort by creation date
        sortOptions = { createdAt: -1 };
      }
      
      // Get products by category with pagination
      const products = await Product.find({ category: categoryId })
        .populate('category', 'name')
        .populate('createdBy', 'name username')
        .sort(sortOptions)
        .limit(limitNumber)
        .skip((pageNumber - 1) * limitNumber);
      
      // Get total count for pagination
      const total = await Product.countDocuments({ category: categoryId });
      
      return res.json({
        success: true,
        category: {
          _id: category._id,
          name: category.name,
          description: category.description,
          image: category.image
        },
        products,
        currentPage: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        totalProducts: total
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
  
  // Upload category image only
  static async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file uploaded'
        });
      }
      
      const categoryId = req.params.id;
      const category = await Category.findById(categoryId);
      
      if (!category) {
        // Delete the uploaded file
        fs.unlinkSync(path.join(__dirname, '../public/images/categories', req.file.filename));
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      
      // Delete old image if it's not the default
      if (category.image && category.image !== 'default-category.jpg') {
        const oldImagePath = path.join(__dirname, '../public', category.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Update category with new image
      category.image = `/images/categories/${req.file.filename}`;
      await category.save();
      
      return res.json({
        success: true,
        imageUrl: category.image,
        message: 'Image uploaded successfully'
      });
    } catch (error) {
      // If file was uploaded, delete it since we encountered an error
      if (req.file) {
        const filePath = path.join(__dirname, '../public/images/categories', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = CategoryController;
