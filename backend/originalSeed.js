const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedOriginalApp() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('samhitha@gmail.com', 12);
    const adminUser = await User.create({
      name: 'Samhitha',
      email: 'samhitha@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Create simple questions
    const questions = [
      {
        questionTitle: 'What is HTML?',
        problemStatement: 'HTML stands for HyperText Markup Language. It is used for creating web pages.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'HTML',
        options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
        correctAnswer: 'HyperText Markup Language',
        explanation: 'HTML stands for HyperText Markup Language and is the standard markup language for creating web pages.',
        marks: 5,
        timeLimit: 30,
        tags: ['HTML', 'Web Development'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'What is CSS?',
        problemStatement: 'CSS is used for styling web pages.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'CSS',
        options: ['Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 'Cascading Style Sheets',
        explanation: 'CSS stands for Cascading Style Sheets and is used to describe the presentation of HTML documents.',
        marks: 5,
        timeLimit: 30,
        tags: ['CSS', 'Web Development'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'What is JavaScript?',
        problemStatement: 'JavaScript is a programming language for web development.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'JavaScript',
        options: ['Java Script', 'JavaScript', 'JScript', 'ECMAScript'],
        correctAnswer: 'JavaScript',
        explanation: 'JavaScript is a programming language that enables interactive web pages.',
        marks: 5,
        timeLimit: 30,
        tags: ['JavaScript', 'Web Development'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'What is Python?',
        problemStatement: 'Python is a popular programming language.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'Python',
        options: ['A snake', 'A programming language', 'A framework', 'A database'],
        correctAnswer: 'A programming language',
        explanation: 'Python is a high-level programming language known for its simplicity and readability.',
        marks: 5,
        timeLimit: 30,
        tags: ['Python', 'Programming'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'What is React?',
        problemStatement: 'React is a JavaScript library for building user interfaces.',
        type: 'MCQ',
        difficulty: 'medium',
        topic: 'React',
        options: ['A database', 'A framework', 'A JavaScript library', 'An operating system'],
        correctAnswer: 'A JavaScript library',
        explanation: 'React is a JavaScript library for building user interfaces, particularly web applications.',
        marks: 5,
        timeLimit: 30,
        tags: ['React', 'JavaScript'],
        createdBy: adminUser._id
      }
    ];

    const createdQuestions = await Question.insertMany(questions);
    console.log('✅ Created simple questions:', createdQuestions.length);

    // Create simple quizzes
    const quizzes = [
      {
        title: 'Web Development Basics',
        description: 'Test your knowledge of HTML, CSS, and JavaScript',
        difficulty: 'easy',
        timeLimit: 15, // 15 minutes
        passingMarks: 60,
        questions: createdQuestions.slice(0, 3).map(q => q._id),
        totalMarks: createdQuestions.slice(0, 3).reduce((sum, q) => sum + q.marks, 0),
        isRandomized: true,
        createdBy: adminUser._id
      },
      {
        title: 'Programming Fundamentals',
        description: 'Test your knowledge of programming concepts',
        difficulty: 'medium',
        timeLimit: 20, // 20 minutes
        passingMarks: 70,
        questions: createdQuestions.slice(2, 5).map(q => q._id),
        totalMarks: createdQuestions.slice(2, 5).reduce((sum, q) => sum + q.marks, 0),
        isRandomized: true,
        createdBy: adminUser._id
      }
    ];

    const createdQuizzes = await Quiz.insertMany(quizzes);
    console.log('✅ Created simple quizzes:', createdQuizzes.length);

    console.log('🎉 Original app seeded successfully!');
    console.log('📚 Available Quizzes:');
    createdQuizzes.forEach((quiz, index) => {
      console.log(`  ${index + 1}. ${quiz.title} (${quiz.questions.length} questions)`);
    });
    console.log('👤 Admin User: samhitha@gmail.com / samhitha@gmail.com');

  } catch (error) {
    console.error('❌ Error seeding original app:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedOriginalApp();
