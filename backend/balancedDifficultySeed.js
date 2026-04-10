const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedBalancedDifficulty() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/codequestdb';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data to ensure a fresh start
    console.log('🧹 Clearing existing quizzes and questions...');
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    
    // We keep users if possible, but let's ensure our specific admin exists
    const adminEmail = 'samhitha@gmail.com';
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
        const hashedPassword = await bcrypt.hash(adminEmail, 12);
        adminUser = await User.create({
            name: 'Samhitha Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });
        console.log('✅ Created Admin user: samhitha@gmail.com');
    } else {
        console.log('✅ Admin user already exists');
    }

    const topics = ['HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'C++', 'SQL', 'React', 'Node.js', 'MongoDB'];
    
    const allQuestions = [];

    // Function to generate questions dynamically
    const createTopicQuestions = (topic) => {
      const qs = [];
      
      // EASY - 30 questions
      for(let i=1; i<=30; i++) {
        qs.push({
          questionTitle: `${topic} Easy Q${i}`,
          problemStatement: `Fundamental concept of ${topic} - Question ${i}.`,
          type: 'MCQ',
          difficulty: 'easy',
          topic: topic,
          options: [`Option A ${i}`, `Option B ${i}`, `Option C ${i}`, `Option D ${i}`],
          correctAnswer: `Option A ${i}`,
          explanation: `Basic explanation for ${topic} easy question ${i}.`,
          marks: 5, timeLimit: 30, tags: [topic, 'easy'], createdBy: adminUser._id
        });
      }

      // MEDIUM - 30 questions
      for(let i=1; i<=30; i++) {
        qs.push({
          questionTitle: `${topic} Medium Q${i}`,
          problemStatement: `Intermediate application of ${topic} - Question ${i}.`,
          type: 'MCQ',
          difficulty: 'medium',
          topic: topic,
          options: [`Choice 1 ${i}`, `Choice 2 ${i}`, `Choice 3 ${i}`, `Choice 4 ${i}`],
          correctAnswer: `Choice 2 ${i}`,
          explanation: `Intermediate explanation for ${topic} medium question ${i}.`,
          marks: 10, timeLimit: 45, tags: [topic, 'medium'], createdBy: adminUser._id
        });
      }

      // HARD - 30 questions
      for(let i=1; i<=30; i++) {
        qs.push({
          questionTitle: `${topic} Hard Q${i}`,
          problemStatement: `Advanced challenge in ${topic} - Question ${i}.`,
          type: 'MCQ',
          difficulty: 'hard',
          topic: topic,
          options: [`Advanced 1 ${i}`, `Advanced 2 ${i}`, `Advanced 3 ${i}`, `Advanced 4 ${i}`],
          correctAnswer: `Advanced 4 ${i}`,
          explanation: `Advanced explanation for ${topic} hard question ${i}.`,
          marks: 20, timeLimit: 60, tags: [topic, 'hard'], createdBy: adminUser._id
        });
      }
      return qs;
    };

    console.log('🔄 Generating questions for all topics...');
    for (const topic of topics) {
      allQuestions.push(...createTopicQuestions(topic));
    }

    const createdQuestions = await Question.insertMany(allQuestions);
    console.log(`✅ Created ${createdQuestions.length} questions.`);

    // Create Balanced Quizzes
    console.log('🏗️  Creating separate quizzes for each difficulty level...');
    for (const topic of topics) {
      const topicQs = createdQuestions.filter(q => q.topic === topic);
      
      const levels = ['easy', 'medium', 'hard'];
      for (const level of levels) {
        const levelQs = topicQs.filter(q => q.difficulty === level);
        
        if (levelQs.length > 0) {
          const totalMarks = levelQs.reduce((sum, q) => sum + q.marks, 0);
          const timeLimit = level === 'easy' ? 10 : level === 'medium' ? 20 : 30;

          await Quiz.create({
            title: `${topic} Essentials - ${level.charAt(0).toUpperCase() + level.slice(1)}`,
            description: `A ${level} level quiz covering key ${topic} concepts.`,
            difficulty: level,
            category: topic,
            timeLimit: timeLimit,
            questions: levelQs.map(q => q._id),
            totalMarks: totalMarks,
            passingMarks: Math.ceil(totalMarks * 0.5),
            isPublished: true,
            isRandomized: true,
            createdBy: adminUser._id
          });
          console.log(`   - Created: ${topic} [${level.toUpperCase()}]`);
        }
      }
    }

    // MEGA QUIZZES (Mixed) - Create 5 UNIQUE SETS
    console.log('🏆 Creating 5 Sets of Master Challenges (Mixed Difficulty)...');
    for (let setNum = 1; setNum <= 5; setNum++) {
      const masterQs = [...createdQuestions].sort(() => 0.5 - Math.random()).slice(0, 50);
      const totalMasterMarks = masterQs.reduce((sum, q) => sum + q.marks, 0);
      
      await Quiz.create({
        title: `Global Master Challenge - Set ${setNum}`,
        description: `Set ${setNum}: A high-stakes mixed difficulty marathon covering full stack, algorithms, and more.`,
        difficulty: 'mixed',
        category: 'General',
        timeLimit: 60,
        questions: masterQs.map(q => q._id),
        totalMarks: totalMasterMarks,
        passingMarks: Math.ceil(totalMasterMarks * 0.6),
        isPublished: true,
        isRandomized: true,
        createdBy: adminUser._id
      });
      console.log(`   ✅ Created: Global Master Challenge - Set ${setNum}`);
    }

    console.log('\n🎉 ALL LEVELS SEEDED SUCCESSFULLY!');
    console.log(`📌 Admin: ${adminEmail} / ${adminEmail}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedBalancedDifficulty();
