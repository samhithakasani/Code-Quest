const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedSimpleApp() {
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

    // Create simple questions with multi-language support
    const questions = [
      {
        questionTitle: new Map([['English', 'What is HTML?']]),
        problemStatement: new Map([['English', 'HTML stands for HyperText Markup Language. It is used for creating web pages.']]),
        type: 'mcq',
        difficulty: 'easy',
        topic: 'HTML',
        options: new Map([['English', ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language']]]),
        correctAnswer: new Map([['English', 'HyperText Markup Language']]),
        explanation: new Map([['English', 'HTML stands for HyperText Markup Language and is the standard markup language for creating web pages.']]),
        marks: 5,
        languages: ['English'],
        tags: ['HTML', 'Web Development']
      },
      {
        questionTitle: new Map([['English', 'What is CSS?']]),
        problemStatement: new Map([['English', 'CSS is used for styling web pages.']]),
        type: 'mcq',
        difficulty: 'easy',
        topic: 'CSS',
        options: new Map([['English', ['Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets']]]),
        correctAnswer: new Map([['English', 'Cascading Style Sheets']]),
        explanation: new Map([['English', 'CSS stands for Cascading Style Sheets and is used to describe the presentation of HTML documents.']]),
        marks: 5,
        languages: ['English'],
        tags: ['CSS', 'Web Development']
      },
      {
        questionTitle: new Map([['English', 'What is JavaScript?']]),
        problemStatement: new Map([['English', 'JavaScript is a programming language for web development.']]),
        type: 'mcq',
        difficulty: 'easy',
        topic: 'JavaScript',
        options: new Map([['English', ['Java Script', 'JavaScript', 'JScript', 'ECMAScript']]]),
        correctAnswer: new Map([['English', 'JavaScript']]),
        explanation: new Map([['English', 'JavaScript is a programming language that enables interactive web pages.']]),
        marks: 5,
        languages: ['English'],
        tags: ['JavaScript', 'Web Development']
      },
      {
        questionTitle: new Map([['English', 'What is Python?']]),
        problemStatement: new Map([['English', 'Python is a popular programming language.']]),
        type: 'mcq',
        difficulty: 'easy',
        topic: 'Python',
        options: new Map([['English', ['A snake', 'A programming language', 'A framework', 'A database']]]),
        correctAnswer: new Map([['English', 'A programming language']]),
        explanation: new Map([['English', 'Python is a high-level programming language known for its simplicity and readability.']]),
        marks: 5,
        languages: ['English'],
        tags: ['Python', 'Programming']
      },
      {
        questionTitle: new Map([['English', 'What is React?']]),
        problemStatement: new Map([['English', 'React is a JavaScript library for building user interfaces.']]),
        type: 'mcq',
        difficulty: 'medium',
        topic: 'React',
        options: new Map([['English', ['A database', 'A framework', 'A JavaScript library', 'An operating system']]]),
        correctAnswer: new Map([['English', 'A JavaScript library']]),
        explanation: new Map([['English', 'React is a JavaScript library for building user interfaces, particularly web applications.']]),
        marks: 5,
        languages: ['English'],
        tags: ['React', 'JavaScript']
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

    console.log('🎉 Simple app seeded successfully!');
    console.log('📚 Available Quizzes:');
    createdQuizzes.forEach((quiz, index) => {
      console.log(`  ${index + 1}. ${quiz.title} (${quiz.questions.length} questions)`);
    });
    console.log('👤 Admin User: samhitha@gmail.com / samhitha@gmail.com');

  } catch (error) {
    console.error('❌ Error seeding simple app:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedSimpleApp();
