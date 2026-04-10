const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @GET /api/users - Admin: all users
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).sort('-createdAt');
    res.json({ success: true, users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// @DELETE /api/users/:id - Admin delete user
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User removed' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
