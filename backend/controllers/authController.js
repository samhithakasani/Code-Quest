const User = require('../models/User');

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id, name: user.name, email: user.email,
      role: user.role, avatar: user.avatar,
      totalScore: user.totalScore, quizzesAttempted: user.quizzesAttempted,
    },
  });
};

// @route POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password, role: role === 'admin' ? 'admin' : 'student' });
    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Provide email and password' });

    let user;

    // Special case: samhitha@gmail.com with email as password
    if (email === 'samhitha@gmail.com' && password === 'samhitha@gmail.com') {
      user = await User.findOne({ email });
      if (!user) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('samhitha@gmail.com', 12);
        user = await User.create({
          name: 'Samhitha',
          email: 'samhitha@gmail.com',
          password: hashedPassword,
          role: 'admin'
        });
      } else if (user.role !== 'admin') {
        user.role = 'admin';
        await user.save({ validateBeforeSave: false });
      }
    } else if (email === 'admin@codequest.com' && password === 'admin123') {
      user = await User.findOne({ email });
      if (!user) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 12);
        user = await User.create({
          name: 'Admin',
          email: 'admin@codequest.com',
          password: hashedPassword,
          role: 'admin'
        });
      } else if (user.role !== 'admin') {
        user.role = 'admin';
        await user.save({ validateBeforeSave: false });
      }
    } else {
      // ANY email can login - auto-create user if not exists
      user = await User.findOne({ email });
      
      if (!user) {
        // Auto-create new user with any email
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 12);
        user = await User.create({
          name: email.split('@')[0], // Use email username as name
          email: email,
          password: hashedPassword,
          role: 'student' // Default role for any new user
        });
        console.log(`Auto-created new user: ${email}`);
      } else {
        // Existing user - validate password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your password.' });
        }
      }
    }

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });
    sendToken(user, 200, res);
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
};

// @route PUT /api/auth/updateprofile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, bio, avatar }, { new: true, runValidators: true });
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/auth/changepassword
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.matchPassword(currentPassword)))
      return res.status(401).json({ success: false, message: 'Current password incorrect' });
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
