const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const languages = [
  "HTML", "CSS", "JavaScript", "Python", "Java", "C++", "SQL", "React", "Node.js", 
  "AWS", "Cybersecurity", "Git", "Docker", "MongoDB", "Express", "PHP", "Ruby", 
  "Swift", "Kotlin", "Rust", "Go", "TypeScript", "Django", "Spring", "Angular"
];

const questionTemplates = [
  { q: "What is the primary use of [L]?", o: ["Web Dev", "Data Science", "System Programming", "All of above"], a: "All of above", e: "[L] is versatile." },
  { q: "Which version of [L] introduced [X]?", o: ["v1.0", "v2.0", "Latest", "None"], a: "Latest", e: "New features come with updates." },
  { q: "Is [L] a compiled language?", o: ["Yes", "No", "Partially", "Depends on OS"], a: "No", e: "Many modern languages are interpreted or use a JIT." },
  { q: "Common extension for [L] files?", o: [".[L]", ".script", ".code", ".text"], a: ".[L]", e: "Standard naming convention." },
  { q: "Who created [L]?", o: ["Founder", "Team", "Company", "Community"], a: "Community", e: "Most languages thrive on community." }
];

// Helper to generate a unique question for a language
function generateQuestion(lang, index, adminId) {
  const topics = ["Fundamentals", "Advanced", "Architecture", "Syntax", "Performance", "Security"];
  const topic = topics[index % topics.length];
  
  return {
    questionTitle: `${lang} ${topic} Question #${index + 1}`,
    problemStatement: `Test your knowledge on ${lang} ${topic} in this specific scenario numbered ${index + 1}.`,
    type: "MCQ",
    difficulty: index % 3 === 0 ? "easy" : (index % 3 === 1 ? "medium" : "hard"),
    topic: topic,
    category: lang,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: "Option A", // Standardized for bulk seed
    explanation: `Detailed explanation for ${lang} question ${index + 1}.`,
    marks: 5,
    isPublished: true,
    createdBy: adminId
  };
}

async function seed1000() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for Big Seed...');

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) { console.error('Admin not found'); process.exit(1); }

    let allQuestions = [];
    console.log('Generating 1000 questions...');
    
    for (const lang of languages) {
      for (let i = 0; i < 40; i++) { // 25 languages * 40 = 1000
        allQuestions.push(generateQuestion(lang, i, admin._id));
      }
    }

    console.log('Inserting into DB (this may take a minute)...');
    const createdQuestions = await Question.insertMany(allQuestions);
    console.log(`Successfully added ${createdQuestions.length} questions.`);

    console.log('Organizing into Quizzes...');
    for (const lang of languages) {
      const qIds = createdQuestions.filter(q => q.category === lang).map(q => q._id);
      const quizTitle = `${lang} Mastery Level ${Math.random() > 0.5 ? 'A' : 'B'}`;
      
      await Quiz.create({
        title: quizTitle,
        description: `Expand your skills in ${lang} with these 40 targeted questions.`,
        difficulty: "mixed",
        category: lang,
        timeLimit: 30,
        totalMarks: qIds.length * 5,
        passingMarks: Math.ceil(qIds.length * 5 * 0.4),
        questions: qIds,
        isPublished: true,
        isRandomized: true,
        createdBy: admin._id
      });
      console.log(`Created Quiz: ${quizTitle}`);
    }

    console.log('🎉 1000 Questions and 25 Language Quizzes seeded successfully!');
    process.exit(0);
  } catch (err) { console.error(err); process.exit(1); }
}

seed1000();
