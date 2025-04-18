var User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
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
    fileSize: 1024 * 1024 * 5 
  },
  fileFilter: fileFilter
});

class UserController {
  static async searchUsers(req, res) {
    try {
      const q = req.query.q || '';
      const users = await User.find({
        name: { $regex: q, $options: 'i' }
      });
      res.status(200).json(users);
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async getUser(req, res) {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      console.log('Uploaded file:', req.file); // Debug
      const { name, email } = req.body;
      let avatarPath = null;
      if (req.file) {
        avatarPath = `/avatars/${req.file.filename}`; // Sửa thành /avatars/
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, avatar: avatarPath },
        { new: true, runValidators: true }
      ).select('-password');
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
  
  static async getAllUser(req, res) {
    const users = await User.find();
    return res.json(users);
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
          avatar: user.avatar,
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
      if (!name || !username || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide name, username and password",
        });
      }
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({
          success: false,
          message: "User with this username already exists",
        });
      }
      user = await User.create({
        name: name,
        username: username,
        password: password,
      });
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
          avatar: user.avatar,
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
      console.log('File Upload Data:', req.file);
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Không tìm thấy file upload'
        });
      }
      const avatarPath = `/avatars/${req.file.filename}`;
      const user = await User.findById(req.user.id);
      console.log('User trước khi update:', user);
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: avatarPath },
        { new: true }
      ).select('-password');
      console.log('User sau khi update:', updatedUser);
      return res.status(200).json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      console.error('Lỗi upload:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi upload avatar',
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

// Xuất cả UserController và upload
module.exports = { UserController, upload };