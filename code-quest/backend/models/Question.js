const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
  input: { type: String, default: '' },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
});

const QuestionSchema = new mongoose.Schema({
  questionTitle: { type: String, required: true },
  problemStatement: { type: String, required: true },
  type: { type: String, enum: ['MCQ', 'mcq', 'code_output', 'coding_challenge'], default: 'MCQ' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  topic: { type: String, default: 'General' },
  options: [String], // For MCQ questions
  correctAnswer: { type: String, required: true },
  inputFormat: { type: String, default: '' }, // For coding challenges
  outputFormat: { type: String, default: '' }, // For coding challenges
  sampleInput: { type: String, default: '' }, // For coding challenges
  sampleOutput: { type: String, default: '' }, // For coding challenges
  testCases: [TestCaseSchema], // For coding challenges
  explanation: { type: String, default: '' },
  marks: { type: Number, default: 10 },
  timeLimit: { type: Number, default: 30 }, // in seconds
  tags: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
