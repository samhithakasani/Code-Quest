require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/codequestdb';

const easyQuizData = [
  {
    quiz: {
      title: 'HTML Basics – Easy Starter',
      description: 'Test your fundamental HTML knowledge. Perfect for beginners just starting web development!',
      difficulty: 'easy',
      category: 'HTML',
      timeLimit: 15,
      isPublished: true,
      isRandomized: false,
      tags: ['html', 'beginner', 'web'],
    },
    questions: [
      {
        questionTitle: 'What does HTML stand for?',
        problemStatement: 'Choose the correct full form of HTML.',
        type: 'MCQ', difficulty: 'easy', topic: 'HTML', marks: 5,
        options: ['Hyper Text Markup Language', 'High Text Machine Language', 'Hyperlinks and Text Markup Language', 'Home Tool Markup Language'],
        correctAnswer: 'Hyper Text Markup Language',
        explanation: 'HTML stands for Hyper Text Markup Language, the standard language for creating web pages.'
      },
      {
        questionTitle: 'Which tag is used for the largest heading?',
        problemStatement: 'Select the HTML tag that produces the largest heading.',
        type: 'MCQ', difficulty: 'easy', topic: 'HTML', marks: 5,
        options: ['<h6>', '<heading>', '<h1>', '<head>'],
        correctAnswer: '<h1>',
        explanation: '<h1> defines the largest/most important heading. <h6> defines the smallest.'
      },
      {
        questionTitle: 'Which HTML tag creates a hyperlink?',
        problemStatement: 'Which tag is used to create a clickable link in HTML?',
        type: 'MCQ', difficulty: 'easy', topic: 'HTML', marks: 5,
        options: ['<link>', '<a>', '<href>', '<url>'],
        correctAnswer: '<a>',
        explanation: 'The <a> (anchor) tag is used to create hyperlinks in HTML using the href attribute.'
      },
      {
        questionTitle: 'What is the correct HTML tag for inserting a line break?',
        problemStatement: 'Which tag inserts a single line break in HTML?',
        type: 'MCQ', difficulty: 'easy', topic: 'HTML', marks: 5,
        options: ['<break>', '<lb>', '<br>', '<newline>'],
        correctAnswer: '<br>',
        explanation: '<br> is a self-closing tag that inserts a line break in HTML.'
      },
      {
        questionTitle: 'Which attribute specifies the URL of an image?',
        problemStatement: 'What attribute of the <img> tag specifies the image source URL?',
        type: 'MCQ', difficulty: 'easy', topic: 'HTML', marks: 5,
        options: ['href', 'link', 'src', 'url'],
        correctAnswer: 'src',
        explanation: 'The src (source) attribute specifies the URL/path of the image to be displayed.'
      },
    ]
  },
  {
    quiz: {
      title: 'CSS Fundamentals – Easy',
      description: 'Get started with CSS styling. Learn colors, fonts, and basic box model concepts!',
      difficulty: 'easy',
      category: 'CSS',
      timeLimit: 15,
      isPublished: true,
      isRandomized: false,
      tags: ['css', 'beginner', 'styling'],
    },
    questions: [
      {
        questionTitle: 'What does CSS stand for?',
        problemStatement: 'Choose the correct full form of CSS.',
        type: 'MCQ', difficulty: 'easy', topic: 'CSS', marks: 5,
        options: ['Colorful Style Sheets', 'Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets'],
        correctAnswer: 'Cascading Style Sheets',
        explanation: 'CSS stands for Cascading Style Sheets — it describes how HTML elements are displayed.'
      },
      {
        questionTitle: 'Which property changes text color in CSS?',
        problemStatement: 'Select the correct CSS property to set the text color.',
        type: 'MCQ', difficulty: 'easy', topic: 'CSS', marks: 5,
        options: ['font-color', 'text-color', 'color', 'bg-color'],
        correctAnswer: 'color',
        explanation: 'The `color` property sets the foreground color of the text in CSS.'
      },
      {
        questionTitle: 'How do you add a background color in CSS?',
        problemStatement: 'Which CSS property sets the background color of an element?',
        type: 'MCQ', difficulty: 'easy', topic: 'CSS', marks: 5,
        options: ['color-background', 'bgcolor', 'background-color', 'back-color'],
        correctAnswer: 'background-color',
        explanation: 'The `background-color` property sets the background color of an HTML element.'
      },
      {
        questionTitle: 'Which CSS property controls font size?',
        problemStatement: 'Select the property that changes the size of text.',
        type: 'MCQ', difficulty: 'easy', topic: 'CSS', marks: 5,
        options: ['text-size', 'size', 'font-size', 'text-style'],
        correctAnswer: 'font-size',
        explanation: 'The `font-size` property sets the size of the text.'
      },
      {
        questionTitle: 'How do you select an element with id "demo" in CSS?',
        problemStatement: 'Which selector targets an HTML element with id="demo"?',
        type: 'MCQ', difficulty: 'easy', topic: 'CSS', marks: 5,
        options: ['.demo', '#demo', 'demo', '*demo'],
        correctAnswer: '#demo',
        explanation: 'The # symbol is used to select an element by its id. Class selectors use a dot (.).'
      },
    ]
  },
  {
    quiz: {
      title: 'JavaScript Basics – Easy Intro',
      description: 'Learn the very basics of JavaScript — variables, data types, and simple operations.',
      difficulty: 'easy',
      category: 'JavaScript',
      timeLimit: 15,
      isPublished: true,
      isRandomized: false,
      tags: ['javascript', 'beginner', 'programming'],
    },
    questions: [
      {
        questionTitle: 'Which keyword declares a variable in modern JavaScript?',
        problemStatement: 'Which of the following is the recommended modern way to declare a variable in JavaScript?',
        type: 'MCQ', difficulty: 'easy', topic: 'JavaScript', marks: 5,
        options: ['var', 'let', 'variable', 'declare'],
        correctAnswer: 'let',
        explanation: '`let` is the modern block-scoped variable declaration. `var` is older and function-scoped.'
      },
      {
        questionTitle: 'What does console.log() do?',
        problemStatement: 'What is the effect of calling console.log("Hello") in JavaScript?',
        type: 'MCQ', difficulty: 'easy', topic: 'JavaScript', marks: 5,
        options: ['Displays an alert box', 'Writes to the browser console', 'Creates a pop-up window', 'Returns a value'],
        correctAnswer: 'Writes to the browser console',
        explanation: 'console.log() outputs messages to the browser\'s developer console for debugging.'
      },
      {
        questionTitle: 'Which symbol is used for single-line comments in JavaScript?',
        problemStatement: 'How do you write a single-line comment in JavaScript?',
        type: 'MCQ', difficulty: 'easy', topic: 'JavaScript', marks: 5,
        options: ['/* comment */', '// comment', '# comment', '<!-- comment -->'],
        correctAnswer: '// comment',
        explanation: 'In JavaScript, single-line comments use // and multi-line comments use /* */.'
      },
      {
        questionTitle: 'What is the output of: typeof "hello"?',
        problemStatement: 'What does the typeof operator return when applied to the string "hello"?',
        type: 'MCQ', difficulty: 'easy', topic: 'JavaScript', marks: 5,
        options: ['"text"', '"string"', '"char"', '"word"'],
        correctAnswer: '"string"',
        explanation: 'The typeof operator returns a string describing the type. For text values, it returns "string".'
      },
      {
        questionTitle: 'How do you write an if statement in JavaScript?',
        problemStatement: 'Which syntax is correct for an if statement in JavaScript?',
        type: 'MCQ', difficulty: 'easy', topic: 'JavaScript', marks: 5,
        options: ['if x > 5 then', 'if (x > 5)', 'if x > 5:', 'if [x > 5]'],
        correctAnswer: 'if (x > 5)',
        explanation: 'In JavaScript, if statements require the condition to be wrapped in parentheses: if (condition) { ... }'
      },
    ]
  },
  {
    quiz: {
      title: 'Python Beginner – Easy Start',
      description: 'Python made simple! Test your knowledge of Python basics — syntax, print, and data types.',
      difficulty: 'easy',
      category: 'Python',
      timeLimit: 15,
      isPublished: true,
      isRandomized: false,
      tags: ['python', 'beginner', 'programming'],
    },
    questions: [
      {
        questionTitle: 'How do you print "Hello" in Python?',
        problemStatement: 'Which statement correctly prints "Hello" to the console in Python?',
        type: 'MCQ', difficulty: 'easy', topic: 'Python', marks: 5,
        options: ['echo "Hello"', 'console.log("Hello")', 'print("Hello")', 'System.out.println("Hello")'],
        correctAnswer: 'print("Hello")',
        explanation: 'In Python, the built-in print() function is used to output text to the console.'
      },
      {
        questionTitle: 'Which symbol starts a comment in Python?',
        problemStatement: 'What character is used to write a single-line comment in Python?',
        type: 'MCQ', difficulty: 'easy', topic: 'Python', marks: 5,
        options: ['//', '#', '/*', '--'],
        correctAnswer: '#',
        explanation: 'In Python, the # symbol starts a single-line comment that the interpreter ignores.'
      },
      {
        questionTitle: 'What is the result of: 10 // 3 in Python?',
        problemStatement: 'What does the floor division operator (//) return for 10 // 3?',
        type: 'MCQ', difficulty: 'easy', topic: 'Python', marks: 5,
        options: ['3.33', '3', '4', '1'],
        correctAnswer: '3',
        explanation: 'The // operator performs floor division, which divides and rounds down to the nearest integer. 10 // 3 = 3.'
      },
      {
        questionTitle: 'How do you create a list in Python?',
        problemStatement: 'Which of the following correctly creates a list in Python?',
        type: 'MCQ', difficulty: 'easy', topic: 'Python', marks: 5,
        options: ['list = (1, 2, 3)', 'list = {1, 2, 3}', 'list = [1, 2, 3]', 'list = <1, 2, 3>'],
        correctAnswer: 'list = [1, 2, 3]',
        explanation: 'Lists in Python are created using square brackets []. Tuples use () and sets use {}.'
      },
      {
        questionTitle: 'What is the correct way to declare a variable x with value 5 in Python?',
        problemStatement: 'Which is the correct Python syntax to assign 5 to a variable named x?',
        type: 'MCQ', difficulty: 'easy', topic: 'Python', marks: 5,
        options: ['int x = 5', 'var x = 5', 'x = 5', 'x := 5;'],
        correctAnswer: 'x = 5',
        explanation: 'Python uses simple assignment with = and does not require type declarations or var keywords.'
      },
    ]
  },
  {
    quiz: {
      title: 'Java Fundamentals – Easy',
      description: 'Start your Java journey! Quiz covering basic Java syntax, data types, and output statements.',
      difficulty: 'easy',
      category: 'Java',
      timeLimit: 15,
      isPublished: true,
      isRandomized: false,
      tags: ['java', 'beginner', 'programming'],
    },
    questions: [
      {
        questionTitle: 'How do you print text in Java?',
        problemStatement: 'Which Java statement prints "Hello World" to the console?',
        type: 'MCQ', difficulty: 'easy', topic: 'Java', marks: 5,
        options: ['console.log("Hello World")', 'print("Hello World")', 'System.out.println("Hello World")', 'echo "Hello World"'],
        correctAnswer: 'System.out.println("Hello World")',
        explanation: 'In Java, System.out.println() is used to print text followed by a new line to the standard output.'
      },
      {
        questionTitle: 'What is the correct data type for storing a whole number in Java?',
        problemStatement: 'Which data type is most commonly used to store integer values in Java?',
        type: 'MCQ', difficulty: 'easy', topic: 'Java', marks: 5,
        options: ['float', 'String', 'int', 'bool'],
        correctAnswer: 'int',
        explanation: '[int] is the primitive integer data type in Java. It stores 32-bit signed integer values.'
      },
      {
        questionTitle: 'What keyword is used to create a class in Java?',
        problemStatement: 'Which keyword defines a class in Java?',
        type: 'MCQ', difficulty: 'easy', topic: 'Java', marks: 5,
        options: ['define', 'struct', 'class', 'object'],
        correctAnswer: 'class',
        explanation: 'The `class` keyword is used to declare a class in Java. Everything in Java is inside a class.'
      },
      {
        questionTitle: 'Which symbol ends a Java statement?',
        problemStatement: 'What punctuation mark terminates a statement in Java?',
        type: 'MCQ', difficulty: 'easy', topic: 'Java', marks: 5,
        options: ['.', ':', ';', ','],
        correctAnswer: ';',
        explanation: 'In Java (like C/C++), statements must end with a semicolon (;).'
      },
      {
        questionTitle: 'What is the entry point of a Java program?',
        problemStatement: 'Which method signature is the correct entry point (main method) for a Java application?',
        type: 'MCQ', difficulty: 'easy', topic: 'Java', marks: 5,
        options: ['public void main()', 'public static void main(String[] args)', 'static main()', 'void start()'],
        correctAnswer: 'public static void main(String[] args)',
        explanation: 'Every Java application must have a main method with the signature: public static void main(String[] args).'
      },
    ]
  },
];

