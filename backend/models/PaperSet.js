const mongoose = require('mongoose');

const PaperSetSchema = new mongoose.Schema({
  name: { type: mongoose.Schema.Types.Mixed, required: true },
  description: { type: mongoose.Schema.Types.Mixed, default: '' },
  category: { type: String, default: 'General' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'mixed'], default: 'mixed' },
  languages: [{ type: String, default: ['English'] }],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  totalQuestions: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  passingMarks: { type: Number, default: 0 },
  timeLimit: { type: Number, default: 30 }, // minutes
  isActive: { type: Boolean, default: true },
  attempts: { type: Number, default: 0 },
  tags: [{ type: String }],
  thumbnail: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('PaperSet', PaperSetSchema);
