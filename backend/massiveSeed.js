const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');

dotenv.config();

const languagesData = [
  {
    category: "SQL",
    title: "SQL Mastery - Fundamentals",
    description: "Master databases with this deep dive into SQL queries, joins, and indexing.",
    questions: [
      { q: "What does SQL stand for?", o: ["Structured Query Language", "Simple Query Language", "Statement Query Language", "Service Query Language"], a: "Structured Query Language", t: "Basics" },
      { q: "Which SQL clause is used to filter results?", o: ["ORDER BY", "GROUP BY", "WHERE", "SELECT"], a: "WHERE", t: "Filtering" },
      { q: "Which statement is used to remove all data from a table without deleting the table?", o: ["DROP", "DELETE", "REMOVE", "TRUNCATE"], a: "TRUNCATE", t: "DML" },
      { q: "What is the default sort order for ORDER BY?", o: ["DESC", "ASC", "Random", "None"], a: "ASC", t: "Sorting" },
      { q: "Which join returns all rows from the left table even if there are no matches in the right?", o: ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "FULL JOIN"], a: "LEFT JOIN", t: "Joins" },
      { q: "Which keyword is used to find unique values?", o: ["UNIQUE", "DISTINCT", "ONLY", "SINGLE"], a: "DISTINCT", t: "Basics" },
      { q: "How do you select all columns from a table named 'Users'?", o: ["SELECT full FROM Users", "SELECT * FROM Users", "GET * FROM Users", "EXTRACT * FROM Users"], a: "SELECT * FROM Users", t: "Basics" },
      { q: "Which function returns the number of rows?", o: ["SUM()", "COUNT()", "TOTAL()", "MAX()"], a: "COUNT()", t: "Aggr" },
      { q: "What is a Foreign Key?", o: ["A primary key in another table", "A unique index", "A hidden column", "A backup key"], a: "A primary key in another table", t: "Schema" },
      { q: "Which command adds a new row?", o: ["UPDATE", "ADD", "INSERT", "CREATE"], a: "INSERT", t: "DML" }
    ]
  },
  {
    category: "React",
    title: "React & MERN Fundamentals",
    description: "Modern frontend development with React Hooks, State, and Component life-cycles.",
    questions: [
      { q: "What is React?", o: ["A database", "A framework", "A Javascript library", "A CSS preprocessor"], a: "A Javascript library", t: "Intro" },
      { q: "Which Hook is used to handle side effects?", o: ["useState", "useContext", "useEffect", "useMemo"], a: "useEffect", t: "Hooks" },
      { q: "How do you pass data to a child component?", o: ["State", "Props", "Context", "API"], a: "Props", t: "Comp" },
      { q: "What is the Virtual DOM?", o: ["A direct copy of the DOM", "In-memory representation of UI", "A browser feature", "A CSS engine"], a: "In-memory representation of UI", t: "Adv" },
      { q: "Which command installs React?", o: ["npm get react", "npx create-react-app", "npm set react", "node build react"], a: "npx create-react-app", t: "Setup" },
      { q: "What does JSX stand for?", o: ["Javascript XML", "Javascript Extent", "JSON Script X", "Java Selection X"], a: "Javascript XML", t: "Syntax" },
      { q: "Which hook should you use for complex state logic?", o: ["useState", "useReducer", "useRef", "useEffect"], a: "useReducer", t: "Hooks" },
      { q: "What is the 'id' of the root element in a basic React app?", o: ["app", "main", "root", "container"], a: "root", t: "Setup" },
      { q: "Can browsers read JSX directly?", o: ["Yes", "No", "Only Chrome", "Only with plugins"], a: "No", t: "Syntax" },
      { q: "Which lifecycle method runs after a component mounts in Class components?", o: ["componentDidUpdate", "componentWillUnmount", "componentDidMount", "render"], a: "componentDidMount", t: "Class" }
    ]
  },
  {
    category: "C++",
    title: "C++ Concepts - Pro",
    description: "Deep dive into pointers, memory management, and C++ OOP power.",
    questions: [
      { q: "What is C++?", o: ["High-level language", "Middle-level language", "Low-level language", "Markup language"], a: "Middle-level language", t: "History" },
      { q: "Who created C++?", o: ["James Gosling", "Bjarne Stroustrup", "Guido van Rossum", "Steve Jobs"], a: "Bjarne Stroustrup", t: "History" },
      { q: "Which operator is used for pointers?", o: ["&", "*", "->", ".."], a: "*", t: "Ptr" },
      { q: "What is the standard output stream in C++?", o: ["print", "console.log", "cout", "System.out"], a: "cout", t: "IO" },
      { q: "Which keyword handles memory allocation?", o: ["malloc", "new", "alloc", "create"], a: "new", t: "Mem" },
      { q: "What is a 'Class' in C++?", o: ["User-defined type", "Standard type", "A function", "A library"], a: "User-defined type", t: "OOP" },
      { q: "Which header is required for IO?", o: ["<stdio.h>", "<conio.h>", "<iostream>", "<string>"], a: "<iostream>", t: "IO" },
      { q: "How do you end a statement in C++?", o: [".", ":", ";", ","], a: ";", t: "Sync" },
      { q: "What is 'cin'?", o: ["Output stream", "Input stream", "Error stream", "Calculation stream"], a: "Input stream", t: "IO" },
      { q: "Which keyword is used for inheritance in C++?", o: ["extends", "implements", ":", "inherits"], a: ":", t: "OOP" }
    ]
  },
  {
    category: "AWS",
    title: "Cloud & AWS Practitioner",
    description: "Prepare for your cloud journey. EC2, S3, Lambda, and more.",
    questions: [
      { q: "What does EC2 stand for?", o: ["Elastic Computing Center", "Elastic Compute Cloud", "Easy Cloud Computing", "Elementary Compute Cloud"], a: "Elastic Compute Cloud", t: "Compute" },
      { q: "Which AWS service provides object storage?", o: ["RDS", "EC2", "S3", "EFS"], a: "S3", t: "Storage" },
      { q: "What is AWS Lambda?", o: ["Serverless computing", "Database", "Networking tool", "Security tool"], a: "Serverless computing", t: "Calc" },
      { q: "Which AWS tool provides DNS services?", o: ["Route 53", "Direct Connect", "VPC", "CloudFront"], a: "Route 53", t: "Net" },
      { q: "What is an IAM User?", o: ["An API key", "An Identity & Access Management entity", "A root account", "A database user"], a: "An Identity & Access Management entity", t: "IAM" },
      { q: "What is CloudWatch used for?", o: ["Storage", "Monitoring", "Routing", "Scaling"], a: "Monitoring", t: "Util" },
      { q: "Which service helps build a Content Delivery Network?", o: ["CloudFront", "CloudTrail", "CloudWatch", "Inspector"], a: "CloudFront", t: "CDN" },
      { q: "What is the AWS Free Tier?", o: ["Paid level", "Limited free usage", "Unlimited access", "One day trial"], a: "Limited free usage", t: "Billing" },
      { q: "What is an RDS?", o: ["Relational Database Service", "Route Data Service", "Remote Desk Service", "Rapid Data Store"], a: "Relational Database Service", t: "DB" },
      { q: "Which AWS region is generally the cheapest?", o: ["us-east-1", "eu-west-1", "ap-south-1", "us-gov-west"], a: "us-east-1", t: "Reg" }
    ]
  },
  {
    category: "Cybersecurity",
    title: "Cyber Fundamentals",
    description: "Learn about threats, encryption, and safe networking practices.",
    questions: [
      { q: "What is Phishing?", o: ["Catching fish", "Malicious email scams", "Slow internet", "A type of firewall"], a: "Malicious email scams", t: "Threats" },
      { q: "What does DDOS stand for?", o: ["Double Direct Operating System", "Distributed Denial of Service", "Deep Data Online System", "Dynamic Disk Operating System"], a: "Distributed Denial of Service", t: "Network" },
      { q: "Which protocol is the SECURE version of HTTP?", o: ["HTTP/2", "HTTPS", "FTP", "SSH"], a: "HTTPS", t: "Net" },
      { q: "What is Encryption?", o: ["Deleting data", "Scrambling data to protect it", "Zipping files", "Copying data"], a: "Scrambling data to protect it", t: "Crypto" },
      { q: "What is a Firewall?", o: ["A warm building", "A network security system", "A fast computer", "A virus"], a: "A network security system", t: "Net" },
      { q: "What is Malware?", o: ["Good software", "Malicious software", "System hardware", "Email program"], a: "Malicious software", t: "Threats" },
      { q: "What does MFA stand for?", o: ["Multi-Factor Authentication", "More Fast Access", "Main File Archiver", "Master Folder Agent"], a: "Multi-Factor Authentication", t: "Auth" },
      { q: "What is a Zero-day vulnerability?", o: ["A vulnerability with no security fix", "A 24-hour bug", "A low risk bug", "A marketing term"], a: "A vulnerability with no security fix", t: "Threats" },
      { q: "Which component encrypts your web traffic?", o: ["VPN", "ISP", "RAM", "CPU"], a: "VPN", t: "Priv" },
      { q: "What is the principle of Least Privilege?", o: ["Give everyone admin", "Give users only access they need", "Delete all users", "Hide all files"], a: "Give users only access they need", t: "Sec" }
    ]
  }
];