async function seedEasyQuizzes() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find or create admin user
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('⚠️  No admin found, creating one...');
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash('samhitha@gmail.com', 12);
      admin = await User.create({ name: 'Samhitha', email: 'samhitha@gmail.com', password: hash, role: 'admin' });
    }

    let totalQuizzes = 0;
    let totalQuestions = 0;

    for (const { quiz: quizData, questions: questionsData } of easyQuizData) {
      // Check if quiz already exists by title
      const existing = await Quiz.findOne({ title: quizData.title });
      if (existing) {
        console.log(`⏭️  Quiz already exists: "${quizData.title}" — skipping`);
        continue;
      }

      // Create questions
      const createdQuestions = await Question.insertMany(
        questionsData.map(q => ({ ...q, createdBy: admin._id }))
      );

      const totalMarks = createdQuestions.reduce((sum, q) => sum + q.marks, 0);
      const passingMarks = Math.ceil(totalMarks * 0.6); // 60% to pass

      // Create quiz
      const quiz = await Quiz.create({
        ...quizData,
        questions: createdQuestions.map(q => q._id),
        totalMarks,
        passingMarks,
        createdBy: admin._id,
      });

      console.log(`✅ Created quiz: "${quiz.title}" (${createdQuestions.length} questions, ${totalMarks} marks)`);
      totalQuizzes++;
      totalQuestions += createdQuestions.length;
    }

    console.log(`\n🎉 Easy Quiz Seed Complete!`);
    console.log(`   📝 Quizzes created: ${totalQuizzes}`);
    console.log(`   ❓ Questions created: ${totalQuestions}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed Error:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedEasyQuizzes();
