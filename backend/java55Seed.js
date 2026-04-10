const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');

dotenv.config();

const questionsData = [
  // 1-5 BASIC INTRO (Already added by previous seed but here for completeness/consistency)
  {
    questionTitle: "What is Java?",
    difficulty: "easy",
    topic: "History",
    type: "MCQ",
    options: ["An operating system", "A programming language", "A browser", "A search engine"],
    correctAnswer: "A programming language",
    marks: 1,
    explanation: "Java is a high-level, class-based, object-oriented programming language."
  },
  {
    questionTitle: "Who developed Java?",
    difficulty: "easy",
    topic: "History",
    type: "MCQ",
    options: ["James Gosling", "Bjarne Stroustrup", "Dennis Ritchie", "Guido van Rossum"],
    correctAnswer: "James Gosling",
    marks: 1,
    explanation: "Java was originally developed by James Gosling at Sun Microsystems."
  },
  {
    questionTitle: "What is the file extension for Java source code?",
    difficulty: "easy",
    topic: "Basics",
    type: "MCQ",
    options: [".class", ".java", ".obj", ".exe"],
    correctAnswer: ".java",
    marks: 1,
    explanation: "Java source files use the .java extension, whereas compiled bytecode uses .class."
  },
  {
    questionTitle: "What does JVM stand for?",
    difficulty: "easy",
    topic: "Architecture",
    type: "MCQ",
    options: ["Java Visual Machine", "Java Virtual Machine", "Java Variable Memory", "Java View Model"],
    correctAnswer: "Java Virtual Machine",
    marks: 1,
    explanation: "JVM stands for Java Virtual Machine, which enables a computer to run Java programs."
  },
  {
    questionTitle: "Which component is used to compile Java code?",
    difficulty: "easy",
    topic: "Tools",
    type: "MCQ",
    options: ["JVM", "JDK", "JRE", "JIT"],
    correctAnswer: "JDK",
    marks: 1,
    explanation: "JDK (Java Development Kit) contains tools like javac to compile code."
  },

  // 6-15 DATA TYPES & OPERATORS
  {
    questionTitle: "Which of these is NOT a primitive data type in Java?",
    difficulty: "easy",
    topic: "Data Types",
    type: "MCQ",
    options: ["int", "double", "boolean", "String"],
    correctAnswer: "String",
    marks: 1,
    explanation: "String is a class and an object, not a primitive data type."
  },
  {
    questionTitle: "What is the size of 'char' in Java?",
    difficulty: "easy",
    topic: "Data Types",
    type: "MCQ",
    options: ["8-bit", "16-bit", "32-bit", "64-bit"],
    correctAnswer: "16-bit",
    marks: 1,
    explanation: "Java uses Unicode for characters, which are 16-bit unsigned integers."
  },
  {
    questionTitle: "What is the default value of a boolean variable in Java?",
    difficulty: "easy",
    topic: "Variables",
    type: "MCQ",
    options: ["true", "false", "null", "0"],
    correctAnswer: "false",
    marks: 1,
    explanation: "The default value of a primitive boolean variable is false."
  },
  {
    questionTitle: "Which operator is used to calculate the remainder?",
    difficulty: "easy",
    topic: "Operators",
    type: "MCQ",
    options: ["/", "%", "&", "||"],
    correctAnswer: "%",
    marks: 1,
    explanation: "% is the modulo operator used to get the remainder of a division."
  },
  {
    questionTitle: "What is the result of 10 / 3 in integer division?",
    difficulty: "easy",
    topic: "Operators",
    type: "MCQ",
    options: ["3.33", "3", "4", "Error"],
    correctAnswer: "3",
    marks: 1,
    explanation: "Integer division truncates the decimal part, resulting in 3."
  },
  {
    questionTitle: "What is the shortcut for 'a = a + 5'?",
    difficulty: "easy",
    topic: "Operators",
    type: "MCQ",
    options: ["a ++ 5", "a += 5", "a + 5 =", "a == 5"],
    correctAnswer: "a += 5",
    marks: 1,
    explanation: "The += compound assignment operator adds the right operand to the left."
  },
  {
    questionTitle: "Which data type is used for large decimal precision?",
    difficulty: "easy",
    topic: "Data Types",
    type: "MCQ",
    options: ["float", "double", "int", "short"],
    correctAnswer: "double",
    marks: 1,
    explanation: "double is the default floating-point type and has twice the precision of float."
  },
  {
    questionTitle: "How do you declare a constant in Java?",
    difficulty: "easy",
    topic: "Keywords",
    type: "MCQ",
    options: ["constant", "final", "const", "static"],
    correctAnswer: "final",
    marks: 1,
    explanation: "The final keyword is used to declare constants (values that cannot change)."
  },
  {
    questionTitle: "What happens when you cast a double to an int?",
    difficulty: "easy",
    topic: "Type Casting",
    type: "MCQ",
    options: ["Numbers are rounded", "Decimal part is lost", "Code won't compile", "It becomes null"],
    correctAnswer: "Decimal part is lost",
    marks: 1,
    explanation: "Explicit casting from double to int results in truncation (loss of precision)."
  },
  {
    questionTitle: "Which of these is a VALID variable name?",
    difficulty: "easy",
    topic: "Variables",
    type: "MCQ",
    options: ["2ndNumber", "first_name", "first name", "class"],
    correctAnswer: "first_name",
    marks: 1,
    explanation: "Variable names can't start with numbers, contain spaces, or be keywords."
  },

  // 16-25 CONTROL FLOW
  {
    questionTitle: "Which keyword is used for a multi-directional branch?",
    difficulty: "easy",
    topic: "Selection",
    type: "MCQ",
    options: ["if", "switch", "for", "while"],
    correctAnswer: "switch",
    marks: 1,
    explanation: "switch statement allows testing a variable against a list of values."
  },
  {
    questionTitle: "What is the purpose of 'break' in a switch statement?",
    difficulty: "easy",
    topic: "Selection",
    type: "MCQ",
    options: ["Ends the program", "Exits the switch block", "Goes to next case", "Skips next case"],
    correctAnswer: "Exits the switch block",
    marks: 1,
    explanation: "break prevents 'fall-through' to subsequent cases."
  },
  {
    questionTitle: "Which loop is guaranteed to execute at least once?",
    difficulty: "easy",
    topic: "Iteration",
    type: "MCQ",
    options: ["for", "while", "do-while", "foreach"],
    correctAnswer: "do-while",
    marks: 1,
    explanation: "do-while checks the condition at the end of the loop body."
  },
  {
    questionTitle: "How do you exit from a loop prematurely?",
    difficulty: "easy",
    topic: "Selection",
    type: "MCQ",
    options: ["exit", "return", "break", "stop"],
    correctAnswer: "break",
    marks: 1,
    explanation: "break terminates the inner-most loop it is found in."
  },
  {
    questionTitle: "What loop should you use if the number of iterations is fixed?",
    difficulty: "easy",
    topic: "Iteration",
    type: "MCQ",
    options: ["for", "while", "do-while", "if"],
    correctAnswer: "for",
    marks: 1,
    explanation: "for loops are ideal when you know the exact range or count in advance."
  },
  {
    questionTitle: "What does 'continue' do in a loop?",
    difficulty: "easy",
    topic: "Iteration",
    type: "MCQ",
    options: ["Stops the loop", "Starts next iteration", "Exits program", "Repeats current iteration"],
    correctAnswer: "Starts next iteration",
    marks: 1,
    explanation: "continue skips the remainder of the current loop body and moves to next loop cycle."
  },
  {
    questionTitle: "Which can be used as a switch expression (Java 8)?",
    difficulty: "easy",
    topic: "Selection",
    type: "MCQ",
    options: ["double", "float", "String", "boolean"],
    correctAnswer: "String",
    marks: 1,
    explanation: "Java 7+ allows switch on Strings. Primitive float/double are not allowed."
  },
  {
    questionTitle: "What is an 'infinite loop'?",
    difficulty: "easy",
    topic: "Iteration",
    type: "MCQ",
    options: ["Loop that runs 100 times", "Loop that never ends", "A crashed program", "A nested loop"],
    correctAnswer: "Loop that never ends",
    marks: 1,
    explanation: "A loop that has a condition that always evaluates to true."
  },
  {
    questionTitle: "Which syntax is used for a for-each loop?",
    difficulty: "easy",
    topic: "Iteration",
    type: "MCQ",
    options: ["for (int i=0; i<n; i++)", "for (Type x in array)", "for (Type x : array)", "while (x : array)"],
    correctAnswer: "for (Type x : array)",
    marks: 1,
    explanation: "The colon (:) is used to iterate over collections or arrays."
  },
  {
    questionTitle: "What is the result of: boolean b = (5 > 3 && 2 < 1)?",
    difficulty: "easy",
    topic: "Operators",
    type: "MCQ",
    options: ["true", "false", "Error", "1"],
    correctAnswer: "false",
    marks: 1,
    explanation: "true && false is false."
  },

  // 26-35 ARRAYS & STRINGS
  {
    questionTitle: "How do you find the length of an array named 'arr'?",
    difficulty: "easy",
    topic: "Arrays",
    type: "MCQ",
    options: ["arr.length()", "arr.size", "arr.length", "arr.count"],
    correctAnswer: "arr.length",
    marks: 1,
    explanation: "In Java, length is a public property (field) for arrays, not a method."
  },
  {
    questionTitle: "What is the index of the first element in an array?",
    difficulty: "easy",
    topic: "Arrays",
    type: "MCQ",
    options: ["1", "0", "-1", "Any number"],
    correctAnswer: "0",
    marks: 1,
    explanation: "Java arrays are zero-indexed."
  },
  {
    questionTitle: "Which method is used to compare two Strings for equality?",
    difficulty: "easy",
    topic: "Strings",
    type: "MCQ",
    options: ["==", "equals()", "compare()", "isEqual()"],
    correctAnswer: "equals()",
    marks: 1,
    explanation: "== compares references (memory addresses). equals() compares character content."
  },
  {
    questionTitle: "How do you get a character at index 2 from String 's'?",
    difficulty: "easy",
    topic: "Strings",
    type: "MCQ",
    options: ["s[2]", "s.get(2)", "s.charAt(2)", "s.at(2)"],
    correctAnswer: "s.charAt(2)",
    marks: 1,
    explanation: "charAt(int index) is the standard method for individual character access."
  },
  {
    questionTitle: "Which class is used for mutable strings?",
    difficulty: "easy",
    topic: "Strings",
    type: "MCQ",
    options: ["String", "StringBuffer", "StringStatic", "StringCache"],
    correctAnswer: "StringBuffer",
    marks: 1,
    explanation: "String is immutable. StringBuffer and StringBuilder provide mutable character sequences."
  },
  {
    questionTitle: "What is the output of 'abc'.concat('def')?",
    difficulty: "easy",
    topic: "Strings",
    type: "MCQ",
    options: ["adbecf", "abc def", "abcdef", "Error"],
    correctAnswer: "abcdef",
    marks: 1,
    explanation: "concat() appends the specified string to the end."
  },
  {
    questionTitle: "How do you declare a 2D array?",
    difficulty: "easy",
    topic: "Arrays",
    type: "MCQ",
    options: ["int arr[2,2]", "int arr[][]", "int arr{2}{2}", "int[][] arr = new int[2]"],
    correctAnswer: "int arr[][]",
    marks: 1,
    explanation: "Square brackets indicate dimensions. int[][] arr is the standard declaration."
  },
  {
    questionTitle: "What is the length of 'Hello World'?",
    difficulty: "easy",
    topic: "Strings",
    type: "MCQ",
    options: ["10", "11", "12", "9"],
    correctAnswer: "11",
    marks: 1,
    explanation: "The space counts as a character. (5 letters + 1 space + 5 letters = 11)."
  },
  {
    questionTitle: "Which of these is used to trim whitespace from a string?",
    difficulty: "easy",
    topic: "Strings",
    type: "MCQ",
    options: ["remove()", "trim()", "clean()", "strip()"],
    correctAnswer: "trim()",
    marks: 1,
    explanation: "trim() removes leading and trailing white space."
  },
  {
    questionTitle: "How do you find the index of a substring in Java?",
    difficulty: "easy",
    topic: "Strings",
    type: "MCQ",
    options: ["get()", "find()", "indexOf()", "search()"],
    correctAnswer: "indexOf()",
    marks: 1,
    explanation: "indexOf() returns the starting index of the first occurrence."
  },

  // 36-45 INTRO TO OOP
  {
    questionTitle: "What is a 'blueprint' for an object?",
    difficulty: "easy",
    topic: "OOP",
    type: "MCQ",
    options: ["Method", "Variable", "Class", "Constructor"],
    correctAnswer: "Class",
    marks: 1,
    explanation: "A class defines the properties and behaviors that objects created from it will have."
  },
  {
    questionTitle: "Which keyword creates an instance of a class?",
    difficulty: "easy",
    topic: "OOP",
    type: "MCQ",
    options: ["new", "create", "make", "instance"],
    correctAnswer: "new",
    marks: 1,
    explanation: "The 'new' operator allocates memory for a new object."
  },
  {
    questionTitle: "What returns NOTHING from a method?",
    difficulty: "easy",
    topic: "Methods",
    type: "MCQ",
    options: ["null", "empty", "void", "none"],
    correctAnswer: "void",
    marks: 1,
    explanation: "void is used in method signatures to indicate no return value."
  },
  {
    questionTitle: "What is called when an object is created?",
    difficulty: "easy",
    topic: "OOP",
    type: "MCQ",
    options: ["Method", "Getter", "Constructor", "Initializer"],
    correctAnswer: "Constructor",
    marks: 1,
    explanation: "A constructor is a special block of code used to initialize objects."
  },
  {
    questionTitle: "What is the file entry point of a Java program?",
    difficulty: "easy",
    topic: "Basics",
    type: "MCQ",
    options: ["init()", "start()", "main()", "run()"],
    correctAnswer: "main()",
    marks: 1,
    explanation: "The public static void main(String[] args) method is the entry point."
  },
  {
    questionTitle: "How do you signify a method belongs to a class, not instances?",
    difficulty: "easy",
    topic: "Keywords",
    type: "MCQ",
    options: ["final", "static", "private", "public"],
    correctAnswer: "static",
    marks: 1,
    explanation: "static methods can be called without creating an instance of the class."
  },
  {
    questionTitle: "Which keyword refers to the current object instance?",
    difficulty: "easy",
    topic: "Keywords",
    type: "MCQ",
    options: ["current", "self", "this", "my"],
    correctAnswer: "this",
    marks: 1,
    explanation: "'this' keyword is used to differentiate between instance variables and local params."
  },
  {
    questionTitle: "Can a class have multiple constructors?",
    difficulty: "easy",
    topic: "OOP",
    type: "MCQ",
    options: ["Yes", "No", "Only if static", "Only one"],
    correctAnswer: "Yes",
    marks: 1,
    explanation: "Yes, this is known as Constructor Overloading."
  },
  {
    questionTitle: "What is 'Encapsulation'?",
    difficulty: "easy",
    topic: "OOP",
    type: "MCQ",
    options: ["Creating objects", "Hiding data", "Inheriting data", "Method call"],
    correctAnswer: "Hiding data",
    marks: 1,
    explanation: "Encapsulation involves bundling data and keeping it safe from outside interference."
  },
  {
    questionTitle: "Which access modifier makes members invisible to other classes?",
    difficulty: "easy",
    topic: "OOP",
    type: "MCQ",
    options: ["public", "protected", "private", "default"],
    correctAnswer: "private",
    marks: 1,
    explanation: "private members are only accessible within the same class."
  },

  // 46-55 PILLARS OF OOP / MISC
  {
    questionTitle: "Which keyword is used for inheritance?",
    difficulty: "easy",
    topic: "Inheritance",
    type: "MCQ",
    options: ["implements", "inherits", "extends", "links"],
    correctAnswer: "extends",
    marks: 1,
    explanation: "A class extends another class to inherit its properties and methods."
  },
  {
    questionTitle: "Can Java support multiple inheritance for classes?",
    difficulty: "easy",
    topic: "Inheritance",
    type: "MCQ",
    options: ["Yes", "No", "Only with final", "Only for abstract"],
    correctAnswer: "No",
    marks: 1,
    explanation: "Java does not support multiple inheritance with classes to avoid ambiguity (Diamond Problem)."
  },
  {
    questionTitle: "How do you achieve multiple inheritance in Java?",
    difficulty: "easy",
    topic: "Architecture",
    type: "MCQ",
    options: ["Abstract classes", "Interfaces", "Nested classes", "Static methods"],
    correctAnswer: "Interfaces",
    marks: 1,
    explanation: "A class can implement multiple interfaces."
  },
  {
    questionTitle: "What is 'Method Overriding'?",
    difficulty: "easy",
    topic: "Polymorphism",
    type: "MCQ",
    options: ["Multiple methods, same name", "Redefining superclass method", "Calling static method", "Input parameter change"],
    correctAnswer: "Redefining superclass method",
    marks: 1,
    explanation: "Subclass provides a specific implementation for a method already in the parent class."
  },
  {
    questionTitle: "What is used to handle runtime errors?",
    difficulty: "easy",
    topic: "Exceptions",
    type: "MCQ",
    options: ["if-else", "try-catch", "break", "return"],
    correctAnswer: "try-catch",
    marks: 1,
    explanation: "Exception handling allows a program to deal with unexpected events gracefully."
  },
  {
    questionTitle: "Which block ALWAYS executes after try-catch?",
    difficulty: "easy",
    topic: "Exceptions",
    type: "MCQ",
    options: ["do", "while", "finally", "stop"],
    correctAnswer: "finally",
    marks: 1,
    explanation: "The finally block runs regardless of whether an exception was thrown or caught."
  },
  {
    questionTitle: "What is an 'Interface'?",
    difficulty: "easy",
    topic: "OO Basics",
    type: "MCQ",
    options: ["A full class", "A contract (abstract)", "An object", "A method"],
    correctAnswer: "A contract (abstract)",
    marks: 1,
    explanation: "Interfaces define what a class must do, not how it does it."
  },
  {
    questionTitle: "Which package is imported by default in every Java program?",
    difficulty: "easy",
    topic: "Packages",
    type: "MCQ",
    options: ["java.util", "java.io", "java.lang", "java.net"],
    correctAnswer: "java.lang",
    marks: 1,
    explanation: "java.lang contains fundamental classes like String, Math, etc. and is auto-imported."
  },
  {
    questionTitle: "What keyword is used to call the superclass constructor?",
    difficulty: "easy",
    topic: "Inheritance",
    type: "MCQ",
    options: ["this()", "super()", "parent()", "base()"],
    correctAnswer: "super()",
    marks: 1,
    explanation: "super() must be the first statement in a subclass constructor."
  },
  {
    questionTitle: "Which of these is used to take user input?",
    difficulty: "easy",
    topic: "IO",
    type: "MCQ",
    options: ["Input", "Output", "Scanner", "System.in.get"],
    correctAnswer: "Scanner",
    marks: 1,
    explanation: "The java.util.Scanner class is commonly used for terminal input."
  }
];

