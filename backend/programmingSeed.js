const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedProgrammingApp() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@quiz.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Create comprehensive programming questions
    const questions = [
      // HTML Questions
      {
        questionTitle: 'What does HTML stand for?',
        problemStatement: 'HTML is the standard markup language for creating web pages.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'HTML',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlinks and Text Markup Language'
        ],
        correctAnswer: 'Hyper Text Markup Language',
        explanation: 'HTML stands for Hyper Text Markup Language.',
        marks: 5,
        timeLimit: 30,
        tags: ['HTML', 'Web Development'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'Which HTML tag is used for the largest heading?',
        problemStatement: 'HTML provides different heading levels from h1 to h6.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'HTML',
        options: ['<h6>', '<h10>', '<h1>', '<heading>'],
        correctAnswer: '<h1>',
        explanation: '<h1> is the largest heading tag in HTML.',
        marks: 5,
        timeLimit: 30,
        tags: ['HTML', 'Web Development'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'Which attribute is used to provide a unique identity to an HTML element?',
        problemStatement: 'HTML elements can have unique identifiers for CSS and JavaScript targeting.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'HTML',
        options: ['class', 'id', 'name', 'unique'],
        correctAnswer: 'id',
        explanation: 'The id attribute provides a unique identity to an HTML element.',
        marks: 5,
        timeLimit: 30,
        tags: ['HTML', 'Web Development'],
        createdBy: adminUser._id
      },

      // CSS Questions
      {
        questionTitle: 'What does CSS stand for?',
        problemStatement: 'CSS is used to style HTML elements.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'CSS',
        options: [
          'Computer Style Sheets',
          'Creative Style Sheets',
          'Cascading Style Sheets',
          'Colorful Style Sheets'
        ],
        correctAnswer: 'Cascading Style Sheets',
        explanation: 'CSS stands for Cascading Style Sheets.',
        marks: 5,
        timeLimit: 30,
        tags: ['CSS', 'Web Development'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'Which CSS property is used to change the text color of an element?',
        problemStatement: 'CSS provides various properties to style text.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'CSS',
        options: ['text-color', 'color', 'font-color', 'text-style'],
        correctAnswer: 'color',
        explanation: 'The color property is used to change the text color.',
        marks: 5,
        timeLimit: 30,
        tags: ['CSS', 'Web Development'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'Which CSS property is used to change the background color?',
        problemStatement: 'CSS allows you to style the background of elements.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'CSS',
        options: ['bgcolor', 'background-color', 'color', 'background'],
        correctAnswer: 'background-color',
        explanation: 'The background-color property sets the background color.',
        marks: 5,
        timeLimit: 30,
        tags: ['CSS', 'Web Development'],
        createdBy: adminUser._id
      },

      // JavaScript Questions
      {
        questionTitle: 'Which company developed JavaScript?',
        problemStatement: 'JavaScript was created by a company to make web pages interactive.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'JavaScript',
        options: ['Microsoft', 'Netscape', 'Sun Microsystems', 'Google'],
        correctAnswer: 'Netscape',
        explanation: 'JavaScript was developed by Netscape in 1995.',
        marks: 5,
        timeLimit: 30,
        tags: ['JavaScript', 'Web Development'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'What is the correct syntax for referring to an external script called "script.js"?',
        problemStatement: 'External JavaScript files can be linked to HTML documents.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'JavaScript',
        options: [
          '<script href="script.js">',
          '<script name="script.js">',
          '<script src="script.js">',
          '<script file="script.js">'
        ],
        correctAnswer: '<script src="script.js">',
        explanation: 'The src attribute is used to reference external JavaScript files.',
        marks: 5,
        timeLimit: 30,
        tags: ['JavaScript', 'Web Development'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'How do you create a function in JavaScript?',
        problemStatement: 'Functions are reusable blocks of code in JavaScript.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'JavaScript',
        options: [
          'function = myFunction() {}',
          'function myFunction() {}',
          'function:myFunction() {}',
          'create myFunction() {}'
        ],
        correctAnswer: 'function myFunction() {}',
        explanation: 'Functions are declared using the function keyword followed by the function name.',
        marks: 5,
        timeLimit: 30,
        tags: ['JavaScript', 'Web Development'],
        createdBy: adminUser._id
      },

      // Python Questions
      {
        questionTitle: 'Who created Python?',
        problemStatement: 'Python was created by a programmer who wanted a simple language.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'Python',
        options: ['Guido van Rossum', 'James Gosling', 'Dennis Ritchie', 'Bjarne Stroustrup'],
        correctAnswer: 'Guido van Rossum',
        explanation: 'Python was created by Guido van Rossum in 1991.',
        marks: 5,
        timeLimit: 30,
        tags: ['Python', 'Programming'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'Which keyword is used to create a function in Python?',
        problemStatement: 'Python uses a specific keyword to define functions.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'Python',
        options: ['function', 'def', 'func', 'define'],
        correctAnswer: 'def',
        explanation: 'The def keyword is used to create functions in Python.',
        marks: 5,
        timeLimit: 30,
        tags: ['Python', 'Programming'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'How do you start a comment in Python?',
        problemStatement: 'Comments are used to explain code and are ignored by the interpreter.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'Python',
        options: ['//', '#', '/*', '--'],
        correctAnswer: '#',
        explanation: 'Python uses the # symbol to start single-line comments.',
        marks: 5,
        timeLimit: 30,
        tags: ['Python', 'Programming'],
        createdBy: adminUser._id
      },

      // Java Questions
      {
        questionTitle: 'Who developed Java?',
        problemStatement: 'Java was developed by a company in the mid-1990s.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'Java',
        options: ['Microsoft', 'Sun Microsystems', 'IBM', 'Oracle'],
        correctAnswer: 'Sun Microsystems',
        explanation: 'Java was developed by Sun Microsystems in 1995.',
        marks: 5,
        timeLimit: 30,
        tags: ['Java', 'Programming'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'What is the extension of Java source files?',
        problemStatement: 'Java source files have a specific file extension.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'Java',
        options: ['.java', '.jav', '.class', '.j'],
        correctAnswer: '.java',
        explanation: 'Java source files have the .java extension.',
        marks: 5,
        timeLimit: 30,
        tags: ['Java', 'Programming'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'Which method is the entry point of a Java application?',
        problemStatement: 'Every Java application starts execution from a specific method.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'Java',
        options: [
          'public static void main()',
          'public void main()',
          'static void main()',
          'public static void main(String[] args)'
        ],
        correctAnswer: 'public static void main(String[] args)',
        explanation: 'The main method with String array parameter is the entry point.',
        marks: 5,
        timeLimit: 30,
        tags: ['Java', 'Programming'],
        createdBy: adminUser._id
      },

      // C++ Questions
      {
        questionTitle: 'Who developed C++?',
        problemStatement: 'C++ was developed as an extension of the C programming language.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'C++',
        options: ['Bjarne Stroustrup', 'Dennis Ritchie', 'Ken Thompson', 'Linus Torvalds'],
        correctAnswer: 'Bjarne Stroustrup',
        explanation: 'C++ was developed by Bjarne Stroustrup in 1985.',
        marks: 5,
        timeLimit: 30,
        tags: ['C++', 'Programming'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'Which operator is used to allocate memory dynamically in C++?',
        problemStatement: 'C++ provides operators for dynamic memory allocation.',
        type: 'MCQ',
        difficulty: 'medium',
        topic: 'C++',
        options: ['new', 'malloc', 'alloc', 'create'],
        correctAnswer: 'new',
        explanation: 'The new operator is used to allocate memory dynamically in C++.',
        marks: 5,
        timeLimit: 30,
        tags: ['C++', 'Programming'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'What is the correct way to declare a pointer in C++?',
        problemStatement: 'Pointers are variables that store memory addresses.',
        type: 'MCQ',
        difficulty: 'medium',
        topic: 'C++',
        options: ['int ptr;', 'int *ptr;', 'pointer int ptr;', 'ptr int;'],
        correctAnswer: 'int *ptr;',
        explanation: 'Pointers are declared using the asterisk (*) symbol.',
        marks: 5,
        timeLimit: 30,
        tags: ['C++', 'Programming'],
        createdBy: adminUser._id
      },

      // SQL Questions
      {
        questionTitle: 'What does SQL stand for?',
        problemStatement: 'SQL is the standard language for relational databases.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'SQL',
        options: [
          'Structured Query Language',
          'Simple Query Language',
          'Standard Query Language',
          'System Query Language'
        ],
        correctAnswer: 'Structured Query Language',
        explanation: 'SQL stands for Structured Query Language.',
        marks: 5,
        timeLimit: 30,
        tags: ['SQL', 'Database'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'Which SQL statement is used to extract data from a database?',
        problemStatement: 'SQL provides different statements for database operations.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'SQL',
        options: ['GET', 'EXTRACT', 'SELECT', 'OPEN'],
        correctAnswer: 'SELECT',
        explanation: 'The SELECT statement is used to extract data from databases.',
        marks: 5,
        timeLimit: 30,
        tags: ['SQL', 'Database'],
        createdBy: adminUser._id
      },
      {
        questionTitle: 'Which SQL statement is used to update data in a database?',
        problemStatement: 'SQL allows modification of existing data.',
        type: 'MCQ',
        difficulty: 'easy',
        topic: 'SQL',
        options: ['MODIFY', 'UPDATE', 'CHANGE', 'ALTER'],
        correctAnswer: 'UPDATE',
        explanation: 'The UPDATE statement is used to modify existing data.',
        marks: 5,
        timeLimit: 30,
        tags: ['SQL', 'Database'],
        createdBy: adminUser._id
      }
    ];

    const createdQuestions = await Question.insertMany(questions);
    console.log('✅ Created programming questions:', createdQuestions.length);

    // Create comprehensive quizzes
    const quizzes = [
      {
        title: 'HTML Fundamentals',
        description: 'Test your knowledge of HTML basics and web structure',
        difficulty: 'easy',
        timeLimit: 10, // 10 minutes
        passingMarks: 60,
        questions: createdQuestions.filter(q => q.topic === 'HTML').map(q => q._id),
        totalMarks: createdQuestions.filter(q => q.topic === 'HTML').reduce((sum, q) => sum + q.marks, 0),
        isRandomized: false,
        isPublished: true,
        createdBy: adminUser._id
      },
      {
        title: 'CSS Styling',
        description: 'Test your CSS styling and layout skills',
        difficulty: 'easy',
        timeLimit: 10,
        passingMarks: 60,
        questions: createdQuestions.filter(q => q.topic === 'CSS').map(q => q._id),
        totalMarks: createdQuestions.filter(q => q.topic === 'CSS').reduce((sum, q) => sum + q.marks, 0),
        isRandomized: false,
        isPublished: true,
        createdBy: adminUser._id
      },
      {
        title: 'JavaScript Programming',
        description: 'Test your JavaScript programming knowledge',
        difficulty: 'easy',
        timeLimit: 15,
        passingMarks: 60,
        questions: createdQuestions.filter(q => q.topic === 'JavaScript').map(q => q._id),
        totalMarks: createdQuestions.filter(q => q.topic === 'JavaScript').reduce((sum, q) => sum + q.marks, 0),
        isRandomized: false,
        isPublished: true,
        createdBy: adminUser._id
      },
      {
        title: 'Python Programming',
        description: 'Test your Python programming skills',
        difficulty: 'easy',
        timeLimit: 15,
        passingMarks: 60,
        questions: createdQuestions.filter(q => q.topic === 'Python').map(q => q._id),
        totalMarks: createdQuestions.filter(q => q.topic === 'Python').reduce((sum, q) => sum + q.marks, 0),
        isRandomized: false,
        isPublished: true,
        createdBy: adminUser._id
      },
      {
        title: 'Java Programming',
        description: 'Test your Java programming knowledge',
        difficulty: 'easy',
        timeLimit: 15,
        passingMarks: 60,
        questions: createdQuestions.filter(q => q.topic === 'Java').map(q => q._id),
        totalMarks: createdQuestions.filter(q => q.topic === 'Java').reduce((sum, q) => sum + q.marks, 0),
        isRandomized: false,
        isPublished: true,
        createdBy: adminUser._id
      },
      {
        title: 'C++ Programming',
        description: 'Test your C++ programming skills including pointers',
        difficulty: 'medium',
        timeLimit: 20,
        passingMarks: 60,
        questions: createdQuestions.filter(q => q.topic === 'C++').map(q => q._id),
        totalMarks: createdQuestions.filter(q => q.topic === 'C++').reduce((sum, q) => sum + q.marks, 0),
        isRandomized: false,
        isPublished: true,
        createdBy: adminUser._id
      },
      {
        title: 'SQL Database Queries',
        description: 'Test your SQL and database knowledge',
        difficulty: 'easy',
        timeLimit: 15,
        passingMarks: 60,
        questions: createdQuestions.filter(q => q.topic === 'SQL').map(q => q._id),
        totalMarks: createdQuestions.filter(q => q.topic === 'SQL').reduce((sum, q) => sum + q.marks, 0),
        isRandomized: false,
        isPublished: true,
        createdBy: adminUser._id
      },
      {
        title: 'Web Development Complete',
        description: 'Comprehensive test of HTML, CSS, and JavaScript',
        difficulty: 'medium',
        timeLimit: 30,
        passingMarks: 70,
        questions: createdQuestions.filter(q => ['HTML', 'CSS', 'JavaScript'].includes(q.topic)).map(q => q._id),
        totalMarks: createdQuestions.filter(q => ['HTML', 'CSS', 'JavaScript'].includes(q.topic)).reduce((sum, q) => sum + q.marks, 0),
        isRandomized: true,
        isPublished: true,
        createdBy: adminUser._id
      },
      {
        title: 'Programming Languages Mega Test',
        description: 'Test your knowledge of multiple programming languages',
        difficulty: 'hard',
        timeLimit: 45,
        passingMarks: 75,
        questions: createdQuestions.filter(q => ['Python', 'Java', 'C++'].includes(q.topic)).map(q => q._id),
        totalMarks: createdQuestions.filter(q => ['Python', 'Java', 'C++'].includes(q.topic)).reduce((sum, q) => sum + q.marks, 0),
        isRandomized: true,
        isPublished: true,
        createdBy: adminUser._id
      },
      {
        title: 'Complete Programming Challenge',
        description: 'Ultimate test covering all programming topics',
        difficulty: 'hard',
        timeLimit: 60,
        passingMarks: 80,
        questions: createdQuestions.map(q => q._id),
        totalMarks: createdQuestions.reduce((sum, q) => sum + q.marks, 0),
        isRandomized: true,
        isPublished: true,
        createdBy: adminUser._id
      }
    ];

    const createdQuizzes = await Quiz.insertMany(quizzes);
    console.log('✅ Created programming quizzes:', createdQuizzes.length);

    console.log('🎉 Programming quiz app seeded successfully!');
    console.log('📚 Available Quizzes:');
    createdQuizzes.forEach((quiz, index) => {
      console.log(`  ${index + 1}. ${quiz.title} (${quiz.questions.length} questions, ${quiz.timeLimit} minutes)`);
    });
    console.log('👤 Admin User: admin@quiz.com / admin123');
    console.log('🔢 Total Questions:', createdQuestions.length);
    console.log('🎯 Topics Covered: HTML, CSS, JavaScript, Python, Java, C++, SQL');

  } catch (error) {
    console.error('❌ Error seeding programming app:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedProgrammingApp();
