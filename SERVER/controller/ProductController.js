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
      console.log(req.body);
      const { name, description, price, categoryId, stock, featured } = req.body;
      
      // Check if category exists
      const existingCategory = await Category.findById(categoryId);

      if (!existingCategory) {
        // If file was uploaded, delete it since we're returning an error
        if (req.file) {
          fs.unlinkSync(path.join(__dirname, '../public/images', req.file.filename));
        }
        return res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
      }
      
      // Create product
      const product = await Product.create({
        name,
        description,
        price: parseFloat(price),
        category: existingCategory._id,
        stock: parseInt(stock) || 0,
        featured: featured === 'true' || featured === true,
        createdBy: req.user.id,
        // Set image if uploaded
        image: req.file ? `/images/${req.file.filename}` : 'default-product.jpg'
      });
      
      return res.status(201).json({
        success: true,
        product
      });
    } catch (error) {
      // If file was uploaded, delete it since we encountered an error
      if (req.file) {
        const filePath = path.join(__dirname, '../public/images', req.file.filename);
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
  
  // Update product
  static async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const updateData = { ...req.body };
      
      console.log('Update data received:', updateData);
      console.log('File received:', req.file);
      
      // Handle numeric values - ensure proper parsing from FormData
      if (updateData.price) updateData.price = parseFloat(updateData.price);
      if (updateData.stock) updateData.stock = parseInt(updateData.stock, 10);
      if (updateData.categoryId) updateData.category = updateData.categoryId; // Map categoryId to category
      
      // Delete categoryId since we now use 'category' in our model
      delete updateData.categoryId;
      
      // Find product
      const product = await Product.findById(productId);
      
      if (!product) {
        // If file was uploaded, delete it since we're returning an error
        if (req.file) {
          fs.unlinkSync(path.join(__dirname, '../public/images', req.file.filename));
        }
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      // Check if user is authorized (admin)
      if (req.user.role !== 'admin') {
        // If file was uploaded, delete it since we're returning an error
        if (req.file) {
          fs.unlinkSync(path.join(__dirname, '../public/images', req.file.filename));
        }
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this product'
        });
      }
      
      // If a new image was uploaded, handle the image update
      if (req.file) {
        console.log(product.image);
        try {
          // Delete old image if it's not the default and is a valid file path
          if (product.image && 
              product.image !== 'default-product.jpg' && 
              product.image !== '/' &&  // the empty file start with the /
              product.image.length > 1) {
            
            const oldImagePath = path.join(__dirname, '../public', product.image);
            
            // Check if the path exists and is a file (not a directory)
            if (fs.existsSync(oldImagePath) && fs.statSync(oldImagePath).isFile()) {
              fs.unlinkSync(oldImagePath);
            }
          }
        } catch (fileError) {
          console.error('Error deleting old image:', fileError);
          // Continue with the update even if image deletion fails
        }
        
        // Set new image
        updateData.image = `/images/${req.file.filename}`;
      } else {
        // No new image uploaded, keep the existing image
        delete updateData.image;
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
      // If file was uploaded, delete it since we encountered an error
      if (req.file) {
        try {
          const filePath = path.join(__dirname, '../public/images', req.file.filename);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          }
        } catch (cleanupError) {
          console.error('Error cleaning up uploaded file:', cleanupError);
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
      
      // Delete product image if it's not the default and is a valid file path
      try {
        if (product.image && 
            product.image !== 'default-product.jpg' && 
            product.image !== '/' && 
            product.image.length > 1) {
          
          const imagePath = path.join(__dirname, '../public', product.image);
          
          // Check if the path exists and is a file (not a directory)
          if (fs.existsSync(imagePath) && fs.statSync(imagePath).isFile()) {
            fs.unlinkSync(imagePath);
          }
        }
      } catch (fileError) {
        console.error('Error deleting product image:', fileError);
        // Continue with the product deletion even if image deletion fails
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
  
  // Upload product image only
  static async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file uploaded'
        });
      }
      
      const productId = req.params.id;
      const product = await Product.findById(productId);
      
      if (!product) {
        // Delete the uploaded file
        fs.unlinkSync(path.join(__dirname, '../public/images', req.file.filename));
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      // Delete old image if it's not the default
      try {
        if (product.image && 
            product.image !== 'default-product.jpg' && 
            product.image !== '/' && 
            product.image.length > 1) {
          
          const oldImagePath = path.join(__dirname, '../public', product.image);
          
          // Check if the path exists and is a file (not a directory)
          if (fs.existsSync(oldImagePath) && fs.statSync(oldImagePath).isFile()) {
            fs.unlinkSync(oldImagePath);
          }
        }
      } catch (fileError) {
        console.error('Error deleting old product image:', fileError);
        // Continue with the update even if image deletion fails
      }
      
      // Update product with new image
      product.image = `/images/${req.file.filename}`;
      await product.save();
      
      return res.json({
        success: true,
        imageUrl: product.image,
        message: 'Image uploaded successfully'
      });
    } catch (error) {
      // If file was uploaded, delete it since we encountered an error
      if (req.file) {
        const filePath = path.join(__dirname, '../public/images', req.file.filename);
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

module.exports = ProductController;
