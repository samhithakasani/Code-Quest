========================================================
CODEQUEST
THE ULTIMATE CODING LEARNING & ASSESSMENT PLATFORM
========================================================

Project Name:
CodeQuest

Project Type:
MERN Stack based Web Application for Coding Education and Quiz Assessments

Developed Using:
React, Vite, Node.js, Express, MongoDB, Mongoose, JWT, 
Bcryptjs, CSS, JavaScript

========================================================
1. PROJECT OVERVIEW
========================================================

CodeQuest is a comprehensive educational platform designed to help developers and students 
master various programming languages and technologies through interactive quizzes and 
performance tracking. The system provides multiple learning modules such as:

1. HTML Foundations
2. CSS Styling & Layouts
3. JavaScript Essentials
4. Advanced React Hooks & Patterns
5. Node.js & Backend Development
6. Database Management (SQL & NoSQL)
7. Cloud Computing & AWS
8. Cybersecurity Fundamentals
9. Data Structures & Algorithms
10. Real-time Leaderboard & Gamification (BitePoints)

This project allows users to test their knowledge, track their progress, and see where 
they stand among their peers through a dynamic leaderboard and a gamified reward system.

========================================================
2. MAIN OBJECTIVE
========================================================

The main objective of CodeQuest is to provide a structured and engaging environment for 
self-assessment in software development, enabling users to identify knowledge gaps 
and improve their technical skills systematically.

========================================================
3. FEATURES OF THE PROJECT
========================================================

- **Secure User Authentication:** Register and Login with protected credentials.
- **Dynamic Quiz Engine:** Attempt time-bound quizzes on various tech stacks.
- **Leaderboard System:** Real-time ranking of top performers.
- **BitePoints Loyalty System:** Earn points for successful quiz attempts.
- **Difficulty Levels:** Choose between Easy, Medium, and Hard challenges.
- **Question Bank:** Extensive collection of thousands of coding questions.
- **Performance Analytics:** Detailed reports on quiz scores and accuracy.
- **Admin Dashboard:** Control center for managing users, quizzes, and questions.
- **Responsive Design:** Fully functional across desktop and mobile devices.
- **Progress Tracking:** History of all previous quiz attempts and results.

========================================================
4. TECHNOLOGIES USED
========================================================

Frontend:
- React (Vite-powered)
- Context API (State Management)
- Vanilla CSS (Custom Styling)
- Axios (API Communication)

Backend:
- Node.js
- Express.js
- JWT (Authentication)
- Bcryptjs (Security)

Database:
- MongoDB
- Mongoose ODM

Utilities:
- Concurrently (Run both servers together)
- Morgan & Helmet (Logging and Security)

========================================================
5. PROJECT FOLDER PURPOSE
========================================================

Important files/folders used in the project:

1. Root Directory
   Contains `package.json` for managing both frontend and backend concurrently.

2. backend/
   The server-side application containing routes, controllers, models, and seeding scripts.

3. frontend/
   The client-side React application containing the UI, components, and pages.

4. backend/models/
   Database schemas for Users, Quizzes, Questions, and Results.

5. backend/seed.js
   Scripts to populate the database with initial question banks.

6. frontend/src/context/
   Context providers for authentication and global state management.

========================================================
6. SOFTWARE REQUIREMENTS
========================================================

