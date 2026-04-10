const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @POST /api/results/submit - Submit quiz attempt
router.post('/submit', protect, async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    let score = 0;
    const evaluated = answers.map(ans => {
      const question = quiz.questions.find(q => q._id.toString() === ans.questionId);
      const isCorrect = question && question.correctAnswer === ans.userAnswer;
      const marksObtained = isCorrect ? question.marks : 0;
      score += marksObtained;
      return { 
        ...ans, 
        isCorrect, 
        marksObtained,
        correctAnswer: question?.correctAnswer || '',
        explanation: question?.explanation || '',
        questionTitle: question?.questionTitle || '',
        options: question?.options || []
      };
    });

    const percentage = quiz.totalMarks > 0 ? Math.round((score / quiz.totalMarks) * 100) : 0;
    const result = await Result.create({
      userId: req.user.id, quizId, answers: evaluated,
      score, totalMarks: quiz.totalMarks, percentage, timeTaken,
      isPassed: score >= quiz.passingMarks, status: 'completed'
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalScore: score, quizzesAttempted: 1 }
    });
    await Quiz.findByIdAndUpdate(quizId, { $inc: { attempts: 1 } });

    res.status(201).json({ success: true, result });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// @GET /api/results/my - Get current user's results
router.get('/my', protect, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id })
      .populate('quizId', 'title difficulty totalMarks')
      .sort('-submittedAt');
    res.json({ success: true, results });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// @GET /api/results/leaderboard - Top scorers
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const { quizId, limit = 10 } = req.query;
    const match = quizId ? { quizId } : {};
    const leaders = await Result.find(match)
      .populate('userId', 'name avatar')
      .populate('quizId', 'title')
      .sort('-score timeTaken')
      .limit(Number(limit));
    res.json({ success: true, leaders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// @GET /api/results/analytics - Admin dashboard analytics
router.get('/analytics', protect, authorize('admin'), async (req, res) => {
  try {
    const PaperSet = require('../models/PaperSet');
    const Question = require('../models/Question');
    
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalPaperSets = await PaperSet.countDocuments({ isActive: true });
    const totalQuestions = await Question.countDocuments();
    const totalAttempts = await Result.countDocuments();
    
    // Aggregates for student overview
    const students = await User.find({ role: 'student' })
      .select('name email totalScore quizzesAttempted lastLogin isActive')
      .sort('-totalScore -quizzesAttempted')
      .limit(50); // Top 50 students

    const avgScoreData = await Result.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$percentage' } } }
    ]);
    const avgScore = avgScoreData[0]?.avgScore?.toFixed(1) || 0;
    
    const recentResults = await Result.find()
      .populate('userId', 'name').populate('quizId', 'title')
      .populate('paperSetId', 'name')
      .sort('-submittedAt').limit(10);

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalQuizzes: totalPaperSets, // Updated to show paper sets
        totalQuestions,
        totalAttempts,
        avgScore,
        recentResults,
        students
      }
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// @GET /api/results/questions - Admin questions management
router.get('/questions', protect, authorize('admin'), async (req, res) => {
  try {
    const Question = require('../models/Question');
    const PaperSet = require('../models/PaperSet');
    
    const questions = await Question.find({})
      .populate('paperSets', 'name category')
      .sort('-createdAt');
    
    const paperSets = await PaperSet.find({ isActive: true })
      .select('name category totalQuestions difficulty');
    
    res.json({
      success: true,
      questions,
      paperSets,
      summary: {
        totalQuestions: questions.length,
        totalPaperSets: paperSets.length,
        byTopic: questions.reduce((acc, q) => {
          acc[q.topic] = (acc[q.topic] || 0) + 1;
          return acc;
        }, {}),
        byDifficulty: questions.reduce((acc, q) => {
          acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
          return acc;
        }, {})
      }
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// @GET /api/results/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quizId').populate('userId', 'name avatar');
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
    res.json({ success: true, result });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
