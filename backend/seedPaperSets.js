const mongoose = require('mongoose');
const PaperSet = require('./models/PaperSet');
const Question = require('./models/Question');
const User = require('./models/User');
require('dotenv').config();

const sampleQuestions = [
  // Mathematics Questions
  {
    questionTitle: new Map([
      ['English', 'Basic Algebra'],
      ['Hindi', 'बुनियादी बीजगणित'],
      ['Spanish', 'Álgebra Básica'],
      ['French', 'Algèbre de Base']
    ]),
    problemStatement: new Map([
      ['English', 'If 2x + 5 = 13, what is the value of x?'],
      ['Hindi', 'यदि 2x + 5 = 13 है, तो x का मान क्या है?'],
      ['Spanish', 'Si 2x + 5 = 13, ¿cuál es el valor de x?'],
      ['French', 'Si 2x + 5 = 13, quelle est la valeur de x ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'Mathematics',
    options: new Map([
      ['English', ['3', '4', '5', '6']],
      ['Hindi', ['3', '4', '5', '6']],
      ['Spanish', ['3', '4', '5', '6']],
      ['French', ['3', '4', '5', '6']]
    ]),
    correctAnswer: new Map([
      ['English', '4'],
      ['Hindi', '4'],
      ['Spanish', '4'],
      ['French', '4']
    ]),
    explanation: new Map([
      ['English', '2x + 5 = 13 => 2x = 8 => x = 4'],
      ['Hindi', '2x + 5 = 13 => 2x = 8 => x = 4'],
      ['Spanish', '2x + 5 = 13 => 2x = 8 => x = 4'],
      ['French', '2x + 5 = 13 => 2x = 8 => x = 4']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },
  {
    questionTitle: new Map([
      ['English', 'Geometry Problem'],
      ['Hindi', 'ज्यामिति समस्या'],
      ['Spanish', 'Problema de Geometría'],
      ['French', 'Problème de Géométrie']
    ]),
    problemStatement: new Map([
      ['English', 'What is the area of a circle with radius 5 units?'],
      ['Hindi', '5 इकाई त्रिज्या वाले वृत्त का क्षेत्रफल क्या है?'],
      ['Spanish', '¿Cuál es el área de un círculo con radio 5 unidades?'],
      ['French', 'Quelle est l\'aire d\'un cercle de rayon 5 unités ?']
    ]),
    type: 'mcq',
    difficulty: 'medium',
    topic: 'Mathematics',
    options: new Map([
      ['English', ['25π', '10π', '5π', '50π']],
      ['Hindi', ['25π', '10π', '5π', '50π']],
      ['Spanish', ['25π', '10π', '5π', '50π']],
      ['French', ['25π', '10π', '5π', '50π']]
    ]),
    correctAnswer: new Map([
      ['English', '25π'],
      ['Hindi', '25π'],
      ['Spanish', '25π'],
      ['French', '25π']
    ]),
    explanation: new Map([
      ['English', 'Area = πr² = π(5)² = 25π square units'],
      ['Hindi', 'क्षेत्रफल = πr² = π(5)² = 25π वर्ग इकाई'],
      ['Spanish', 'Área = πr² = π(5)² = 25π unidades cuadradas'],
      ['French', 'Aire = πr² = π(5)² = 25π unités carrées']
    ]),
    marks: 15,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },
  // Science Questions
  {
    questionTitle: new Map([
      ['English', 'Photosynthesis'],
      ['Hindi', 'प्रकाश संश्लेषण'],
      ['Spanish', 'Fotosíntesis'],
      ['French', 'Photosynthèse']
    ]),
    problemStatement: new Map([
      ['English', 'What is the primary product of photosynthesis?'],
      ['Hindi', 'प्रकाश संश्लेषण का प्राथमिक उत्पाद क्या है?'],
      ['Spanish', '¿Cuál es el producto principal de la fotosíntesis?'],
      ['French', 'Quel est le produit principal de la photosynthèse ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'Science',
    options: new Map([
      ['English', ['Glucose', 'Oxygen', 'Water', 'Carbon Dioxide']],
      ['Hindi', ['ग्लूकोस', 'ऑक्सीजन', 'जल', 'कार्बन डाइऑक्साइड']],
      ['Spanish', ['Glucosa', 'Oxígeno', 'Agua', 'Dióxido de Carbono']],
      ['French', ['Glucose', 'Oxygène', 'Eau', 'Dioxyde de Carbone']]
    ]),
    correctAnswer: new Map([
      ['English', 'Glucose'],
      ['Hindi', 'ग्लूकोस'],
      ['Spanish', 'Glucosa'],
      ['French', 'Glucose']
    ]),
    explanation: new Map([
      ['English', 'Photosynthesis primarily produces glucose (sugar) as food for the plant'],
      ['Hindi', 'प्रकाश संश्लेषण मुख्य रूप से पौधे के भोजन के रूप में ग्लूकोस (शर्करा) का उत्पादन करता है'],
      ['Spanish', 'La fotosíntesis produce principalmente glucosa (azúcar) como alimento para la planta'],
      ['French', 'La photosynthèse produit principalement du glucose (sucre) comme nourriture pour la plante']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },
  // Programming Questions
  {
    questionTitle: new Map([
      ['English', 'JavaScript Variables'],
      ['Hindi', 'जावास्क्रिप्ट वेरिएबल्स'],
      ['Spanish', 'Variables JavaScript'],
      ['French', 'Variables JavaScript']
    ]),
    problemStatement: new Map([
      ['English', 'Which keyword is used to declare a constant in JavaScript?'],
      ['Hindi', 'जावास्क्रिप्ट में किस कीवर्ड का उपयोग एक स्थिरांक घोषित करने के लिए किया जाता है?'],
      ['Spanish', '¿Qué palabra clave se usa para declarar una constante en JavaScript?'],
      ['French', 'Quel mot-clé est utilisé pour déclarer une constante en JavaScript ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'Programming',
    options: new Map([
      ['English', ['const', 'let', 'var', 'static']],
      ['Hindi', ['const', 'let', 'var', 'static']],
      ['Spanish', ['const', 'let', 'var', 'static']],
      ['French', ['const', 'let', 'var', 'static']]
    ]),
    correctAnswer: new Map([
      ['English', 'const'],
      ['Hindi', 'const'],
      ['Spanish', 'const'],
      ['French', 'const']
    ]),
    explanation: new Map([
      ['English', 'The "const" keyword is used to declare constants in JavaScript'],
      ['Hindi', 'जावास्क्रिप्ट में स्थिरांक घोषित करने के लिए "const" कीवर्ड का उपयोग किया जाता है'],
      ['Spanish', 'La palabra clave "const" se usa para declarar constantes en JavaScript'],
      ['French', 'Le mot-clé "const" est utilisé pour déclarer des constantes en JavaScript']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },
  {
    questionTitle: new Map([
      ['English', 'Python Loops'],
      ['Hindi', 'पायथन लूप्स'],
      ['Spanish', 'Bucles Python'],
      ['French', 'Boucles Python']
    ]),
    problemStatement: new Map([
      ['English', 'What will be the output of: for i in range(3): print(i)'],
      ['Hindi', 'for i in range(3): print(i) का आउटपुट क्या होगा?'],
      ['Spanish', '¿Cuál será la salida de: for i in range(3): print(i)'],
      ['French', 'Quelle sera la sortie de: for i in range(3): print(i)']
    ]),
    type: 'code_output',
    difficulty: 'medium',
    topic: 'Programming',
    correctAnswer: new Map([
      ['English', '0\n1\n2'],
      ['Hindi', '0\n1\n2'],
      ['Spanish', '0\n1\n2'],
      ['French', '0\n1\n2']
    ]),
    explanation: new Map([
      ['English', 'range(3) generates numbers 0, 1, 2'],
      ['Hindi', 'range(3) संख्याएँ 0, 1, 2 उत्पन्न करता है'],
      ['Spanish', 'range(3) genera los números 0, 1, 2'],
      ['French', 'range(3) génère les nombres 0, 1, 2']
    ]),
    marks: 15,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  }
];

const paperSets = [
  {
    name: 'Set A - Mathematics',
    description: 'Basic mathematics questions covering algebra and geometry',
    category: 'Mathematics',
    difficulty: 'mixed',
    languages: ['English', 'Hindi', 'Spanish', 'French'],
    timeLimit: 30,
    passingMarks: 60,
    tags: ['math', 'algebra', 'geometry']
  },
  {
    name: 'Set B - Science',
    description: 'General science questions including biology and chemistry',
    category: 'Science',
    difficulty: 'mixed',
    languages: ['English', 'Hindi', 'Spanish', 'French'],
    timeLimit: 25,
    passingMarks: 50,
    tags: ['science', 'biology', 'chemistry']
  },
  {
    name: 'Set C - Programming',
    description: 'Programming fundamentals and coding challenges',
    category: 'Programming',
    difficulty: 'mixed',
    languages: ['English', 'Hindi', 'Spanish', 'French'],
    timeLimit: 45,
    passingMarks: 70,
    tags: ['programming', 'coding', 'javascript', 'python']
  },
  {
    name: 'Set D - Mixed Subjects',
    description: 'Questions from various subjects for comprehensive testing',
    category: 'General',
    difficulty: 'mixed',
    languages: ['English', 'Hindi', 'Spanish', 'French'],
    timeLimit: 60,
    passingMarks: 55,
    tags: ['mixed', 'comprehensive', 'general']
  },
  {
    name: 'Set E - Advanced',
    description: 'Challenging questions for advanced learners',
    category: 'Advanced',
    difficulty: 'hard',
    languages: ['English', 'Hindi', 'Spanish', 'French'],
    timeLimit: 90,
    passingMarks: 75,
    tags: ['advanced', 'challenge', 'difficult']
  }
];

async function seedPaperSets() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    // await PaperSet.deleteMany({});
    // await Question.deleteMany({});
    // console.log('Cleared existing data');

    // Get or create admin user
    let adminUser = await User.findOne({ email: 'admin@codequest.com' });
    if (!adminUser) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      adminUser = new User({
        name: 'Admin',
        email: 'admin@codequest.com',
        password: hashedPassword,
        role: 'admin'
      });
      await adminUser.save();
    }

    // Create questions
    const createdQuestions = [];
    for (const questionData of sampleQuestions) {
      const question = new Question({
        ...questionData,
        createdBy: adminUser._id
      });
      await question.save();
      createdQuestions.push(question);
    }
    console.log('Created questions:', createdQuestions.length);

    // Create paper sets
    for (const setData of paperSets) {
      // Assign questions based on category
      let questionsForSet = [];
      
      if (setData.category === 'Mathematics') {
        questionsForSet = createdQuestions.filter(q => q.topic === 'Mathematics');
      } else if (setData.category === 'Science') {
        questionsForSet = createdQuestions.filter(q => q.topic === 'Science');
      } else if (setData.category === 'Programming') {
        questionsForSet = createdQuestions.filter(q => q.topic === 'Programming');
      } else {
        // Mixed or General - include all questions
        questionsForSet = createdQuestions;
      }

      const paperSet = new PaperSet({
        ...setData,
        questions: questionsForSet.map(q => q._id),
        totalQuestions: questionsForSet.length,
        createdBy: adminUser._id
      });
      await paperSet.save();

      // Update questions with paper set reference
      await Question.updateMany(
        { _id: { $in: questionsForSet.map(q => q._id) } },
        { $push: { paperSets: paperSet._id } }
      );
    }

    console.log('✅ Paper sets seeded successfully!');
    console.log('Created 5 paper sets with multiple language support');
    
  } catch (error) {
    console.error('Error seeding paper sets:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedPaperSets();
