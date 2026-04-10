const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// @GET /api/quizzes - Get all published quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const { difficulty, category, page = 1, limit = 12 } = req.query;
    const query = { isPublished: true };
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    const total = await Quiz.countDocuments(query);
    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'name')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, quizzes });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// @GET /api/quizzes/admin - Admin: all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'name').sort('-createdAt');
    res.json({ success: true, quizzes });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// @GET /api/quizzes/:id
exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    // Jumble questions if randomization is enabled
    if (quiz.isRandomized) {
      quiz.questions = quiz.questions.sort(() => Math.random() - 0.5);
    }

    res.json({ success: true, quiz });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// @POST /api/quizzes - Admin create quiz
exports.createQuiz = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ success: true, quiz });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// @PUT /api/quizzes/:id
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, quiz });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// @DELETE /api/quizzes/:id
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// @POST /api/quizzes/:id/publish
exports.togglePublish = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    quiz.isPublished = !quiz.isPublished;
    await quiz.save();
    res.json({ success: true, isPublished: quiz.isPublished });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// @POST /api/quizzes/:id/questions - Add question to quiz
exports.addQuestionToQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    req.body.createdBy = req.user.id;
    const question = await Question.create(req.body);
    quiz.questions.push(question._id);
    await quiz.save();
    res.status(201).json({ success: true, question, quiz });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
