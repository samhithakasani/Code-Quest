const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const LOCAL_URI = 'mongodb://localhost:27017';
const ATLAS_URI = process.env.MONGO_URI;

async function recoverLegacy() {
  const localClient = new MongoClient(LOCAL_URI);
  const atlasClient = new MongoClient(ATLAS_URI);

  try {
    await localClient.connect();
    await atlasClient.connect();
    console.log('Connected to legacy and cloud clusters');

    const sourceDb = localClient.db('quiz-management');
    const targetDb = atlasClient.db('codequestdb');

    const legacyQuizzesCol = sourceDb.collection('quizzes');
    const targetQuizzesCol = targetDb.collection('quizzes');
    const targetQuestionsCol = targetDb.collection('questions');

    const legacyQuizzes = await legacyQuizzesCol.find({}).toArray();
    console.log(`Found ${legacyQuizzes.length} legacy quizzes to process...`);

    let recoveredQuestionCount = 0;
    let recoveredQuizCount = 0;

    for (const lQuiz of legacyQuizzes) {
      if (!lQuiz.questions || !Array.isArray(lQuiz.questions)) continue;

      const newQuestionIds = [];

      for (const lQuest of lQuiz.questions) {
        // Map legacy question to new schema
        const options = lQuest.options || [];
        const correctIndex = typeof lQuest.correctAnswer === 'number' ? lQuest.correctAnswer : 0;
        const correctAnswerString = options[correctIndex] || (options[0] || 'Unknown');

        const newQuestion = {
          questionTitle: lQuest.question || 'Untitled Question',
          problemStatement: lQuest.question || 'Untitled Question',
          type: 'MCQ',
          difficulty: (lQuest.difficulty || lQuiz.difficulty || 'medium').toLowerCase(),
          topic: (lQuiz.category || 'General'),
          options: options,
          correctAnswer: correctAnswerString,
          explanation: lQuest.explanation || '',
          marks: 5,
          timeLimit: 30,
          languages: ['English'],
          createdBy: lQuiz.createdBy ? (typeof lQuiz.createdBy === 'string' ? new ObjectId(lQuiz.createdBy) : lQuiz.createdBy) : null,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await targetQuestionsCol.insertOne(newQuestion);
        newQuestionIds.push(result.insertedId);
        recoveredQuestionCount++;
      }

      // Create the Quiz in the new format
      const newQuiz = {
        title: lQuiz.title,
        description: lQuiz.description || '',
        category: lQuiz.category || 'General',
        difficulty: (lQuiz.difficulty || 'medium').toLowerCase(),
        timeLimit: lQuiz.timeLimit || 20,
        passingMarks: Math.ceil(newQuestionIds.length * 5 * 0.4),
        totalMarks: newQuestionIds.length * 5,
        questions: newQuestionIds,
        isPublished: true,
        isRandomized: true,
        createdBy: lQuiz.createdBy ? (typeof lQuiz.createdBy === 'string' ? new ObjectId(lQuiz.createdBy) : lQuiz.createdBy) : null,
        createdAt: lQuiz.createdAt || new Date(),
        updatedAt: lQuiz.updatedAt || new Date()
      };

      await targetQuizzesCol.insertOne(newQuiz);
      recoveredQuizCount++;
    }

    console.log('\n✅ DEEP RECOVERY COMPLETED!');
    console.log(`Recovered Quizzes: ${recoveredQuizCount}`);
    console.log(`Recovered Questions (Extracted from nested data): ${recoveredQuestionCount}`);

  } catch (err) {
    console.error('❌ Recovery Error:', err);
  } finally {
    await localClient.close();
    await atlasClient.close();
  }
}

recoverLegacy();
