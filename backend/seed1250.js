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

function generateQuestion(lang, index, adminId) {
  const topics = ["Syntax", "Logic", "Architecture", "Optimization", "Security", "Debugging", "Design Patterns", "Deployment"];
  const topic = topics[index % topics.length];
  
  return {
    questionTitle: `${lang} ${topic} Q#${index + 1}`,
    problemStatement: `Advance your ${lang} skills with this targeted question about ${topic}. Sequence number: ${index + 1}.`,
    type: "MCQ",
    difficulty: index % 3 === 0 ? "easy" : (index % 3 === 1 ? "medium" : "hard"),
    topic: topic,
    category: lang,
    options: ["Option A (Correct)", "Option B", "Option C", "Option D"],
    correctAnswer: "Option A (Correct)",
    explanation: `The correct approach in ${lang} involves understanding ${topic} deeply as shown in example ${index + 1}.`,
    marks: 5,
    isPublished: true,
    createdBy: adminId
  };
}

async function seed50PerLang() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Clearing database for fresh 1250-question seed...');
    
    // Optional: Wipes all existing quizzes and questions to ensure perfect 50-per-lang consistency
    await Quiz.deleteMany({});
    await Question.deleteMany({});

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) { 
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash('samhitha@gmail.com', 12);
      await User.create({ name: 'Samhitha', email: 'samhitha@gmail.com', password: hash, role: 'admin' });
      process.exit(1);
    }

    let allQuestions = [];
    console.log('Generating 1250 questions (50 per language)...');
    
    for (const lang of languages) {
      for (let i = 0; i < 50; i++) { 
        allQuestions.push(generateQuestion(lang, i, admin._id));
      }
    }

    console.log('Inserting into DB (Batching 500 at a time)...');
    for (let i = 0; i < allQuestions.length; i += 500) {
      const chunk = allQuestions.slice(i, i + 500);
      await Question.insertMany(chunk);
    }

    // Now recreate Quizzes
    const allAdded = await Question.find({});
    console.log(`Successfully added ${allAdded.length} questions.`);

    for (const lang of languages) {
      const qIds = allAdded.filter(q => q.category === lang).map(q => q._id);
      
      await Quiz.create({
        title: `${lang} Ultimate 50`,
        description: `The definitive 50-question challenge for ${lang}. Covers syntax, logic, and advanced architecture.`,
        difficulty: "mixed",
        category: lang,
        timeLimit: 45, // More time for 50 questions
        totalMarks: qIds.length * 5,
        passingMarks: Math.ceil(qIds.length * 5 * 0.4),
        questions: qIds,
        isPublished: true,
        isRandomized: true,
        createdBy: admin._id
      });
      console.log(`Created: ${lang} Ultimate 50`);
    }

    console.log('🎉 Mission Complete: 50 Questions per language across 25 technologies (1250 Total).');
    process.exit(0);
  } catch (err) { console.error(err); process.exit(1); }
}

seed50PerLang();
