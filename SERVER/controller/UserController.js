var User = require("../models/User");
const bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");

dotenv.config();

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
        },
      });
    } catch (err) {
      console.err(err);
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
}

module.exports = UserController;
