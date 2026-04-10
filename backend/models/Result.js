const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  userAnswer: { type: String, default: '' },
  isCorrect: { type: Boolean, default: false },
  marksObtained: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 },
  correctAnswer: { type: String, default: '' },
  explanation: { type: String, default: '' },
  questionTitle: { type: String, default: '' },   // stored for result display
  options: [{ type: String }],                      // stored for result display
});

const ResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paperSetId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaperSet' },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  attemptNumber: { type: Number, default: 1 }, // Track which attempt this is
  language: { type: String, default: '' }, // Language used for this attempt
  answers: [AnswerSchema],
  score: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 }, // total seconds
  isPassed: { type: Boolean, default: false },
  rank: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['completed', 'auto_submitted', 'in_progress'], default: 'completed' },
  questionsUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], // Track which questions were used
  wasRetake: { type: Boolean, default: false }, // Flag to identify if this was a retake
  previousAttemptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Result' }, // Reference to previous attempt
}, { timestamps: true });

module.exports = mongoose.model('Result', ResultSchema);
