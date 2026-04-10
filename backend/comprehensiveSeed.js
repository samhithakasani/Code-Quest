const mongoose = require('mongoose');
const PaperSet = require('./models/PaperSet');
const Question = require('./models/Question');
const User = require('./models/User');
require('dotenv').config();

// Comprehensive Question Bank for All Technologies
const comprehensiveQuestions = [
  // HTML Questions
  {
    questionTitle: new Map([
      ['English', 'HTML5 Semantic Elements'],
      ['Hindi', 'HTML5 सिमैंटिक एलिमेंट्स'],
      ['Spanish', 'Elementos Semánticos HTML5'],
      ['French', 'Éléments Sémantiques HTML5']
    ]),
    problemStatement: new Map([
      ['English', 'Which HTML5 element is used to define navigation links?'],
      ['Hindi', 'नेविगेशन लिंक्स को परिभाषित करने के लिए किस HTML5 एलिमेंट का उपयोग किया जाता है?'],
      ['Spanish', '¿Qué elemento HTML5 se usa para definir enlaces de navegación?'],
      ['French', 'Quel élément HTML5 est utilisé pour définir les liens de navigation ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'HTML',
    options: new Map([
      ['English', ['<nav>', '<navigation>', '<menu>', '<navbar>']],
      ['Hindi', ['<nav>', '<navigation>', '<menu>', '<navbar>']],
      ['Spanish', ['<nav>', '<navigation>', '<menu>', '<navbar>']],
      ['French', ['<nav>', '<navigation>', '<menu>', '<navbar>']]
    ]),
    correctAnswer: new Map([
      ['English', '<nav>'],
      ['Hindi', '<nav>'],
      ['Spanish', '<nav>'],
      ['French', '<nav>']
    ]),
    explanation: new Map([
      ['English', 'The <nav> element is specifically designed for navigation links in HTML5'],
      ['Hindi', '<nav> एलिमेंट HTML5 में विशेष रूप से नेविगेशन लिंक्स के लिए डिज़ाइन किया गया है'],
      ['Spanish', 'El elemento <nav> está diseñado específicamente para enlaces de navegación en HTML5'],
      ['French', 'L\'élément <nav> est spécifiquement conçu pour les liens de navigation dans HTML5']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },
  {
    questionTitle: new Map([
      ['English', 'HTML Forms'],
      ['Hindi', 'HTML फॉर्म्स'],
      ['Spanish', 'Formularios HTML'],
      ['French', 'Formulaires HTML']
    ]),
    problemStatement: new Map([
      ['English', 'Which attribute is required for all HTML form elements?'],
      ['Hindi', 'सभी HTML फॉर्म एलिमेंट्स के लिए कौन सा एट्रिब्यूट आवश्यक है?'],
      ['Spanish', '¿Qué atributo es requerido para todos los elementos de formulario HTML?'],
      ['French', 'Quel attribut est requis pour tous les éléments de formulaire HTML ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'HTML',
    options: new Map([
      ['English', ['name', 'id', 'class', 'type']],
      ['Hindi', ['name', 'id', 'class', 'type']],
      ['Spanish', ['name', 'id', 'class', 'type']],
      ['French', ['name', 'id', 'class', 'type']]
    ]),
    correctAnswer: new Map([
      ['English', 'name'],
      ['Hindi', 'name'],
      ['Spanish', 'name'],
      ['French', 'name']
    ]),
    explanation: new Map([
      ['English', 'The name attribute is required to identify form data when submitted'],
      ['Hindi', 'फॉर्म डेटा को प्रस्तुत करते समय उसे पहचानने के लिए name एट्रिब्यूट आवश्यक है'],
      ['Spanish', 'El atributo name es requerido para identificar los datos del formulario cuando se envían'],
      ['French', 'L\'attribut name est requis pour identifier les données du formulaire lors de la soumission']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },

  // CSS Questions
  {
    questionTitle: new Map([
      ['English', 'CSS Flexbox'],
      ['Hindi', 'CSS फ्लेक्सबॉक्स'],
      ['Spanish', 'CSS Flexbox'],
      ['French', 'CSS Flexbox']
    ]),
    problemStatement: new Map([
      ['English', 'Which CSS property is used to align items in a flex container?'],
      ['Hindi', 'फ्लेक्स कंटेनर में आइटम्स को संरेखित करने के लिए किस CSS प्रॉपर्टी का उपयोग किया जाता है?'],
      ['Spanish', '¿Qué propiedad CSS se usa para alinear elementos en un contenedor flex?'],
      ['French', 'Quelle propriété CSS est utilisée pour aligner les éléments dans un conteneur flex ?']
    ]),
    type: 'mcq',
    difficulty: 'medium',
    topic: 'CSS',
    options: new Map([
      ['English', ['align-items', 'justify-content', 'flex-align', 'item-align']],
      ['Hindi', ['align-items', 'justify-content', 'flex-align', 'item-align']],
      ['Spanish', ['align-items', 'justify-content', 'flex-align', 'item-align']],
      ['French', ['align-items', 'justify-content', 'flex-align', 'item-align']]
    ]),
    correctAnswer: new Map([
      ['English', 'align-items'],
      ['Hindi', 'align-items'],
      ['Spanish', 'align-items'],
      ['French', 'align-items']
    ]),
    explanation: new Map([
      ['English', 'align-items property aligns flex items along the cross axis'],
      ['Hindi', 'align-items प्रॉपर्टी फ्लेक्स आइटम्स को क्रॉस एक्सिस के साथ संरेखित करती है'],
      ['Spanish', 'La propiedad align-items alinea los elementos flex a lo largo del eje transversal'],
      ['French', 'La propriété align-items aligne les éléments flex le long de l\'axe transversal']
    ]),
    marks: 15,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },
  {
    questionTitle: new Map([
      ['English', 'CSS Grid'],
      ['Hindi', 'CSS ग्रिड'],
      ['Spanish', 'CSS Grid'],
      ['French', 'CSS Grid']
    ]),
    problemStatement: new Map([
      ['English', 'What is the CSS property to create a grid container?'],
      ['Hindi', 'ग्रिड कंटेनर बनाने के लिए CSS प्रॉपर्टी क्या है?'],
      ['Spanish', '¿Cuál es la propiedad CSS para crear un contenedor de cuadrícula?'],
      ['French', 'Quelle est la propriété CSS pour créer un conteneur de grille ?']
    ]),
    type: 'mcq',
    difficulty: 'medium',
    topic: 'CSS',
    options: new Map([
      ['English', ['display: grid', 'grid: container', 'display: flex', 'grid-container']],
      ['Hindi', ['display: grid', 'grid: container', 'display: flex', 'grid-container']],
      ['Spanish', ['display: grid', 'grid: container', 'display: flex', 'grid-container']],
      ['French', ['display: grid', 'grid: container', 'display: flex', 'grid-container']]
    ]),
    correctAnswer: new Map([
      ['English', 'display: grid'],
      ['Hindi', 'display: grid'],
      ['Spanish', 'display: grid'],
      ['French', 'display: grid']
    ]),
    explanation: new Map([
      ['English', 'display: grid creates a grid container for CSS Grid Layout'],
      ['Hindi', 'display: grid CSS Grid Layout के लिए एक ग्रिड कंटेनर बनाता है'],
      ['Spanish', 'display: grid crea un contenedor de cuadrícula para CSS Grid Layout'],
      ['French', 'display: grid crée un conteneur de grille pour CSS Grid Layout']
    ]),
    marks: 15,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },

  // JavaScript Questions
  {
    questionTitle: new Map([
      ['English', 'JavaScript Variables'],
      ['Hindi', 'जावास्क्रिप्ट वेरिएबल्स'],
      ['Spanish', 'Variables JavaScript'],
      ['French', 'Variables JavaScript']
    ]),
    problemStatement: new Map([
      ['English', 'What is the difference between let and const in JavaScript?'],
      ['Hindi', 'जावास्क्रिप्ट में let और const में क्या अंतर है?'],
      ['Spanish', '¿Cuál es la diferencia entre let y const en JavaScript?'],
      ['French', 'Quelle est la différence entre let et const en JavaScript ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'JavaScript',
    options: new Map([
      ['English', [
        'let can be reassigned, const cannot',
        'const can be reassigned, let cannot',
        'Both are the same',
        'let is function scoped, const is block scoped'
      ]],
      ['Hindi', [
        'let को रीअसाइन किया जा सकता है, const नहीं',
        'const को रीअसाइन किया जा सकता है, let नहीं',
        'दोनों समान हैं',
        'let फंक्शन स्कोप्ड है, const ब्लॉक स्कोप्ड है'
      ]],
      ['Spanish', [
        'let puede ser reasignado, const no',
        'const puede ser reasignado, let no',
        'Ambos son iguales',
        'let tiene ámbito de función, const tiene ámbito de bloque'
      ]],
      ['French', [
        'let peut être réaffecté, const ne peut pas',
        'const peut être réaffecté, let ne peut pas',
        'Les deux sont identiques',
        'let a une portée de fonction, const a une portée de bloc'
      ]]
    ]),
    correctAnswer: new Map([
      ['English', 'let can be reassigned, const cannot'],
      ['Hindi', 'let को रीअसाइन किया जा सकता है, const नहीं'],
      ['Spanish', 'let puede ser reasignado, const no'],
      ['French', 'let peut être réaffecté, const ne peut pas']
    ]),
    explanation: new Map([
      ['English', 'let allows reassignment of values, const creates constants that cannot be reassigned'],
      ['Hindi', 'let मानों के पुनर्नियुक्ति की अनुमति देता है, const स्थिरांक बनाता है जिन्हें पुनर्नियुक्त नहीं किया जा सकता'],
      ['Spanish', 'let permite la reasignación de valores, const crea constantes que no pueden ser reasignadas'],
      ['French', 'let permet la réaffectation des valeurs, const crée des constantes qui ne peuvent pas être réaffectées']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },
  {
    questionTitle: new Map([
      ['English', 'JavaScript Arrays'],
      ['Hindi', 'जावास्क्रिप्ट ऐरेज'],
      ['Spanish', 'Arrays JavaScript'],
      ['French', 'Tableaux JavaScript']
    ]),
    problemStatement: new Map([
      ['English', 'Which method adds an element to the end of an array?'],
      ['Hindi', 'कौन सा मेथड ऐरे के अंत में एक एलिमेंट जोड़ता है?'],
      ['Spanish', '¿Qué método agrega un elemento al final de un array?'],
      ['French', 'Quelle méthode ajoute un élément à la fin d\'un tableau ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'JavaScript',
    options: new Map([
      ['English', ['push()', 'pop()', 'shift()', 'unshift()']],
      ['Hindi', ['push()', 'pop()', 'shift()', 'unshift()']],
      ['Spanish', ['push()', 'pop()', 'shift()', 'unshift()']],
      ['French', ['push()', 'pop()', 'shift()', 'unshift()']]
    ]),
    correctAnswer: new Map([
      ['English', 'push()'],
      ['Hindi', 'push()'],
      ['Spanish', 'push()'],
      ['French', 'push()']
    ]),
    explanation: new Map([
      ['English', 'push() method adds one or more elements to the end of an array'],
      ['Hindi', 'push() मेथड ऐरे के अंत में एक या अधिक एलिमेंट्स जोड़ता है'],
      ['Spanish', 'El método push() agrega uno o más elementos al final de un array'],
      ['French', 'La méthode push() ajoute un ou plusieurs éléments à la fin d\'un tableau']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },

  // Python Questions
  {
    questionTitle: new Map([
      ['English', 'Python Data Types'],
      ['Hindi', 'पायथन डेटा टाइप्स'],
      ['Spanish', 'Tipos de Datos Python'],
      ['French', 'Types de Données Python']
    ]),
    problemStatement: new Map([
      ['English', 'What is the output of: print(type([1, 2, 3]))?'],
      ['Hindi', 'print(type([1, 2, 3])) का आउटपुट क्या है?'],
      ['Spanish', '¿Cuál es la salida de: print(type([1, 2, 3]))?'],
      ['French', 'Quelle est la sortie de: print(type([1, 2, 3])) ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'Python',
    options: new Map([
      ['English', ['<class \'list\'>', '<class \'tuple\'>', '<class \'array\'>', '<class \'set\'>']],
      ['Hindi', ['<class \'list\'>', '<class \'tuple\'>', '<class \'array\'>', '<class \'set\'>']],
      ['Spanish', ['<class \'list\'>', '<class \'tuple\'>', '<class \'array\'>', '<class \'set\'>']],
      ['French', ['<class \'list\'>', '<class \'tuple\'>', '<class \'array\'>', '<class \'set\'>']]
    ]),
    correctAnswer: new Map([
      ['English', '<class \'list\'>'],
      ['Hindi', '<class \'list\'>'],
      ['Spanish', '<class \'list\'>'],
      ['French', '<class \'list\'>']
    ]),
    explanation: new Map([
      ['English', '[1, 2, 3] is a list in Python, so type() returns <class \'list\'>'],
      ['Hindi', '[1, 2, 3] पायथन में एक लिस्ट है, इसलिए type() <class \'list\'> लौटाता है'],
      ['Spanish', '[1, 2, 3] es una lista en Python, por lo que type() devuelve <class \'list\'>'],
      ['French', '[1, 2, 3] est une liste en Python, donc type() retourne <class \'list\'>']
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
      ['English', 'What will be the output of: for i in range(2): print(i)'],
      ['Hindi', 'for i in range(2): print(i) का आउटपुट क्या होगा?'],
      ['Spanish', '¿Cuál será la salida de: for i in range(2): print(i)'],
      ['French', 'Quelle sera la sortie de: for i in range(2): print(i)']
    ]),
    type: 'code_output',
    difficulty: 'easy',
    topic: 'Python',
    correctAnswer: new Map([
      ['English', '0\n1'],
      ['Hindi', '0\n1'],
      ['Spanish', '0\n1'],
      ['French', '0\n1']
    ]),
    explanation: new Map([
      ['English', 'range(2) generates numbers 0 and 1'],
      ['Hindi', 'range(2) संख्याएँ 0 और 1 उत्पन्न करता है'],
      ['Spanish', 'range(2) genera los números 0 y 1'],
      ['French', 'range(2) génère les nombres 0 et 1']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },

  // Java Questions
  {
    questionTitle: new Map([
      ['English', 'Java OOP'],
      ['Hindi', 'जावा OOP'],
      ['Spanish', 'OOP Java'],
      ['French', 'OOP Java']
    ]),
    problemStatement: new Map([
      ['English', 'Which concept allows one class to inherit from another in Java?'],
      ['Hindi', 'जावा में कौन सी कॉन्सेप्ट एक क्लास को दूसरे से इनहेरिट करने की अनुमति देती है?'],
      ['Spanish', '¿Qué concepto permite que una clase herede de otra en Java?'],
      ['French', 'Quel concept permet à une classe d\'hériter d\'une autre en Java ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'Java',
    options: new Map([
      ['English', ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction']],
      ['Hindi', ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction']],
      ['Spanish', ['Herencia', 'Polimorfismo', 'Encapsulación', 'Abstracción']],
      ['French', ['Héritage', 'Polymorphisme', 'Encapsulation', 'Abstraction']]
    ]),
    correctAnswer: new Map([
      ['English', 'Inheritance'],
      ['Hindi', 'Inheritance'],
      ['Spanish', 'Herencia'],
      ['French', 'Héritage']
    ]),
    explanation: new Map([
      ['English', 'Inheritance allows a class to inherit properties and methods from another class'],
      ['Hindi', 'इनहेरिटेंस एक क्लास को दूसरे क्लास से प्रॉपर्टीज और मेथड्स इनहेरिट करने की अनुमति देता है'],
      ['Spanish', 'La herencia permite que una clase herede propiedades y métodos de otra clase'],
      ['French', 'L\'héritage permet à une classe d\'hériter des propriétés et méthodes d\'une autre classe']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },
  {
    questionTitle: new Map([
      ['English', 'Java Exception Handling'],
      ['Hindi', 'जावा एक्सेप्शन हैंडलिंग'],
      ['Spanish', 'Manejo de Excepciones Java'],
      ['French', 'Gestion des Exceptions Java']
    ]),
    problemStatement: new Map([
      ['English', 'Which keyword is used to handle exceptions in Java?'],
      ['Hindi', 'जावा में एक्सेप्शन्स को हैंडल करने के लिए किस कीवर्ड का उपयोग किया जाता है?'],
      ['Spanish', '¿Qué palabra clave se usa para manejar excepciones en Java?'],
      ['French', 'Quel mot-clé est utilisé pour gérer les exceptions en Java ?']
    ]),
    type: 'mcq',
    difficulty: 'medium',
    topic: 'Java',
    options: new Map([
      ['English', ['try-catch', 'try-except', 'catch-throw', 'handle-catch']],
      ['Hindi', ['try-catch', 'try-except', 'catch-throw', 'handle-catch']],
      ['Spanish', ['try-catch', 'try-except', 'catch-throw', 'handle-catch']],
      ['French', ['try-catch', 'try-except', 'catch-throw', 'handle-catch']]
    ]),
    correctAnswer: new Map([
      ['English', 'try-catch'],
      ['Hindi', 'try-catch'],
      ['Spanish', 'try-catch'],
      ['French', 'try-catch']
    ]),
    explanation: new Map([
      ['English', 'try-catch blocks are used to handle exceptions in Java'],
      ['Hindi', 'try-catch ब्लॉक्स जावा में एक्सेप्शन्स को हैंडल करने के लिए उपयोग किए जाते हैं'],
      ['Spanish', 'Los bloques try-catch se usan para manejar excepciones en Java'],
      ['French', 'Les blocs try-catch sont utilisés pour gérer les exceptions en Java']
    ]),
    marks: 15,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },

  // C++ Questions
  {
    questionTitle: new Map([
      ['English', 'C++ Pointers'],
      ['Hindi', 'C++ पॉइंटर्स'],
      ['Spanish', 'Punteros C++'],
      ['French', 'Pointeurs C++']
    ]),
    problemStatement: new Map([
      ['English', 'What operator is used to access the value pointed to by a pointer?'],
      ['Hindi', 'पॉइंटर द्वारा इंगित मान तक पहुंचने के लिए किस ऑपरेटर का उपयोग किया जाता है?'],
      ['Spanish', '¿Qué operador se usa para acceder al valor apuntado por un puntero?'],
      ['French', 'Quel opérateur est utilisé pour accéder à la valeur pointée par un pointeur ?']
    ]),
    type: 'mcq',
    difficulty: 'medium',
    topic: 'C++',
    options: new Map([
      ['English', ['*', '&', '->', '.']],
      ['Hindi', ['*', '&', '->', '.']],
      ['Spanish', ['*', '&', '->', '.']],
      ['French', ['*', '&', '->', '.']]
    ]),
    correctAnswer: new Map([
      ['English', '*'],
      ['Hindi', '*'],
      ['Spanish', '*'],
      ['French', '*']
    ]),
    explanation: new Map([
      ['English', 'The dereference operator (*) is used to access the value pointed to by a pointer'],
      ['Hindi', 'डीरेफेरेंस ऑपरेटर (*) पॉइंटर द्वारा इंगित मान तक पहुंचने के लिए उपयोग किया जाता है'],
      ['Spanish', 'El operador de desreferencia (*) se usa para acceder al valor apuntado por un puntero'],
      ['French', 'L\'opérateur de déréférencement (*) est utilisé pour accéder à la valeur pointée par un pointeur']
    ]),
    marks: 15,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },
  {
    questionTitle: new Map([
      ['English', 'C++ STL'],
      ['Hindi', 'C++ STL'],
      ['Spanish', 'STL C++'],
      ['French', 'STL C++']
    ]),
    problemStatement: new Map([
      ['English', 'Which STL container provides dynamic array functionality?'],
      ['Hindi', 'कौन सा STL कंटेनर डायनामिक ऐरे फंक्शनैलिटी प्रदान करता है?'],
      ['Spanish', '¿Qué contenedor STL proporciona funcionalidad de array dinámico?'],
      ['French', 'Quel conteneur STL fournit une fonctionnalité de tableau dynamique ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'C++',
    options: new Map([
      ['English', ['vector', 'list', 'deque', 'array']],
      ['Hindi', ['vector', 'list', 'deque', 'array']],
      ['Spanish', ['vector', 'list', 'deque', 'array']],
      ['French', ['vector', 'list', 'deque', 'array']]
    ]),
    correctAnswer: new Map([
      ['English', 'vector'],
      ['Hindi', 'vector'],
      ['Spanish', 'vector'],
      ['French', 'vector']
    ]),
    explanation: new Map([
      ['English', 'vector provides dynamic array functionality with automatic memory management'],
      ['Hindi', 'vector स्वचालित मेमोरी मैनेजमेंट के साथ डायनामिक ऐरे फंक्शनैलिटी प्रदान करता है'],
      ['Spanish', 'vector proporciona funcionalidad de array dinámico con gestión automática de memoria'],
      ['French', 'vector fournit une fonctionnalité de tableau dynamique avec gestion automatique de la mémoire']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },

  // React Questions
  {
    questionTitle: new Map([
      ['English', 'React Hooks'],
      ['Hindi', 'React हुक्स'],
      ['Spanish', 'Hooks React'],
      ['French', 'Hooks React']
    ]),
    problemStatement: new Map([
      ['English', 'Which hook is used to manage state in functional components?'],
      ['Hindi', 'फंक्शनल कंपोनेंट्स में स्टेट मैनेज करने के लिए किस हुक का उपयोग किया जाता है?'],
      ['Spanish', '¿Qué hook se usa para manejar estado en componentes funcionales?'],
      ['French', 'Quel hook est utilisé pour gérer l\'état dans les composants fonctionnels ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'React',
    options: new Map([
      ['English', ['useState', 'useEffect', 'useContext', 'useReducer']],
      ['Hindi', ['useState', 'useEffect', 'useContext', 'useReducer']],
      ['Spanish', ['useState', 'useEffect', 'useContext', 'useReducer']],
      ['French', ['useState', 'useEffect', 'useContext', 'useReducer']]
    ]),
    correctAnswer: new Map([
      ['English', 'useState'],
      ['Hindi', 'useState'],
      ['Spanish', 'useState'],
      ['French', 'useState']
    ]),
    explanation: new Map([
      ['English', 'useState hook is used to add state to functional components'],
      ['Hindi', 'useState हुक फंक्शनल कंपोनेंट्स में स्टेट जोड़ने के लिए उपयोग किया जाता है'],
      ['Spanish', 'El hook useState se usa para agregar estado a componentes funcionales'],
      ['French', 'Le hook useState est utilisé pour ajouter de l\'état aux composants fonctionnels']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },
  {
    questionTitle: new Map([
      ['English', 'React Props'],
      ['Hindi', 'React प्रॉप्स'],
      ['Spanish', 'Props React'],
      ['French', 'Props React']
    ]),
    problemStatement: new Map([
      ['English', 'How do you pass props to a React component?'],
      ['Hindi', 'आप React कंपोनेंट को प्रॉप्स कैसे पास करते हैं?'],
      ['Spanish', '¿Cómo pasas props a un componente React?'],
      ['French', 'Comment passez-vous les props à un composant React ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'React',
    options: new Map([
      ['English', [
        '<Component prop="value" />',
        '<Component props={prop: "value"} />',
        '<Component {prop="value"} />',
        '<Component prop="value" props />'
      ]],
      ['Hindi', [
        '<Component prop="value" />',
        '<Component props={prop: "value"} />',
        '<Component {prop="value"} />',
        '<Component prop="value" props />'
      ]],
      ['Spanish', [
        '<Component prop="value" />',
        '<Component props={prop: "value"} />',
        '<Component {prop="value"} />',
        '<Component prop="value" props />'
      ]],
      ['French', [
        '<Component prop="value" />',
        '<Component props={prop: "value"} />',
        '<Component {prop="value"} />',
        '<Component prop="value" props />'
      ]]
    ]),
    correctAnswer: new Map([
      ['English', '<Component prop="value" />'],
      ['Hindi', '<Component prop="value" />'],
      ['Spanish', '<Component prop="value" />'],
      ['French', '<Component prop="value" />']
    ]),
    explanation: new Map([
      ['English', 'Props are passed as attributes to React components'],
      ['Hindi', 'प्रॉप्स React कंपोनेंट्स को एट्रिब्यूट्स के रूप में पास किए जाते हैं'],
      ['Spanish', 'Los props se pasan como atributos a los componentes React'],
      ['French', 'Les props sont passés comme attributs aux composants React']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },

  // Node.js Questions
  {
    questionTitle: new Map([
      ['English', 'Node.js Modules'],
      ['Hindi', 'Node.js मॉड्यूल्स'],
      ['Spanish', 'Módulos Node.js'],
      ['French', 'Modules Node.js']
    ]),
    problemStatement: new Map([
      ['English', 'Which method is used to export a module in Node.js?'],
      ['Hindi', 'Node.js में मॉड्यूल एक्सपोर्ट करने के लिए किस मेथड का उपयोग किया जाता है?'],
      ['Spanish', '¿Qué método se usa para exportar un módulo en Node.js?'],
      ['French', 'Quelle méthode est utilisée pour exporter un module dans Node.js ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'Node.js',
    options: new Map([
      ['English', ['module.exports', 'exports.module', 'export.module', 'module.export']],
      ['Hindi', ['module.exports', 'exports.module', 'export.module', 'module.export']],
      ['Spanish', ['module.exports', 'exports.module', 'export.module', 'module.export']],
      ['French', ['module.exports', 'exports.module', 'export.module', 'module.export']]
    ]),
    correctAnswer: new Map([
      ['English', 'module.exports'],
      ['Hindi', 'module.exports'],
      ['Spanish', 'module.exports'],
      ['French', 'module.exports']
    ]),
    explanation: new Map([
      ['English', 'module.exports is used to export functions, objects, or values from a module'],
      ['Hindi', 'module.exports का उपयोग मॉड्यूल से फंक्शंस, ऑब्जेक्ट्स, या वैल्यूज एक्सपोर्ट करने के लिए किया जाता है'],
      ['Spanish', 'module.exports se usa para exportar funciones, objetos o valores de un módulo'],
      ['French', 'module.exports est utilisé pour exporter des fonctions, objets ou valeurs d\'un module']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },
  {
    questionTitle: new Map([
      ['English', 'Node.js File System'],
      ['Hindi', 'Node.js फाइल सिस्टम'],
      ['Spanish', 'Sistema de Archivos Node.js'],
      ['French', 'Système de Fichiers Node.js']
    ]),
    problemStatement: new Map([
      ['English', 'Which module is used to work with the file system in Node.js?'],
      ['Hindi', 'Node.js में फाइल सिस्टम के साथ काम करने के लिए किस मॉड्यूल का उपयोग किया जाता है?'],
      ['Spanish', '¿Qué módulo se usa para trabajar con el sistema de archivos en Node.js?'],
      ['French', 'Quel module est utilisé pour travailler avec le système de fichiers dans Node.js ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'Node.js',
    options: new Map([
      ['English', ['fs', 'file', 'system', 'path']],
      ['Hindi', ['fs', 'file', 'system', 'path']],
      ['Spanish', ['fs', 'file', 'system', 'path']],
      ['French', ['fs', 'file', 'system', 'path']]
    ]),
    correctAnswer: new Map([
      ['English', 'fs'],
      ['Hindi', 'fs'],
      ['Spanish', 'fs'],
      ['French', 'fs']
    ]),
    explanation: new Map([
      ['English', 'The fs (File System) module provides APIs for interacting with the file system'],
      ['Hindi', 'fs (फाइल सिस्टम) मॉड्यूल फाइल सिस्टम के साथ इंटरैक्ट करने के लिए API प्रदान करता है'],
      ['Spanish', 'El módulo fs (Sistema de Archivos) proporciona APIs para interactuar con el sistema de archivos'],
      ['French', 'Le module fs (Système de Fichiers) fournit des API pour interagir avec le système de fichiers']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },

  // SQL Questions
  {
    questionTitle: new Map([
      ['English', 'SQL SELECT'],
      ['Hindi', 'SQL SELECT'],
      ['Spanish', 'SQL SELECT'],
      ['French', 'SQL SELECT']
    ]),
    problemStatement: new Map([
      ['English', 'What is the correct SQL statement to select all columns from a table named users?'],
      ['Hindi', 'users नामक टेबल से सभी कॉलम्स को सेलेक्ट करने के लिए सही SQL स्टेटमेंट क्या है?'],
      ['Spanish', '¿Cuál es la declaración SQL correcta para seleccionar todas las columnas de una tabla llamada usuarios?'],
      ['French', 'Quelle est la déclaration SQL correcte pour sélectionner toutes les colonnes d\'une table nommée utilisateurs ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'SQL',
    options: new Map([
      ['English', [
        'SELECT * FROM users',
        'SELECT ALL FROM users',
        'SELECT columns FROM users',
        'GET * FROM users'
      ]],
      ['Hindi', [
        'SELECT * FROM users',
        'SELECT ALL FROM users',
        'SELECT columns FROM users',
        'GET * FROM users'
      ]],
      ['Spanish', [
        'SELECT * FROM usuarios',
        'SELECT ALL FROM usuarios',
        'SELECT columns FROM usuarios',
        'GET * FROM usuarios'
      ]],
      ['French', [
        'SELECT * FROM utilisateurs',
        'SELECT ALL FROM utilisateurs',
        'SELECT columns FROM utilisateurs',
        'GET * FROM utilisateurs'
      ]]
    ]),
    correctAnswer: new Map([
      ['English', 'SELECT * FROM users'],
      ['Hindi', 'SELECT * FROM users'],
      ['Spanish', 'SELECT * FROM usuarios'],
      ['French', 'SELECT * FROM utilisateurs']
    ]),
    explanation: new Map([
      ['English', 'SELECT * is used to select all columns from a table'],
      ['Hindi', 'SELECT * का उपयोग टेबल से सभी कॉलम्स को सेलेक्ट करने के लिए किया जाता है'],
      ['Spanish', 'SELECT * se usa para seleccionar todas las columnas de una tabla'],
      ['French', 'SELECT * est utilisé pour sélectionner toutes les colonnes d\'une table']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },
  {
    questionTitle: new Map([
      ['English', 'SQL JOIN'],
      ['Hindi', 'SQL JOIN'],
      ['Spanish', 'SQL JOIN'],
      ['French', 'SQL JOIN']
    ]),
    problemStatement: new Map([
      ['English', 'Which JOIN returns all records from the left table and matched records from the right table?'],
      ['Hindi', 'कौन सा JOIN लेफ्ट टेबल से सभी रिकॉर्ड्स और राइट टेबल से मैच्ड रिकॉर्ड्स लौटाता है?'],
      ['Spanish', '¿Qué JOIN devuelve todos los registros de la tabla izquierda y los registros coincidentes de la tabla derecha?'],
      ['French', 'Quel JOIN retourne tous les enregistrements de la table gauche et les enregistrements correspondants de la table droite ?']
    ]),
    type: 'mcq',
    difficulty: 'medium',
    topic: 'SQL',
    options: new Map([
      ['English', ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN']],
      ['Hindi', ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN']],
      ['Spanish', ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN']],
      ['French', ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN']]
    ]),
    correctAnswer: new Map([
      ['English', 'LEFT JOIN'],
      ['Hindi', 'LEFT JOIN'],
      ['Spanish', 'LEFT JOIN'],
      ['French', 'LEFT JOIN']
    ]),
    explanation: new Map([
      ['English', 'LEFT JOIN returns all records from the left table and matched records from the right table'],
      ['Hindi', 'LEFT JOIN लेफ्ट टेबल से सभी रिकॉर्ड्स और राइट टेबल से मैच्ड रिकॉर्ड्स लौटाता है'],
      ['Spanish', 'LEFT JOIN devuelve todos los registros de la tabla izquierda y los registros coincidentes de la tabla derecha'],
      ['French', 'LEFT JOIN retourne tous les enregistrements de la table gauche et les enregistrements correspondants de la table droite']
    ]),
    marks: 15,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },

  // AWS Questions
  {
    questionTitle: new Map([
      ['English', 'AWS EC2'],
      ['Hindi', 'AWS EC2'],
      ['Spanish', 'AWS EC2'],
      ['French', 'AWS EC2']
    ]),
    problemStatement: new Map([
      ['English', 'What does EC2 stand for in AWS?'],
      ['Hindi', 'AWS में EC2 का पूर्ण रूप क्या है?'],
      ['Spanish', '¿Qué significa EC2 en AWS?'],
      ['French', 'Que signifie EC2 dans AWS ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'AWS',
    options: new Map([
      ['English', [
        'Elastic Compute Cloud',
        'Elastic Container Cloud',
        'Elastic Computing Cloud',
        'Elastic Cost Cloud'
      ]],
      ['Hindi', [
        'Elastic Compute Cloud',
        'Elastic Container Cloud',
        'Elastic Computing Cloud',
        'Elastic Cost Cloud'
      ]],
      ['Spanish', [
        'Elastic Compute Cloud',
        'Elastic Container Cloud',
        'Elastic Computing Cloud',
        'Elastic Cost Cloud'
      ]],
      ['French', [
        'Elastic Compute Cloud',
        'Elastic Container Cloud',
        'Elastic Computing Cloud',
        'Elastic Cost Cloud'
      ]]
    ]),
    correctAnswer: new Map([
      ['English', 'Elastic Compute Cloud'],
      ['Hindi', 'Elastic Compute Cloud'],
      ['Spanish', 'Elastic Compute Cloud'],
      ['French', 'Elastic Compute Cloud']
    ]),
    explanation: new Map([
      ['English', 'EC2 stands for Elastic Compute Cloud, a web service that provides resizable compute capacity'],
      ['Hindi', 'EC2 का मतलब Elastic Compute Cloud है, जो रिसाइज़ेबल कंप्यूट कैपेसिटी प्रदान करने वाली वेब सर्विस है'],
      ['Spanish', 'EC2 significa Elastic Compute Cloud, un servicio web que proporciona capacidad de cómputo redimensionable'],
      ['French', 'EC2 signifie Elastic Compute Cloud, un service Web qui fournit une capacité de calcul redimensionnable']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },
  {
    questionTitle: new Map([
      ['English', 'AWS S3'],
      ['Hindi', 'AWS S3'],
      ['Spanish', 'AWS S3'],
      ['French', 'AWS S3']
    ]),
    problemStatement: new Map([
      ['English', 'What is AWS S3 primarily used for?'],
      ['Hindi', 'AWS S3 का प्राथमिक रूप से उपयोग क्या के लिए किया जाता है?'],
      ['Spanish', '¿Para qué se usa principalmente AWS S3?'],
      ['French', 'À quoi sert principalement AWS S3 ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'AWS',
    options: new Map([
      ['English', [
        'Object storage',
        'Database storage',
        'Compute instances',
        'Network services'
      ]],
      ['Hindi', [
        'Object storage',
        'Database storage',
        'Compute instances',
        'Network services'
      ]],
      ['Spanish', [
        'Almacenamiento de objetos',
        'Almacenamiento de base de datos',
        'Instancias de cómputo',
        'Servicios de red'
      ]],
      ['French', [
        'Stockage d\'objets',
        'Stockage de base de données',
        'Instances de calcul',
        'Services réseau'
      ]]
    ]),
    correctAnswer: new Map([
      ['English', 'Object storage'],
      ['Hindi', 'Object storage'],
      ['Spanish', 'Almacenamiento de objetos'],
      ['French', 'Stockage d\'objets']
    ]),
    explanation: new Map([
      ['English', 'AWS S3 is primarily used for object storage, allowing you to store and retrieve any amount of data'],
      ['Hindi', 'AWS S3 का प्राथमिक रूप से उपयोग ऑब्जेक्ट स्टोरेज के लिए किया जाता है, जो आपको किसी भी मात्रा में डेटा स्टोर और पुनर्प्राप्त करने की अनुमति देता है'],
      ['Spanish', 'AWS S3 se usa principalmente para el almacenamiento de objetos, permitiéndole almacenar y recuperar cualquier cantidad de datos'],
      ['French', 'AWS S3 est principalement utilisé pour le stockage d\'objets, vous permettant de stocker et récupérer n\'importe quelle quantité de données']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },

  // Cybersecurity Questions
  {
    questionTitle: new Map([
      ['English', 'Cybersecurity Encryption'],
      ['Hindi', 'साइबर सिक्योरिटी एन्क्रिप्शन'],
      ['Spanish', 'Cifrado de Ciberseguridad'],
      ['French', 'Chiffrement de Cybersécurité']
    ]),
    problemStatement: new Map([
      ['English', 'What is the primary purpose of encryption in cybersecurity?'],
      ['Hindi', 'साइबर सिक्योरिटी में एन्क्रिप्शन का प्राथमिक उद्देश्य क्या है?'],
      ['Spanish', '¿Cuál es el propósito principal del cifrado en ciberseguridad?'],
      ['French', 'Quel est le but principal du chiffrement en cybersécurité ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'Cybersecurity',
    options: new Map([
      ['English', [
        'To protect data confidentiality',
        'To increase data speed',
        'To reduce data size',
        'To improve data quality'
      ]],
      ['Hindi', [
        'डेटा गोपनीयता की सुरक्षा करना',
        'डेटा स्पीड बढ़ाना',
        'डेटा साइज कम करना',
        'डेटा क्वालिटी बेहतर करना'
      ]],
      ['Spanish', [
        'Proteger la confidencialidad de los datos',
        'Aumentar la velocidad de los datos',
        'Reducir el tamaño de los datos',
        'Mejorar la calidad de los datos'
      ]],
      ['French', [
        'Protéger la confidentialité des données',
        'Augmenter la vitesse des données',
        'Réduire la taille des données',
        'Améliorer la qualité des données'
      ]]
    ]),
    correctAnswer: new Map([
      ['English', 'To protect data confidentiality'],
      ['Hindi', 'डेटा गोपनीयता की सुरक्षा करना'],
      ['Spanish', 'Proteger la confidencialidad de los datos'],
      ['French', 'Protéger la confidentialité des données']
    ]),
    explanation: new Map([
      ['English', 'Encryption is primarily used to protect data confidentiality by converting it into a coded format'],
      ['Hindi', 'एन्क्रिप्शन का प्राथमिक रूप से उपयोग डेटा को कोडेड फॉर्मेट में कनवर्ट करके डेटा गोपनीयता की सुरक्षा करने के लिए किया जाता है'],
      ['Spanish', 'El cifrado se usa principalmente para proteger la confidencialidad de los datos convirtiéndolos en un formato codificado'],
      ['French', 'Le chiffrement est principalement utilisé pour protéger la confidentialité des données en les convertissant en un format codé']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },
  {
    questionTitle: new Map([
      ['English', 'Cybersecurity Authentication'],
      ['Hindi', 'साइबर सिक्योरिटी प्रमाणीकरण'],
      ['Spanish', 'Autenticación de Ciberseguridad'],
      ['French', 'Authentification de Cybersécurité']
    ]),
    problemStatement: new Map([
      ['English', 'What is two-factor authentication (2FA)?'],
      ['Hindi', 'दो-कारक प्रमाणीकरण (2FA) क्या है?'],
      ['Spanish', '¿Qué es la autenticación de dos factores (2FA)?'],
      ['French', 'Qu\'est-ce que l\'authentification à deux facteurs (2FA) ?']
    ]),
    type: 'mcq',
    difficulty: 'medium',
    topic: 'Cybersecurity',
    options: new Map([
      ['English', [
        'A security process requiring two forms of identification',
        'A single password system',
        'A backup system for passwords',
        'A method to encrypt passwords twice'
      ]],
      ['Hindi', [
        'दो प्रकार की पहचान की आवश्यकता वाली एक सुरक्षा प्रक्रिया',
        'एक सिंगल पासवर्ड सिस्टम',
        'पासवर्ड्स के लिए एक बैकअप सिस्टम',
        'पासवर्ड्स को दो बार एन्क्रिप्ट करने की एक विधि'
      ]],
      ['Spanish', [
        'Un proceso de seguridad que requiere dos formas de identificación',
        'Un sistema de contraseña única',
        'Un sistema de respaldo para contraseñas',
        'Un método para cifrar contraseñas dos veces'
      ]],
      ['French', [
        'Un processus de sécurité nécessitant deux formes d\'identification',
        'Un système à mot de passe unique',
        'Un système de sauvegarde pour les mots de passe',
        'Une méthode pour chiffrer les mots de passe deux fois'
      ]]
    ]),
    correctAnswer: new Map([
      ['English', 'A security process requiring two forms of identification'],
      ['Hindi', 'दो प्रकार की पहचान की आवश्यकता वाली एक सुरक्षा प्रक्रिया'],
      ['Spanish', 'Un proceso de seguridad que requiere dos formas de identificación'],
      ['French', 'Un processus de sécurité nécessitant deux formes d\'identification']
    ]),
    explanation: new Map([
      ['English', '2FA requires users to provide two different authentication factors to verify their identity'],
      ['Hindi', '2FA उपयोगकर्ताओं को अपनी पहचान सत्यापित करने के लिए दो अलग-अलग प्रमाणीकरण कारक प्रदान करने की आवश्यकता होती है'],
      ['Spanish', '2FA requiere que los usuarios proporcionen dos factores de autenticación diferentes para verificar su identidad'],
      ['French', '2FA exige aux utilisateurs de fournir deux facteurs d\'authentification différents pour vérifier leur identité']
    ]),
    marks: 15,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },

  // Cloud Computing Questions
  {
    questionTitle: new Map([
      ['English', 'Cloud Service Models'],
      ['Hindi', 'क्लाउड सर्विस मॉडल्स'],
      ['Spanish', 'Modelos de Servicios en la Nube'],
      ['French', 'Modèles de Services Cloud']
    ]),
    problemStatement: new Map([
      ['English', 'Which cloud service model provides complete control over the infrastructure?'],
      ['Hindi', 'कौन सा क्लाउड सर्विस मॉडल इन्फ्रास्ट्रक्चर पर पूर्ण नियंत्रण प्रदान करता है?'],
      ['Spanish', '¿Qué modelo de servicio en la nube proporciona control completo sobre la infraestructura?'],
      ['French', 'Quel modèle de service cloud fournit un contrôle complet sur l\'infrastructure ?']
    ]),
    type: 'mcq',
    difficulty: 'medium',
    topic: 'Cloud',
    options: new Map([
      ['English', ['IaaS', 'PaaS', 'SaaS', 'FaaS']],
      ['Hindi', ['IaaS', 'PaaS', 'SaaS', 'FaaS']],
      ['Spanish', ['IaaS', 'PaaS', 'SaaS', 'FaaS']],
      ['French', ['IaaS', 'PaaS', 'SaaS', 'FaaS']]
    ]),
    correctAnswer: new Map([
      ['English', 'IaaS'],
      ['Hindi', 'IaaS'],
      ['Spanish', 'IaaS'],
      ['French', 'IaaS']
    ]),
    explanation: new Map([
      ['English', 'IaaS (Infrastructure as a Service) provides complete control over the infrastructure'],
      ['Hindi', 'IaaS (Infrastructure as a Service) इन्फ्रास्ट्रक्चर पर पूर्ण नियंत्रण प्रदान करता है'],
      ['Spanish', 'IaaS (Infraestructura como Servicio) proporciona control completo sobre la infraestructura'],
      ['French', 'IaaS (Infrastructure as a Service) fournit un contrôle complet sur l\'infrastructure']
    ]),
    marks: 15,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  },

  // MERN Stack Questions
  {
    questionTitle: new Map([
      ['English', 'MERN Stack Components'],
      ['Hindi', 'MERN स्टैक कंपोनेंट्स'],
      ['Spanish', 'Componentes del Stack MERN'],
      ['French', 'Composants du Stack MERN']
    ]),
    problemStatement: new Map([
      ['English', 'What does the "M" stand for in MERN stack?'],
      ['Hindi', 'MERN स्टैक में "M" का क्या मतलब है?'],
      ['Spanish', '¿Qué significa la "M" en el stack MERN?'],
      ['French', 'Que signifie le "M" dans le stack MERN ?']
    ]),
    type: 'mcq',
    difficulty: 'easy',
    topic: 'MERN',
    options: new Map([
      ['English', ['MongoDB', 'MySQL', 'MariaDB', 'MSSQL']],
      ['Hindi', ['MongoDB', 'MySQL', 'MariaDB', 'MSSQL']],
      ['Spanish', ['MongoDB', 'MySQL', 'MariaDB', 'MSSQL']],
      ['French', ['MongoDB', 'MySQL', 'MariaDB', 'MSSQL']]
    ]),
    correctAnswer: new Map([
      ['English', 'MongoDB'],
      ['Hindi', 'MongoDB'],
      ['Spanish', 'MongoDB'],
      ['French', 'MongoDB']
    ]),
    explanation: new Map([
      ['English', 'In MERN stack, M stands for MongoDB (NoSQL database), E for Express.js, R for React, and N for Node.js'],
      ['Hindi', 'MERN स्टैक में, M का मतलब MongoDB (NoSQL डेटाबेस), E का मतलब Express.js, R का मतलब React, और N का मतलब Node.js है'],
      ['Spanish', 'En el stack MERN, M significa MongoDB (base de datos NoSQL), E significa Express.js, R significa React, y N significa Node.js'],
      ['French', 'Dans le stack MERN, M signifie MongoDB (base de données NoSQL), E signifie Express.js, R signifie React, et N signifie Node.js']
    ]),
    marks: 10,
    languages: ['English', 'Hindi', 'Spanish', 'French']
  }
];

// Enhanced Paper Sets for Different Categories
const enhancedPaperSets = [
  {
    name: 'Set A - Web Development Fundamentals',
    description: 'HTML, CSS, and JavaScript basics for web development',
    category: 'Web Development',
    difficulty: 'easy',
    languages: ['English', 'Hindi', 'Spanish', 'French'],
    timeLimit: 30,
    passingMarks: 60,
    tags: ['html', 'css', 'javascript', 'web', 'frontend']
  },
  {
    name: 'Set B - Programming Languages',
    description: 'Core concepts in Python, Java, and C++',
    category: 'Programming',
    difficulty: 'mixed',
    languages: ['English', 'Hindi', 'Spanish', 'French'],
    timeLimit: 45,
    passingMarks: 65,
    tags: ['python', 'java', 'cpp', 'programming', 'languages']
  },
  {
    name: 'Set C - Modern Web Technologies',
    description: 'React, Node.js, and MERN stack development',
    category: 'Full Stack',
    difficulty: 'medium',
    languages: ['English', 'Hindi', 'Spanish', 'French'],
    timeLimit: 60,
    passingMarks: 70,
    tags: ['react', 'nodejs', 'mern', 'fullstack', 'javascript']
  },
  {
    name: 'Set D - Cloud and DevOps',
    description: 'AWS, cloud computing, and deployment strategies',
    category: 'Cloud Computing',
    difficulty: 'medium',
    languages: ['English', 'Hindi', 'Spanish', 'French'],
    timeLimit: 50,
    passingMarks: 65,
    tags: ['aws', 'cloud', 'devops', 'infrastructure']
  },
  {
    name: 'Set E - Database and Security',
    description: 'SQL databases and cybersecurity fundamentals',
    category: 'Database & Security',
    difficulty: 'mixed',
    languages: ['English', 'Hindi', 'Spanish', 'French'],
    timeLimit: 55,
    passingMarks: 68,
    tags: ['sql', 'database', 'cybersecurity', 'security']
  },
  {
    name: 'Set F - Advanced Topics',
    description: 'Complex problems and advanced concepts across all technologies',
    category: 'Advanced',
    difficulty: 'hard',
    languages: ['English', 'Hindi', 'Spanish', 'French'],
    timeLimit: 90,
    passingMarks: 75,
    tags: ['advanced', 'complex', 'expert', 'challenge']
  }
];

async function seedComprehensiveDatabase() {
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

    // Create test user with email as password
    let testUser = await User.findOne({ email: 'samhitha@gmail.com' });
    if (!testUser) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('samhitha@gmail.com', 12);
      testUser = new User({
        name: 'Samhitha',
        email: 'samhitha@gmail.com',
        password: hashedPassword,
        role: 'student'
      });
      await testUser.save();
      console.log('✅ Created test user: samhitha@gmail.com / samhitha@gmail.com');
    }

    // Create questions
    const createdQuestions = [];
    for (const questionData of comprehensiveQuestions) {
      const question = new Question({
        ...questionData,
        createdBy: adminUser._id
      });
      await question.save();
      createdQuestions.push(question);
    }
    console.log('✅ Created questions:', createdQuestions.length);

    // Create paper sets with appropriate questions
    for (const setData of enhancedPaperSets) {
      let questionsForSet = [];
      
      // Assign questions based on category
      if (setData.category === 'Web Development') {
        questionsForSet = createdQuestions.filter(q => 
          ['HTML', 'CSS', 'JavaScript'].includes(q.topic)
        );
      } else if (setData.category === 'Programming') {
        questionsForSet = createdQuestions.filter(q => 
          ['Python', 'Java', 'C++'].includes(q.topic)
        );
      } else if (setData.category === 'Full Stack') {
        questionsForSet = createdQuestions.filter(q => 
          ['React', 'Node.js', 'JavaScript', 'MERN'].includes(q.topic)
        );
      } else if (setData.category === 'Cloud Computing') {
        questionsForSet = createdQuestions.filter(q => 
          ['AWS', 'Cloud'].includes(q.topic)
        );
      } else if (setData.category === 'Database & Security') {
        questionsForSet = createdQuestions.filter(q => 
          ['SQL', 'Cybersecurity'].includes(q.topic)
        );
      } else {
        // Advanced or Mixed - include all questions
        questionsForSet = createdQuestions;
      }

      // Add more questions if needed for comprehensive sets
      if (questionsForSet.length < 5) {
        questionsForSet = questionsForSet.concat(
          createdQuestions.filter(q => !questionsForSet.includes(q))
        );
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

    console.log('✅ Comprehensive paper sets seeded successfully!');
    console.log('📚 Created 6 enhanced paper sets with multi-language support');
    console.log('🌍 Questions available in: English, Hindi, Spanish, French');
    console.log('👤 Test user: samhitha@gmail.com / samhitha@gmail.com');
    console.log('🎯 Features: Smart question randomization, retake prevention, enhanced results');
    
  } catch (error) {
    console.error('❌ Error seeding comprehensive database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedComprehensiveDatabase();
