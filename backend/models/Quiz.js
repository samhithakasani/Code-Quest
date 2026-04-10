const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'mixed'], default: 'mixed' },
  timeLimit: { type: Number, default: 30 }, // minutes
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  totalMarks: { type: Number, default: 0 },
  passingMarks: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublished: { type: Boolean, default: false },
  isRandomized: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  thumbnail: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);

