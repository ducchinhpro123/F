const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

dotenv.config();

// Sample product data - device names, descriptions and prices
const deviceData = [
  {
    name: 'Smartphone Pro X',
    description: 'Latest generation smartphone with advanced camera system, all-day battery life, and powerful processor.',
    price: 999.99
  },
  {
    name: 'Laptop Ultra',
    description: 'Ultra-thin laptop with high-performance specifications, perfect for both work and entertainment.',
    price: 1299.99
  },
  {
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with active noise cancellation and crystal clear sound quality.',
    price: 149.99
  },
  {
    name: 'Smartwatch Series 5',
    description: 'Advanced smartwatch with health monitoring features, GPS, and customizable watch faces.',
    price: 349.99
  },
  {
    name: 'Tablet Pro',
    description: 'Lightweight tablet with stunning display and powerful performance for work and creative projects.',
    price: 799.99
  },
  {
    name: 'Digital Camera 4K',
    description: 'Professional-grade camera with 4K video recording capability and advanced image stabilization.',
    price: 1199.99
  },
  {
    name: 'Gaming Console X',
    description: 'Next-generation gaming console with stunning graphics and exclusive game titles.',
    price: 499.99
  },
  {
    name: 'Smart Speaker',
    description: 'Voice-controlled smart speaker with premium sound quality and smart home integration.',
    price: 129.99
  },
  {
    name: 'VR Headset Pro',
    description: 'Immersive virtual reality headset with high-resolution display and motion tracking.',
    price: 399.99
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 49.99
  },
  {
    name: 'Fitness Tracker Band',
    description: 'Waterproof fitness tracker with heart rate monitoring and sleep tracking features.',
    price: 89.99
  },
  {
    name: '4K Smart TV',
    description: 'Ultra HD smart TV with vibrant colors, streaming apps, and voice control.',
    price: 899.99
  },
  {
    name: 'Ultra-Wide Monitor',
    description: '34" curved ultra-wide monitor perfect for gaming and productivity.',
    price: 499.99
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB mechanical keyboard with customizable keys and macro programming.',
    price: 149.99
  },
  {
    name: 'Wireless Gaming Mouse',
    description: 'High-precision wireless gaming mouse with adjustable DPI and programmable buttons.',
    price: 79.99
  },
  {
    name: 'Mesh WiFi Router System',
    description: 'Whole-home mesh WiFi system for reliable connectivity in every corner of your house.',
    price: 249.99
  },
  {
    name: 'External SSD 1TB',
    description: 'Portable solid-state drive with high-speed data transfer and durable design.',
    price: 159.99
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof Bluetooth speaker with 24-hour battery life and immersive sound.',
    price: 129.99
  },
  {
    name: 'Drone with 4K Camera',
    description: 'Compact drone with stabilized 4K camera, obstacle avoidance, and 30-minute flight time.',
    price: 799.99
  },
  {
    name: 'Smart Home Security Camera',
    description: 'Wireless security camera with motion detection, night vision, and cloud storage options.',
    price: 179.99
  }
];

// Get all images from the public/images directory
async function getImagesFromDirectory() {
  const imagesDir = path.join(__dirname, '../public/images');
  
  try {
    // Check if directory exists
    if (!fs.existsSync(imagesDir)) {
      console.log('Images directory not found. Creating directory...');
      fs.mkdirSync(imagesDir, { recursive: true });
      return [];
    }
    
    // Read all files in the directory
    const files = fs.readdirSync(imagesDir);
    
    // Filter to only include image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });
    
    return imageFiles.map(file => `/images/${file}`);
  } catch (error) {
    console.error('Error reading images directory:', error);
    return [];
  }
}

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_API);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Create categories if they don't exist
async function createCategories() {
  const categories = [
    { name: 'Smartphones', description: 'Mobile phones and accessories' },
    { name: 'Laptops', description: 'Portable computers for work and play' },
    { name: 'Audio', description: 'Headphones, earbuds, and speakers' },
    { name: 'Wearables', description: 'Smartwatches and fitness trackers' },
    { name: 'Tablets', description: 'Portable touchscreen devices' },
    { name: 'Cameras', description: 'Digital cameras and photography equipment' },
    { name: 'Gaming', description: 'Consoles, peripherals, and accessories' },
    { name: 'Smart Home', description: 'Connected devices for the modern home' }
  ];
  
  console.log('Creating categories...');
  const createdCategories = [];
  
  for (const category of categories) {
    const existingCategory = await Category.findOne({ name: category.name });
    if (existingCategory) {
      createdCategories.push(existingCategory);
    } else {
      const newCategory = await Category.create(category);
      createdCategories.push(newCategory);
    }
  }
  
  console.log(`${createdCategories.length} categories available`);
  return createdCategories;
}

// Create an admin user if it doesn't exist
async function getOrCreateAdminUser() {
  const adminUser = await User.findOne({ role: 'admin' });
  
  if (adminUser) {
    return adminUser;
  }
  
  // Create admin user
  const newAdmin = new User({
    username: 'admin',
    password: 'admin123', // This will be hashed by the pre-save hook
    name: 'Admin User',
    role: 'admin'
  });
  
  await newAdmin.save();
  console.log('Created admin user');
  return newAdmin;
}

// Seed products with images
async function seedProducts() {
  try {
    await connectDB();
    
    // Get all images from the directory
    const imagePaths = await getImagesFromDirectory();
    
    if (imagePaths.length === 0) {
      console.log('No images found in public/images directory. Please add some images first.');
      process.exit(0);
    }
    
    console.log(`Found ${imagePaths.length} images in the public/images directory.`);
    
    // Create categories
    const categories = await createCategories();
    
    // Get or create admin user
    const adminUser = await getOrCreateAdminUser();
    
    // Delete existing products
    await Product.deleteMany({});
    console.log('Deleted existing products');
    
    // Create new products with images
    const products = [];
    
    for (let i = 0; i < Math.min(deviceData.length, imagePaths.length); i++) {
      const productData = deviceData[i];
      const imagePath = imagePaths[i];
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      products.push({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image: imagePath,
        category: category._id,
        stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10 and 109
        featured: Math.random() > 0.7, // 30% chance to be featured
        createdBy: adminUser._id
      });
    }
    
    // Insert all products
    const createdProducts = await Product.insertMany(products);
    console.log(`Successfully created ${createdProducts.length} products with images!`);
    
    // If we have more images than product data, create additional products
    if (imagePaths.length > deviceData.length) {
      const extraProducts = [];
      for (let i = deviceData.length; i < imagePaths.length; i++) {
        const imagePath = imagePaths[i];
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        extraProducts.push({
          name: `Device ${i + 1}`,
          description: `This is a high-quality electronic device with premium features.`,
          price: (Math.random() * 1000 + 99).toFixed(2), // Random price between 99 and 1099
          image: imagePath,
          category: category._id,
          stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10 and 109
          featured: Math.random() > 0.7, // 30% chance to be featured
          createdBy: adminUser._id
        });
      }
      
      if (extraProducts.length > 0) {
        const createdExtraProducts = await Product.insertMany(extraProducts);
        console.log(`Created ${createdExtraProducts.length} additional products with remaining images.`);
      }
    }
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedProducts();
