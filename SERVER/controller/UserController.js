import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import User from "../models/User.js"; // Thêm .js cho ES Module

dotenv.config();

// Fix __dirname cho ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer cấu hình upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'avatar-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: fileFilter
});

class UserController {
  static async getAllUser(req, res) {
    const users = await User.find();
    return res.json(users);
  }

  static async getUser(req, res) {
    const id = req.params.id;
    try {
      if (!id) return res.json({ Message: "Id invalid" });

      const user = await User.findById(id);
      if (!user) return res.json({ Message: "User not found" });

      return res.json({
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt
      });
    } catch (e) {
      console.log(e);
      return res.json({ Error: e.message });
    }
  }

  static async updateCustomer(req, res) {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

      user.name = req.body.name || user.name;
      user.role = req.body.role || user.role;

      if (req.file) {
        user.avatar = '/uploads/avatars/' + req.file.filename;
        // TODO: Xóa avatar cũ nếu cần
      }

      const updatedUser = await user.save();
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      return res.status(500).json({ message: 'Lỗi khi cập nhật người dùng', error: error.message });
    }
  }

  // Middleware xử lý upload avatar
  static uploadAvatarMiddleware(req, res, next) {
    upload.single('avatar')(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Lỗi upload file', error: err.message });
      } else if (err) {
        return res.status(500).json({ message: 'Lỗi server khi upload file', error: err.message });
      }
      next();
    });
  }

  static async login(req, res) {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        return res.status(400).json({ success: false, message: "Please provide username and password" });
      }

      const user = await User.findOne({ username });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

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
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }

  static async register(req, res) {
    const { name, username, password } = req.body;
    try {
      if (!name || !username || !password) {
        return res.status(400).json({ success: false, message: "Please provide name, username and password" });
      }

      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ success: false, message: "User with this username already exists" });
      }

      user = await User.create({ name, username, password });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

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
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name } = req.body;

      if (!name) return res.status(400).json({ success: false, message: "Name is required" });

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
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
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async uploadAvatar(req, res) {
    try {
      upload.single('avatar')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ success: false, message: err.message });
        }

        if (!req.file) {
          return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const userId = req.user.id;
        const avatarPath = `/avatars/${req.file.filename}`;

        const user = await User.findById(userId);
        const previousAvatar = user.avatar;

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { avatar: avatarPath },
          { new: true, runValidators: true }
        ).select('-password');

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
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (user.avatar && user.avatar !== '/avatars/avatar.jpg') {
        const avatarPath = path.join(__dirname, '../public', user.avatar);
        fs.unlink(avatarPath, (err) => {
          if (err) console.error("Failed to delete avatar:", err);
        });
      }

      res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('-password');

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
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
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }
}

export default UserController;
