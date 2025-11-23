const User = require("../model/Users");
const { createAccessToken, createRefreshToken } = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        error: "Name is required",
      });
    }
    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }
    if (!password) {
      return res.status(400).json({
        error: "Password is required",
      });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user (password will be hashed by the pre-save hook in the User model)
    const newUser = await User.create({ name, email, password });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }
    if (!password) {
      return res.status(400).json({
        error: "Password is required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = createAccessToken({ userId: user._id });
    const refreshToken = createRefreshToken({ userId: user._id });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logout = async (req, res) => {
  // With bearer tokens, logout is handled client-side by removing the token
  // Optionally, you can implement token blacklisting here
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Refresh token is required",
      });
    }

    // Verify refresh token (using verifyAccessToken since both use same secret)
    const { verifyAccessToken } = require("../utils/jwt");
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired refresh token",
      });
    }

    // Generate new access token
    const newAccessToken = createAccessToken({ userId: decoded.userId });

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Invalid or expired refresh token",
    });
  }
};

module.exports = { register, login, logout, refreshToken };
