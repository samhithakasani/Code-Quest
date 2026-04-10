const Question = require('../models/Question');

exports.getQuestions = async (req, res) => {
  try {
    const { difficulty, type, topic, page = 1, limit = 20 } = req.query;
    const query = {};
    if (difficulty) query.difficulty = difficulty;
    if (type) query.type = type;
    if (topic) query.topic = { $regex: topic, $options: 'i' };
    const total = await Question.countDocuments(query);
    const questions = await Question.find(query).sort('-createdAt').skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, total, questions });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.json({ success: true, question });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createQuestion = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, question });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.json({ success: true, question });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Question deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
