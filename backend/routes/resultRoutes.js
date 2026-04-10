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
    const Quiz = require('../models/Quiz');

    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalPaperSets = await PaperSet.countDocuments({ isActive: true });
    const totalPublishedQuizzes = await Quiz.countDocuments({ isPublished: true });
    const totalQuestions = await Question.countDocuments();
    const totalAttempts = await Result.countDocuments();

    // All students with registration date
    const students = await User.find({ role: 'student' })
      .select('name email totalScore quizzesAttempted lastLogin isActive createdAt')
      .sort('-createdAt')
      .limit(100);

    // Per-student attempt + marks from Results collection
    const studentResults = await Result.aggregate([
      { $group: {
          _id: '$userId',
          totalAttempts: { $sum: 1 },
          totalMarksEarned: { $sum: '$score' },
          totalMarksPossible: { $sum: '$totalMarks' },
          avgPercentage: { $avg: '$percentage' },
          passedCount: { $sum: { $cond: ['$isPassed', 1, 0] } },
          highestScore: { $max: '$percentage' },
      }}
    ]);
    const studentResultMap = {};
    studentResults.forEach(r => { studentResultMap[r._id ? r._id.toString() : ''] = r; });

    const enrichedStudents = students.map(s => {
      const r = studentResultMap[s._id.toString()] || {};
      return {
        _id: s._id,
        name: s.name,
        email: s.email,
        totalScore: s.totalScore,
        quizzesAttempted: r.totalAttempts || s.quizzesAttempted || 0,
        totalMarksEarned: r.totalMarksEarned || 0,
        totalMarksPossible: r.totalMarksPossible || 0,
        avgPercentage: r.avgPercentage ? parseFloat(r.avgPercentage.toFixed(1)) : 0,
        passedCount: r.passedCount || 0,
        highestScore: r.highestScore || 0,
        lastLogin: s.lastLogin,
        isActive: s.isActive,
        registeredAt: s.createdAt,
      };
    });

    // Score distribution 0-20,21-40,41-60,61-80,81-100
    const scoreDistRaw = await Result.aggregate([
      { $bucket: { groupBy: '$percentage', boundaries: [0, 21, 41, 61, 81, 101], default: 'Other', output: { count: { $sum: 1 } } } }
    ]);
    const scoreDist = [
      { label: '0-20%',  count: 0 }, { label: '21-40%', count: 0 },
      { label: '41-60%', count: 0 }, { label: '61-80%', count: 0 },
      { label: '81-100%',count: 0 },
    ];
    scoreDistRaw.forEach(b => {
      const idx = [0,21,41,61,81].indexOf(b._id);
      if (idx >= 0) scoreDist[idx].count = b.count;
    });

    // Registrations per day for last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRegistrations = await User.aggregate([
      { $match: { role: 'student', createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Top 5 quizzes by attempts
    const topQuizzes = await Result.aggregate([
      { $match: { quizId: { $ne: null } } },
      { $group: { _id: '$quizId', attempts: { $sum: 1 }, avgScore: { $avg: '$percentage' } } },
      { $sort: { attempts: -1 } }, { $limit: 5 },
      { $lookup: { from: 'quizzes', localField: '_id', foreignField: '_id', as: 'quiz' } },
      { $unwind: { path: '$quiz', preserveNullAndEmptyArrays: true } },
      { $project: { title: { $ifNull: ['$quiz.title', 'Unknown'] }, category: { $ifNull: ['$quiz.category', ''] }, attempts: 1, avgScore: { $round: ['$avgScore', 1] } } }
    ]);

    const avgScoreData = await Result.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$percentage' }, totalPassed: { $sum: { $cond: ['$isPassed', 1, 0] } } } }
    ]);
    const avgScore = avgScoreData[0]?.avgScore ? parseFloat(avgScoreData[0].avgScore.toFixed(1)) : 0;
    const totalPassed = avgScoreData[0]?.totalPassed || 0;
    const passRate = totalAttempts > 0 ? parseFloat(((totalPassed / totalAttempts) * 100).toFixed(1)) : 0;

    const recentResults = await Result.find()
      .populate('userId', 'name').populate('quizId', 'title')
      .populate('paperSetId', 'name')
      .sort('-submittedAt').limit(10);

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalQuizzes: totalPaperSets + totalPublishedQuizzes,
        totalQuestions,
        totalAttempts,
        avgScore,
        passRate,
        totalPassed,
        scoreDist,
        recentRegistrations,
        topQuizzes,
        recentResults,
        students: enrichedStudents
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
