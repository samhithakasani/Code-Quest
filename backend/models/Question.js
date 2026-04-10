const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
  input: { type: String, default: '' },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
});

const QuestionSchema = new mongoose.Schema({
  questionTitle: { type: mongoose.Schema.Types.Mixed, required: true },
  problemStatement: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, enum: ['MCQ', 'mcq', 'code_output', 'coding_challenge'], default: 'MCQ' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  topic: { type: String, default: 'General' },
  options: mongoose.Schema.Types.Mixed, // For MCQ questions
  correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
  inputFormat: { type: String, default: '' },
  outputFormat: { type: String, default: '' },
  sampleInput: { type: String, default: '' },
  sampleOutput: { type: String, default: '' },
  testCases: [TestCaseSchema],
  explanation: { type: mongoose.Schema.Types.Mixed, default: '' },
  marks: { type: Number, default: 10 },
  timeLimit: { type: Number, default: 30 },
  tags: [{ type: String }],
  languages: [{ type: String, default: ['English'] }],
  paperSets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PaperSet' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Helper to get English content for frontend compatibility
const getEnglish = (field) => {
  if (typeof field === 'string') return field;
  if (field instanceof Map) return field.get('English');
  if (typeof field === 'object' && field !== null) {
    return field.English || field.english || Object.values(field)[0];
  }
  return field;
};

QuestionSchema.virtual('displayTitle').get(function() { return getEnglish(this.questionTitle); });
QuestionSchema.virtual('displayStatement').get(function() { return getEnglish(this.problemStatement); });

module.exports = mongoose.model('Question', QuestionSchema);