- Node.js (v16.x or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB Community Server
- Modern Web Browser (Chrome, Firefox, or Edge)

========================================================
7. HOW TO RUN THE PROJECT
========================================================

Follow the below steps carefully to run the CodeQuest project:

STEP 1:
Open the project folder in your terminal.

STEP 2:
Install all required libraries for BOTH frontend and backend using:
`npm run install-all`

STEP 3:
Configure your environment variables in `backend/.env` (PORT, MONGO_URI, JWT_SECRET).

STEP 4:
Seed the database with initial questions (Optional but recommended):
`npm run seed-comprehensive --prefix backend`

STEP 5:
Run both the frontend and backend servers simultaneously using:
`npm run dev`

STEP 6:
Open your browser and visit:
Frontend: http://localhost:5173
Backend: http://localhost:5000

========================================================
8. HOW TO USE THE PROJECT
========================================================

CodeQuest can be used in the following step-by-step process.

--------------------------------------------------------
A. USER / STUDENT SIDE WORKING PROCESS
--------------------------------------------------------

STEP 1: Open the landing page
- Launch the application and explore the introduction.

STEP 2: Register/Login
- Create a new account or sign in with your credentials.
- Use `samhitha@gmail.com` / `samhitha` for a quick test if available.

STEP 3: Navigate to Dashboard
- View available quiz categories and your current status.

STEP 4: Select a Topic & Difficulty
- Browse through HTML, CSS, JS, etc.
- Choose between Easy, Medium, or Hard levels.

STEP 5: Attempt the Quiz
- Answer questions within the given time limit.
- Monitor the timer to ensure submission before time runs out.

STEP 6: View Results
- Get instant feedback on your score and accuracy.
- See how many questions you answered correctly.

STEP 7: Earn BitePoints
- Successful completion adds points to your profile.

STEP 8: Check Leaderboard
- Compare your score with other students in real-time.

--------------------------------------------------------
B. ADMIN SIDE WORKING PROCESS
--------------------------------------------------------

STEP 1: Login as Admin
- Access the admin portal with supervisor credentials.

STEP 2: Monitor Analytics
- View total users, total attempts, and popular topics.

STEP 3: Manage Question Bank
- Add, edit, or delete questions from specific categories.

STEP 4: User Management
- View and manage student profiles and performances.

========================================================
9. MODULE-WISE WORKING
========================================================

1. QUIZ MODULE
   - Dynamic question fetching based on topic and difficulty.
   - Timer-based assessment engine.
   - State-managed navigation (Next/Previous).

2. AUTHENTICATION MODULE
   - JWT-based session management.
   - Secure password hashing with Bcrypt.
   - Protected routes in React.

3. LEADERBOARD MODULE
   - Aggregated data from all user results.
   - Sorted display of top scorers and BitePoint earners.

4. SEEDING MODULE
   - Utility scripts to quickly populate thousands of questions.
   - Support for specific tech stacks and expanded banks.

========================================================
10. DEVELOPMENT WORKFLOW
========================================================

The project follows a standard MERN production workflow:

1. API Design in Express/Node
2. MongoDB Schema Definition
3. Backend Route & Controller Implementation
4. JWT Middleware for Protected API Access
5. React Component Architecture Design
6. Context API for Global State
7. Frontend-Backend Integration via Axios
8. Responsive UI Styling with Vanilla CSS

========================================================
11. GENERAL WORKING FLOW OF THE PROJECT
========================================================

Start
  ->
Open CodeQuest
  ->
Login / Register
  ->
Dashboard
  ->
Select Topic (e.g., JavaScript)
  ->
Choose Difficulty (Easy/Medium/Hard)
  ->
Start Quiz (Timer begins)
  ->
Answer Questions
  ->
Submit Quiz
  ->
Calculate Results
  ->
Update BitePoints & Leaderboard
  ->
View Performance Report
  ->
Logout
  ->
End

========================================================
12. DATABASE USAGE
========================================================

The project uses MongoDB collections for:

- **Users:** Stores profiles, login info, and BitePoints.
- **Quizzes:** Stores topic metadata and descriptions.
- **Questions:** Stores individual question data, options, and answers.
- **Results:** Stores history of all completed quiz attempts.

========================================================
13. HOW TO SEED THE DATABASE
========================================================

To populate your database with questions:

1. Open a terminal in the root folder.
2. Run `npm run seed-comprehensive --prefix backend` to add several topics.
3. Use `npm run seed-massive --prefix backend` for a large question bank.
4. Verify question counts in your MongoDB database.

========================================================
14. HOW TO ATTEMPT QUIZZES
========================================================

1. Go to the "All Quizzes" page.
2. Filter by category if needed.
3. Click "Start Quiz" on your chosen topic.
4. Answer each question carefully.
5. Click "Submit" at the end to save your progress.

========================================================
15. PERFORMANCE METRICS
========================================================

- **Score Percentage:** Calculated based on correct answers vs total questions.
- **Attempt Time:** Tracking how fast the user completed the quiz.
- **Accuracy Ranking:** Ratio of correct answers across all attempts.
- **BitePoints:** Gamified score based on cumulative performance.

========================================================
16. ADVANTAGES OF THE PROJECT
========================================================

- **Centralized Learning:** All major tech stacks in one place.
- **Gamified Experience:** Leaderboards and points keep users engaged.
- **Massive Content:** Thousands of questions available for practice.
- **Real-time Feedback:** Instant grading and performance summaries.
- **Admin Control:** Easy to scale and manage content.

========================================================
17. TROUBLESHOOTING
========================================================

If the project is not running properly, check:

1. **MongoDB Connection:** Is your MongoDB service running or is the URI correct?
2. **Environment Variables:** Did you create the `.env` file in the backend folder?
3. **Port Conflicts:** Are ports 5000 (Backend) or 5173 (Frontend) already in use?
4. **Dependencies:** Did you run `npm run install-all` from the root?

Solutions:
- Check backend console logs for database connection errors.
- Restart the server with `npm run dev`.

========================================================
18. SAMPLE COMMANDS
========================================================

Install Everything:
`npm run install-all`

Run Project:
`npm run dev`

Seed Data:
`npm run seed-comprehensive --prefix backend`

========================================================
19. TARGET AUDIENCE
========================================================

- **Students:** Preparing for technical interviews or exams.
- **Teachers:** Setting up assessments for students.
- **Developers:** Self-testing their knowledge on new stacks.
- **Recruiters:** Evaluating candidate skills via custom quizzes.

========================================================
20. CONCLUSION
========================================================

CodeQuest is a modern, scalable solution for technical skill assessment and learning. 
By combining a robust MERN backend with a fast React frontend, it provides an 
unmatched experience for both students and administrators. Whether you are 
practicing for your first job or managing a classroom of developers, 
CodeQuest offers the tools you need to succeed in the coding world.

========================================================
END OF README
========================================================
