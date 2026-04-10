const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

dotenv.config();

const coreTopics = [
  {
    category: "HTML",
    questions: [
      { q: "What does HTML stand for?", a: "Hyper Text Markup Language", o: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"] },
      { q: "Which tag is used for the largest heading?", a: "<h1>", o: ["<h6>", "<heading>", "<h1>", "<head>"] },
      { q: "Which tag creates a hyperlink?", a: "<a>", o: ["<link>", "<a>", "<href>", "<url>"] },
      { q: "Which tag inserts a line break?", a: "<br>", o: ["<break>", "<lb>", "<br>", "<newline>"] },
      { q: "Which attribute specifies image source?", a: "src", o: ["href", "link", "src", "url"] },
      { q: "What is the correct tag for a paragraph?", a: "<p>", o: ["<par>", "<paragraph>", "<p>", "<div>"] },
      { q: "How do you create an unordered list?", a: "<ul>", o: ["<ol>", "<ul>", "<li>", "<list>"] },
      { q: "Which tag is used for an image?", a: "<img>", o: ["<image>", "<img>", "<src>", "<pic>"] },
      { q: "What is the document type declaration for HTML5?", a: "<!DOCTYPE html>", o: ["<html>", "<!DOCTYPE html>", "<doctype>", "<?xml version='1.0'>"] },
      { q: "Which element contains all metadata?", a: "<head>", o: ["<body>", "<head>", "<meta>", "<info>"] },
      { q: "Which tag is used to define an internal style sheet?", a: "<style>", o: ["<css>", "<script>", "<style>", "<link>"] },
      { q: "What is the correct tag for a table row?", a: "<tr>", o: ["<td>", "<row>", "<tr>", "<th>"] },
      { q: "How do you make text bold in HTML5 (semantic)?", a: "<strong>", o: ["<b>", "<strong>", "<bold>", "<emp>"] },
      { q: "Which attribute opens a link in a new tab?", a: "target='_blank'", o: ["alt='_blank'", "target='_blank'", "new='window'", "href='_new'"] },
      { q: "What defines an abbreviation?", a: "<abbr>", o: ["<ab>", "<short>", "<abbr>", "<acronym>"] },
      { q: "Which tag is used for footer information?", a: "<footer>", o: ["<bottom>", "<end>", "<footer>", "<foot>"] },
      { q: "What is the correct tag for a bulleted list item?", a: "<li>", o: ["<bullet>", "<li>", "<item>", "<ul>"] },
      { q: "Which tag creates a dropdown list?", a: "<select>", o: ["<input type='dropdown'>", "<list>", "<select>", "<option>"] },
      { q: "How do you add a comment in HTML?", a: "<!-- comment -->", o: ["// comment", "/* comment */", "# comment", "<!-- comment -->"] },
      { q: "What is the default value of the target attribute?", a: "_self", o: ["_blank", "_self", "_parent", "_top"] },
      { q: "Which element represents the main content of a page?", a: "<main>", o: ["<section>", "<article>", "<main>", "<body>"] },
      { q: "What does the <iframe> tag do?", a: "Displays a web page within a page", o: ["Creates an image", "Displays a web page within a page", "Links a style sheet", "Plays video"] },
      { q: "Which tag defines important text?", a: "<strong>", o: ["<b>", "<important>", "<strong>", "<i>"] },
      { q: "What is the purpose of the alt attribute in img?", a: "Alternative text if image fails", o: ["Title of image", "Link for image", "Alternative text if image fails", "Size of image"] },
      { q: "Which tag is used for a checkbox?", a: "<input type='checkbox'>", o: ["<checkbox>", "<input type='check'>", "<input type='checkbox'>", "<check>"] }
    ]
  },
  {
    category: "CSS",
    questions: [
      { q: "What does CSS stand for?", a: "Cascading Style Sheets", o: ["Colorful Style Sheets", "Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets"] },
      { q: "Which property changes text color?", a: "color", o: ["font-color", "text-color", "color", "bg-color"] },
      { q: "Which property sets background color?", a: "background-color", o: ["color-background", "bgcolor", "background-color", "back-color"] },
      { q: "Which property controls font size?", a: "font-size", o: ["text-size", "size", "font-size", "text-style"] },
      { q: "What selector targets id 'demo'?", a: "#demo", o: [".demo", "#demo", "demo", "*demo"] },
      { q: "How do you select all 'p' elements?", a: "p", o: ["#p", ".p", "p", "*p"] },
      { q: "Which property adds space inside a border?", a: "padding", o: ["margin", "spacing", "padding", "border-spacing"] },
      { q: "Which property adds space outside a border?", a: "margin", o: ["padding", "margin", "spacing", "outer-space"] },
      { q: "How do you make text bold in CSS?", a: "font-weight: bold", o: ["font: bold", "text-weight: bold", "font-weight: bold", "style: bold"] },
      { q: "Which property sets the font of an element?", a: "font-family", o: ["font-name", "font-family", "font-style", "typeface"] },
      { q: "How do you center text in CSS?", a: "text-align: center", o: ["align: center", "text-center", "margin: center", "text-align: center"] },
      { q: "What is the default value of the position property?", a: "static", o: ["relative", "absolute", "static", "fixed"] },
      { q: "Which property hides an element but keeps its space?", a: "visibility: hidden", o: ["display: none", "visibility: hidden", "opacity: 0", "hidden: true"] },
      { q: "How do you select elements with class 'test'?", a: ".test", o: ["#test", ".test", "test", "*test"] },
      { q: "Which property makes a list horizontal?", a: "display: inline", o: ["list-style: horizontal", "direction: row", "display: inline", "float: left"] },
      { q: "What property changes the mouse cursor?", a: "cursor", o: ["mouse", "pointer", "cursor", "hover"] },
      { q: "How do you remove the underline from links?", a: "text-decoration: none", o: ["text-style: no-underline", "decoration: none", "text-decoration: none", "link-style: none"] },
      { q: "Which property controls the stacking order of elements?", a: "z-index", o: ["order", "stack", "z-index", "layer"] },
      { q: "How do you make a border rounded?", a: "border-radius", o: ["border-curve", "corner-radius", "border-round", "border-radius"] },
      { q: "What is the correct CSS syntax?", a: "p { color: red; }", o: ["p: color=red;", "p { color: red; }", "{ p; color: red; }", "p: color(red);"] },
      { q: "Which property sets the transparency of an element?", a: "opacity", o: ["transparent", "filter", "opacity", "alpha"] },
      { q: "What property defines the width of an element's border?", a: "border-width", o: ["border-size", "border-width", "stroke-width", "outline-width"] },
      { q: "How do you apply a style to multiple selectors?", a: "Separator with comma", o: ["Separator with comma", "Separator with space", "Separator with dot", "Separator with plus"] },
      { q: "Which property sets the shadow of a box?", a: "box-shadow", o: ["shadow-effect", "border-shadow", "box-shadow", "element-shadow"] },
      { q: "What is Flexbox used for?", a: "Aligning items in a container", o: ["Animating elements", "Aligning items in a container", "Handling databases", "Setting font styles"] }
    ]
  },
  {
    category: "JavaScript",
    questions: [
      { q: "Which keyword declares a block-scoped variable?", a: "let", o: ["var", "let", "declare", "define"] },
      { q: "Which method prints to the console?", a: "console.log()", o: ["print()", "alert()", "console.log()", "write()"] },
      { q: "What symbol is used for single-line comments?", a: "//", o: ["#", "--", "//", "/*"] },
      { q: "What is the output of typeof 'hello'?", a: "'string'", o: ["'text'", "'string'", "'char'", "'object'"] },
      { q: "How do you write an if statement?", a: "if (condition)", o: ["if x > 5", "if (condition)", "if condition then", "if [condition]"] },
      { q: "Which operator checks both value and type?", a: "===", o: ["==", "=", "===", "!=="] },
      { q: "How do you create a function in JS?", a: "function myFunc()", o: ["create function myFunc()", "function:myFunc()", "function myFunc()", "myFunc = function"] },
      { q: "What is an array in JavaScript?", a: "A list-like object", o: ["A database", "A list-like object", "A single string", "A numbers only type"] },
      { q: "How do you get the length of an array?", a: "arr.length", o: ["arr.size()", "arr.length", "arr.count", "arr.len"] },
      { q: "What is the result of '5' + 5?", a: "'55'", o: ["10", "'55'", "Error", "undefined"] },
      { q: "which method removes the last element of an array?", a: "pop()", o: ["shift()", "pop()", "remove()", "delete()"] },
      { q: "How do you call a function?", a: "myFunc()", o: ["call myFunc()", "myFunc()", "execute myFunc()", "start myFunc()"] },
      { q: "What is DOM?", a: "Document Object Model", o: ["Data Object Model", "Document Object Model", "Direct Object Mapping", "Display Object Method"] },
      { q: "How do you find an element by ID?", a: "document.getElementById()", o: ["find()", "select()", "document.getElementById()", "element.get()"] },
      { q: "Which event occurs when a user clicks?", a: "onclick", o: ["onpress", "onclick", "onmouseclick", "onhit"] },
      { q: "How do you write a for loop?", a: "for (let i=0; i<n; i++)", o: ["for i in range(n)", "for (let i=0; i<n; i++)", "loop(n)", "iterate(n)"] },
      { q: "What does 'NaN' stand for?", a: "Not a Number", o: ["No available Number", "Not a Number", "New assigned Number", "Null and Negated"] },
      { q: "How do you declare a constant?", a: "const", o: ["constant", "final", "const", "static"] },
      { q: "Which method joins array elements into a string?", a: "join()", o: ["concat()", "join()", "merge()", "string()"] },
      { q: "What is a Closure in JS?", a: "Function with its lexical environment", o: ["Closing a browser tab", "Function with its lexical environment", "An object property", "A type of loop"] },
      { q: "What is an Arrow Function?", a: "() => { ... }", o: ["function -> {}", "() => { ... }", "def func() ->", "lambda: ..."] },
      { q: "How do you convert string to integer?", a: "parseInt()", o: ["toNumber()", "parseInt()", "castInt()", "stringToInt()"] },
      { q: "What is 'strict mode'?", a: "'use strict'", o: ["strict: true", "high-security: on", "'use strict'", "set strict"] },
      { q: "Which keyword refers to the current object?", a: "this", o: ["self", "this", "current", "me"] },
      { q: "What is an asynchronous function keyword?", a: "async", o: ["wait", "promise", "async", "deferred"] }
    ]
  }
];

async function restoreOld() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Restoring high-quality questons (25 per paper)...');
    
    await Question.deleteMany({});
    await Quiz.deleteMany({});

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) { console.error('Admin not found'); process.exit(1); }

    for (const group of coreTopics) {
      console.log(`Restoring ${group.category}...`);
      const createdQuestions = await Question.insertMany(
        group.questions.map(item => ({
          questionTitle: item.q,
          problemStatement: item.q,
          options: item.o,
          correctAnswer: item.a,
          topic: group.category,
          category: group.category,
          difficulty: "easy",
          type: "MCQ",
          marks: 4, // 25 * 4 = 100 marks total
          isPublished: true,
          createdBy: admin._id
        }))
      );

      const qIds = createdQuestions.map(q => q._id);
      
      await Quiz.create({
        title: `${group.category} Foundations`,
        description: `Complete foundational assessment for ${group.category}. 25 questions to test your core understanding.`,
        difficulty: "easy",
        category: group.category,
        timeLimit: 20,
        totalMarks: 100,
        passingMarks: 40,
        questions: qIds,
        isPublished: true,
        isRandomized: true,
        createdBy: admin._id
      });
    }

    console.log('\n✅ Old version restored with 25 questions per paper!');
    console.log('   New UI components (timer, selector) remain active.');
    process.exit(0);
  } catch (err) { console.error(err); process.exit(1); }
}

restoreOld();
