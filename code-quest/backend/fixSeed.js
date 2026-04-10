const mongoose = require('mongoose');
const PaperSet = require('./models/PaperSet');
const Question = require('./models/Question');
require('dotenv').config();

async function fixPaperSets() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all questions
    const questions = await Question.find({});
    console.log('Found questions:', questions.length);

    // Clear existing paper sets
    await PaperSet.deleteMany({});
    console.log('Cleared existing paper sets');

    // Create properly distributed paper sets
    const paperSets = [
      {
        name: 'Set A - Web Development Fundamentals',
        description: 'HTML, CSS, and JavaScript basics for web development',
        category: 'Web Development',
        difficulty: 'easy',
        languages: ['English', 'Hindi', 'Spanish', 'French'],
        timeLimit: 30,
        passingMarks: 60,
        tags: ['html', 'css', 'javascript', 'web', 'frontend'],
        isActive: true,
        createdBy: '69b782f394be3f7b46325b65' // Admin user ID
      },
      {
        name: 'Set B - Programming Languages',
        description: 'Core concepts in Python, Java, and C++',
        category: 'Programming',
        difficulty: 'mixed',
        languages: ['English', 'Hindi', 'Spanish', 'French'],
        timeLimit: 45,
        passingMarks: 65,
        tags: ['python', 'java', 'cpp', 'programming', 'languages'],
        isActive: true,
        createdBy: '69b782f394be3f7b46325b65'
      },
      {
        name: 'Set C - Modern Web Technologies',
        description: 'React, Node.js, and MERN stack development',
        category: 'Full Stack',
        difficulty: 'medium',
        languages: ['English', 'Hindi', 'Spanish', 'French'],
        timeLimit: 60,
        passingMarks: 70,
        tags: ['react', 'nodejs', 'mern', 'fullstack', 'javascript'],
        isActive: true,
        createdBy: '69b782f394be3f7b46325b65'
      },
      {
        name: 'Set D - Cloud and DevOps',
        description: 'AWS, cloud computing, and deployment strategies',
        category: 'Cloud Computing',
        difficulty: 'medium',
        languages: ['English', 'Hindi', 'Spanish', 'French'],
        timeLimit: 50,
        passingMarks: 65,
        tags: ['aws', 'cloud', 'devops', 'infrastructure'],
        isActive: true,
        createdBy: '69b782f394be3f7b46325b65'
      },
      {
        name: 'Set E - Database and Security',
        description: 'SQL databases and cybersecurity fundamentals',
        category: 'Database & Security',
        difficulty: 'mixed',
        languages: ['English', 'Hindi', 'Spanish', 'French'],
        timeLimit: 55,
        passingMarks: 68,
        tags: ['sql', 'database', 'cybersecurity', 'security'],
        isActive: true,
        createdBy: '69b782f394be3f7b46325b65'
      },
      {
        name: 'Set F - Advanced Topics',
        description: 'Comprehensive mixed questions for advanced assessment',
        category: 'Advanced',
        difficulty: 'hard',
        languages: ['English', 'Hindi', 'Spanish', 'French'],
        timeLimit: 90,
        passingMarks: 75,
        tags: ['advanced', 'comprehensive', 'mixed', 'challenge'],
        isActive: true,
        createdBy: '69b782f394be3f7b46325b65'
      }
    ];

    // Create paper sets
    const createdPaperSets = [];
    for (const setData of paperSets) {
      const paperSet = new PaperSet(setData);
      await paperSet.save();
      createdPaperSets.push(paperSet);
    }
    console.log('Created paper sets:', createdPaperSets.length);

    // Distribute questions based on categories
    const webDevQuestions = questions.filter(q => ['HTML', 'CSS', 'JavaScript'].includes(q.topic));
    const programmingQuestions = questions.filter(q => ['Python', 'Java', 'C++'].includes(q.topic));
    const fullStackQuestions = questions.filter(q => ['React', 'Node.js', 'MERN'].includes(q.topic));
    const cloudQuestions = questions.filter(q => ['AWS', 'Cloud'].includes(q.topic));
    const dbSecurityQuestions = questions.filter(q => ['SQL', 'Cybersecurity'].includes(q.topic));

    // Assign questions to paper sets
    const assignments = [
      { paperSet: createdPaperSets[0], questions: webDevQuestions.slice(0, 6) }, // Web Dev - 6 questions
      { paperSet: createdPaperSets[1], questions: programmingQuestions.slice(0, 6) }, // Programming - 6 questions
      { paperSet: createdPaperSets[2], questions: fullStackQuestions.slice(0, 6) }, // Full Stack - 6 questions
      { paperSet: createdPaperSets[3], questions: cloudQuestions.slice(0, 6) }, // Cloud - 6 questions
      { paperSet: createdPaperSets[4], questions: dbSecurityQuestions.slice(0, 6) }, // DB & Security - 6 questions
      { paperSet: createdPaperSets[5], questions: questions.slice(0, 8) } // Advanced - 8 questions (mixed)
    ];

    for (const assignment of assignments) {
      assignment.paperSet.questions = assignment.questions.map(q => q._id);
      assignment.paperSet.totalQuestions = assignment.questions.length;
      await assignment.paperSet.save();

      // Update questions with paper set reference
      for (const question of assignment.questions) {
        question.paperSets.push(assignment.paperSet._id);
        await question.save();
      }

      console.log(`Assigned ${assignment.questions.length} questions to ${assignment.paperSet.name}`);
    }

    console.log('✅ Paper sets fixed successfully!');
    console.log('📊 Summary:');
    assignments.forEach(assignment => {
      console.log(`  - ${assignment.paperSet.name}: ${assignment.questions.length} questions`);
    });

  } catch (error) {
    console.error('❌ Error fixing paper sets:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixPaperSets();