async function seedJava55() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('Admin user not found. Please register an admin first.');
      process.exit(1);
    }

    // 1. Delete and re-add questions for this specific topic to ensure clean 55
    await Question.deleteMany({ topic: { $in: ["History", "Basics", "Architecture", "Tools", "Data Types", "Variables", "Operators", "Type Casting", "Selection", "Iteration", "Arrays", "Strings", "OOP", "Methods", "Keywords", "Inheritance", "Exceptions", "Packages", "IO", "OO Basics", "Polymorphism"] } });
    
    const createdQuestions = await Question.insertMany(
      questionsData.map(q => ({
        ...q,
        problemStatement: q.problemStatement || q.questionTitle, // Required field fix
        createdBy: admin._id,
        isPublished: true,
        category: "Java"
      }))
    );

    const questionIds = createdQuestions.map(q => q._id);
    const totalMarks = createdQuestions.reduce((acc, q) => acc + q.marks, 0);

    // 2. Find or Update Java Fundamentals Quiz
    const quizTitle = "Java Fundamentals";
    let quiz = await Quiz.findOne({ title: { $regex: /Java Fundamentals/i } });

    if (quiz) {
      quiz.questions = questionIds;
      quiz.totalMarks = totalMarks;
      quiz.passingMarks = Math.ceil(totalMarks * 0.4);
      quiz.timeLimit = 40; // More time for 55 questions
      await quiz.save();
      console.log(`Updated existing quiz: ${quiz.title} with 55 questions.`);
    } else {
      quiz = await Quiz.create({
        title: "Java Fundamentals - Comprehensive",
        description: "A complete 55-question deep dive into Java core concepts.",
        difficulty: "easy",
        category: "Java",
        timeLimit: 40,
        totalMarks: totalMarks,
        passingMarks: Math.ceil(totalMarks * 0.4),
        isPublished: true,
        questions: questionIds,
        createdBy: admin._id
      });
      console.log(`Created new quiz: ${quiz.title} with 55 questions.`);
    }

    console.log('Successfully seeded 55 Java Fundamental questions!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedJava55();
