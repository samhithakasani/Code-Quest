const express = require('express');
const router = express.Router();
const { getQuestions, getQuestion, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getQuestions);
router.get('/:id', protect, getQuestion);
router.post('/', protect, authorize('admin'), createQuestion);
router.put('/:id', protect, authorize('admin'), updateQuestion);
router.delete('/:id', protect, authorize('admin'), deleteQuestion);

module.exports = router;
