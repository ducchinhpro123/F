var User = require("../models/User");
const bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
const fs = require('fs');
const path = require('path');
const multer = require('multer');

dotenv.config();

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/avatars');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'avatar-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limit to 5MB
  },
  fileFilter: fileFilter
});

class UserController {
  static async getAllUser(req, res) {
    const users = await User.find();
    return res.json(users);
  }

  // Get user by :id
  static async getUser(req, res) {
    const id = req.params.id;
    try {
      if (!id) {
        return res.json({ Message: "Id invalid" });
      }
      const user = await User.findById(id);
      if (!user) {
        return res.json({ Message: "User not found" });
      }

      return res.json({
        id: user._id,
        name: user.name,
        username: user.username,
      });
    } catch (e) {
      console.log(e);
      return res.json({ Error: e.message });
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide username and password",
        });
      }

      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Please provide username and password",
        });
      }

      // user.comparePassword(password);
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          avatar: user.avatar, // Include avatar in response
          role: user.role
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }

  static async register(req, res) {
    const { name, username, password } = req.body;

    try {
      // Validate input
      if (!name || !username || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide name, username and password",
        });
      }

      // Check if user already exists
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({
          success: false,
          message: "User with this username already exists",
        });
      }

      // Create user
      user = await User.create({
        name: name,
        username: username,
        password: password,
      });

      // Create token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          avatar: user.avatar, // Include avatar in response
          role: user.role
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Name is required"
        });
      }
      
      // Update user profile
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      
      res.status(200).json({
        success: true,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          username: updatedUser.username,
          avatar: updatedUser.avatar
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  }
  
  static async uploadAvatar(req, res) {
    try {
      // multer middleware will handle the file upload
      upload.single('avatar')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }
        
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: "No file uploaded"
          });
        }
        
        const userId = req.user.id;
        const avatarPath = `/avatars/${req.file.filename}`;
        
        // Find user and get previous avatar path if exists
        const user = await User.findById(userId);
        const previousAvatar = user.avatar;
        
        // Update user with new avatar path
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { avatar: avatarPath },
          { new: true, runValidators: true }
        ).select('-password');
        
        // Delete previous avatar file if it's not the default
        if (previousAvatar && previousAvatar !== '/avatars/avatar.jpg') {
          const previousAvatarPath = path.join(__dirname, '../public', previousAvatar);
          if (fs.existsSync(previousAvatarPath)) {
            fs.unlinkSync(previousAvatarPath);
          }
        }
        
        res.status(200).json({
          success: true,
          user: {
            id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            avatar: updatedUser.avatar
          }
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  }
  
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          role: user.role
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  }
}

module.exports = UserController;
