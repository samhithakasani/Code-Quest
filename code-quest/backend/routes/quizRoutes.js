const express = require('express');
const router = express.Router();
const {
  getQuizzes, getAllQuizzes, getQuiz, createQuiz, updateQuiz,
  deleteQuiz, togglePublish, addQuestionToQuiz
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getQuizzes); // Public route - anyone can see available quizzes
router.get('/admin/all', protect, authorize('admin'), getAllQuizzes);
router.get('/:id', getQuiz); // Public route - anyone can access quiz questions
router.post('/', protect, authorize('admin'), createQuiz);
router.put('/:id', protect, authorize('admin'), updateQuiz);
router.delete('/:id', protect, authorize('admin'), deleteQuiz);
router.post('/:id/publish', protect, authorize('admin'), togglePublish);
router.post('/:id/questions', protect, authorize('admin'), addQuestionToQuiz);

module.exports = router;
