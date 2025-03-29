const Product = require('../models/Product');
const Category = require('../models/Category');
const path = require('path');
const fs = require('fs');

class ProductController {
  // Get all products with pagination
  static async getAllProducts(req, res) {
    try {
      const { page = 1, limit = 10, category, featured, sort, search } = req.query;
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      
      // Build query
      const query = {};
      
      // Filter by category if provided
      if (category) {
        query.category = category;
      }
      
      // Filter featured products
      if (featured === 'true') {
        query.featured = true;
      }
      
      // Search by name or description
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
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
      
      // Execute query with pagination
      const products = await Product.find(query)
        .populate('category', 'name')
        .populate('createdBy', 'name username')
        .sort(sortOptions)
        .limit(limitNumber)
        .skip((pageNumber - 1) * limitNumber);
      
      // Get total count for pagination
      const total = await Product.countDocuments(query);
      
      return res.json({
        success: true,
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
  
  // Get single product by ID
  static async getProductById(req, res) {
    try {
      const productId = req.params.id;
      
      const product = await Product.findById(productId)
        .populate('category', 'name')
        .populate('createdBy', 'name username');
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      return res.json({
        success: true,
        product
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
  
  // Create new product
  static async createProduct(req, res) {
    try {
      const { name, description, price, category, stock, featured } = req.body;
      
      // Check if category exists
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
      }
      
      // Create product
      const product = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        featured: featured || false,
        createdBy: req.user.id // Assuming auth middleware adds user to req
      });
      
      // If image was uploaded, save it
      if (req.file) {
        product.image = `/images/${req.file.filename}`;
        await product.save();
      }
      
      return res.status(201).json({
        success: true,
        product
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
  
  // Update product
  static async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const updateData = req.body;
      
      // Find product
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      // Check if user is authorized (owner or admin)
      if (product.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this product'
        });
      }
      
      // Update product
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      
      return res.json({
        success: true,
        product: updatedProduct
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
  
  // Delete product
  static async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      
      // Find product
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      // Check if user is authorized (owner or admin)
      if (product.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this product'
        });
      }
      
      // Delete product image if it's not the default
      if (product.image && product.image !== 'default-product.jpg') {
        const imagePath = path.join(__dirname, '../public', product.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      // Delete product
      await Product.findByIdAndDelete(productId);
      
      return res.json({
        success: true,
        message: 'Product deleted successfully'
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
  
  // Get featured products
  static async getFeaturedProducts(req, res) {
    try {
      const products = await Product.find({ featured: true })
        .populate('category', 'name')
        .limit(8);
      
      return res.json({
        success: true,
        products
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
}

module.exports = ProductController;