async function seedMassive() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) { console.log('Admin not found'); process.exit(1); }

    for (const group of languagesData) {
      console.log(`Seeding ${group.category}...`);

      const createdQuestions = await Question.insertMany(
        group.questions.map(item => ({
          questionTitle: item.q,
          problemStatement: item.q,
          options: item.o,
          correctAnswer: item.a,
          topic: item.t,
          category: group.category,
          difficulty: "medium",
          type: "MCQ",
          marks: 5,
          isPublished: true,
          createdBy: admin._id
        }))
      );

      const qIds = createdQuestions.map(q => q._id);
      const totalMarks = createdQuestions.reduce((s, q) => s + q.marks, 0);

      const existing = await Quiz.findOne({ title: group.title });
      if (existing) {
        existing.questions = qIds;
        existing.totalMarks = totalMarks;
        existing.isRandomized = true;
        await existing.save();
        console.log(`Updated ${group.title}`);
      } else {
        await Quiz.create({
          title: group.title,
          description: group.description,
          difficulty: "medium",
          category: group.category,
          timeLimit: 15,
          totalMarks,
          passingMarks: Math.ceil(totalMarks * 0.4),
          questions: qIds,
          isPublished: true,
          isRandomized: true,
          createdBy: admin._id
        });
        console.log(`Created ${group.title}`);
      }
    }

    console.log('Successfully seeded all language questions!');
    process.exit(0);
  } catch (err) { console.error(err); process.exit(1); }
}

seedMassive();
