const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('./models/User');
const Question = require('./models/Question');
const Quiz = require('./models/Quiz');

mongoose.connect(process.env.MONGO_URI).then(() => console.log('DB connected')).catch(console.error);

// ─── Helper ───────────────────────────────────────────────────────────────────
const mcq = (title, stmt, opts, ans, diff, topic, marks = 10) => ({
  questionTitle: title, problemStatement: stmt,
  type: 'mcq', difficulty: diff, topic,
  options: opts, correctAnswer: ans, marks, tags: [topic, diff],
});
const code = (title, stmt, ans, diff, topic, marks = 15) => ({
  questionTitle: title, problemStatement: stmt,
  type: 'code_output', difficulty: diff, topic,
  correctAnswer: ans, marks, tags: [topic, diff],
});

// ─── Questions Bank ───────────────────────────────────────────────────────────
const questions = [
  // ═══ JavaScript – Easy ════════════════════════════════════════════════════
  mcq('JS typeof null','What does typeof null return in JavaScript?',['object','null','undefined','string'],'object','easy','JavaScript'),
  mcq('JS var hoisting','Which keyword is hoisted but not initialized?',['let','const','var','class'],'var','easy','JavaScript'),
  mcq('JS strict equality','What does === check?',['Only value','Only type','Value and type','Neither'],'Value and type','easy','JavaScript'),
  mcq('JS array method','Which method adds to the END of an array?',['push','pop','shift','unshift'],'push','easy','JavaScript'),
  mcq('JS string length','How to get the length of a string "hello"?',['hello.size','hello.count','hello.length','hello.len'],'hello.length','easy','JavaScript'),
  mcq('JS falsy value','Which is NOT a falsy value?',['0','""','[]','null'],'[]','easy','JavaScript'),
  mcq('JS loop','Which loop always executes at least once?',['for','while','do...while','for...of'],'do...while','easy','JavaScript'),
  mcq('JS arrow function','Arrow functions use which syntax?',['function(){}','()=>{}','fn(){}','def(){}'],'()=>{}','easy','JavaScript'),
  mcq('JS undefined','What is the default value of an uninitialized variable?',['null','0','undefined','false'],'undefined','easy','JavaScript'),
  mcq('JS console','How to print to the browser console?',['print()','echo()','console.log()','alert()'],'console.log()','easy','JavaScript'),
  mcq('JS NaN check','How do you check if a value is NaN?',['x == NaN','x === NaN','isNaN(x)','typeof x == NaN'],'isNaN(x)','easy','JavaScript'),
  mcq('JS template literal','Template literals use which character?',['\'','`','"','\\'],'`','easy','JavaScript'),
  mcq('JS object key','How to access object property dynamically?',['obj.key','obj[key]','obj{key}','obj->key'],'obj[key]','easy','JavaScript'),
  mcq('JS ternary','What is x = (5>3) ? "yes" : "no"?',['yes','no','error','undefined'],'yes','easy','JavaScript'),
  mcq('JS event','Which method attaches an event listener?',['attachEvent','on()','addEventListener','listen()'],'addEventListener','easy','JavaScript'),
  mcq('JS promise','Promises have which states?',['active/done','pending/fulfilled/rejected','open/closed','new/old'],'pending/fulfilled/rejected','easy','JavaScript'),
  mcq('JS spread','What does the spread operator (...) do?',['deletes','expands iterable','loops','imports'],'expands iterable','easy','JavaScript'),
  mcq('JS typeof function','typeof function(){} returns?',['object','function','callable','method'],'function','easy','JavaScript'),
  mcq('JS array find','Which method returns first matching element?',['filter','find','findAll','search'],'find','easy','JavaScript'),
  mcq('JS JSON parse','JSON.parse() converts?',['Object to string','String to object','Array to string','String to array'],'String to object','easy','JavaScript'),

  // ═══ JavaScript – Medium ══════════════════════════════════════════════════
  mcq('JS closure','A closure is?',['A loop construct','A function with access to outer scope','A class method','An async function'],'A function with access to outer scope','medium','JavaScript'),
  mcq('JS event loop','JS event loop handles?',['Synchronous code','Async callbacks','Memory allocation','Compilation'],'Async callbacks','medium','JavaScript'),
  mcq('JS prototype','Every JS object has a __proto__ pointing to?',['null','its constructor prototype','window','undefined'],'its constructor prototype','medium','JavaScript'),
  mcq('JS async await','async/await is syntactic sugar over?',['Callbacks','Promises','Generators','Observables'],'Promises','medium','JavaScript'),
  mcq('JS map vs forEach','map() vs forEach() – key difference?',['map mutates','forEach returns array','map returns new array','No difference'],'map returns new array','medium','JavaScript'),
  mcq('JS debounce','Debouncing delays function until?',['First call','N seconds after last call','Every N seconds','Page loads'],'N seconds after last call','medium','JavaScript'),
  mcq('JS modules','ES6 module export keyword?',['module.exports','exports','export','expose'],'export','medium','JavaScript'),
  mcq('JS WeakMap','WeakMap keys must be?',['Strings','Numbers','Objects','Symbols'],'Objects','medium','JavaScript'),
  mcq('JS symbol','Symbol() creates?',['String','Unique primitive','Object','Number'],'Unique primitive','medium','JavaScript'),
  mcq('JS generator','Generator functions use which keyword?',['async','*','#','gen'],'*','medium','JavaScript'),
  mcq('JS call vs apply','apply() passes arguments as?',['Individual args','Array','Object','String'],'Array','medium','JavaScript'),
  mcq('JS optional chaining','obj?.prop returns what if obj is null?',['Error','null','undefined','0'],'undefined','medium','JavaScript'),
  mcq('JS nullish coalescing','a ?? b returns b when?',['a is falsy','a is null or undefined','a is false','a is 0'],'a is null or undefined','medium','JavaScript'),
  mcq('JS IIFE','IIFE stands for?',['Immediately Invoked Function Expression','Internal In-Function Execution','Infinite Function Iterator','None'],'Immediately Invoked Function Expression','medium','JavaScript'),
  mcq('JS Proxy','Proxy object is used for?',['Caching','Intercepting operations on objects','Error handling','Routing'],'Intercepting operations on objects','medium','JavaScript'),

  // ═══ JavaScript – Hard ════════════════════════════════════════════════════
  mcq('JS memory leak','Common JS memory leak cause?',['const usage','Forgotten timers/event listeners','Arrow functions','Strict mode'],'Forgotten timers/event listeners','hard','JavaScript'),
  mcq('JS tail call','Tail call optimization benefits?',['Faster loops','Prevents stack overflow for recursion','Reduces memory','Compiles faster'],'Prevents stack overflow for recursion','hard','JavaScript'),
  mcq('JS SharedArrayBuffer','SharedArrayBuffer enables?',['DOM sharing','Shared memory between workers','GPU access','Network sharing'],'Shared memory between workers','hard','JavaScript'),
  mcq('JS Reflect','Reflect API mirrors which object?',['Math','Proxy','Object','Array'],'Proxy','hard','JavaScript'),
  mcq('JS Tagged template','Tagged templates allow?',['Dynamic imports','Custom string processing','Type safety','Variable declaration'],'Custom string processing','hard','JavaScript'),

  // ═══ Python – Easy ════════════════════════════════════════════════════════
  mcq('PY list append','How to add item to Python list?',['list.add()','list.push()','list.append()','list.insert(0)'],'list.append()','easy','Python'),
  mcq('PY indent','Python uses ___ for code blocks',['{}','()','Indentation','[]'],'Indentation','easy','Python'),
  mcq('PY string type','type("hello") returns?',['str','string','char','text'],'str','easy','Python'),
  mcq('PY print','How to print in Python?',['echo()','console.log()','print()','printf()'],'print()','easy','Python'),
  mcq('PY range','range(5) generates?',['1-5','0-4','0-5','1-4'],'0-4','easy','Python'),
  mcq('PY len','len([1,2,3]) returns?',['2','3','4','error'],'3','easy','Python'),
  mcq('PY dict access','How to access dict value by key?',['d{key}','d[key]','d.get(key)','Both d[key] and d.get(key)'],'Both d[key] and d.get(key)','easy','Python'),
  mcq('PY boolean','Which is a valid Python boolean?',['TRUE','True','true','1==1 is bool'],'True','easy','Python'),
  mcq('PY comment','Python single-line comment?',['//','#','--','/* */'],'#','easy','Python'),
  mcq('PY None','Python equivalent of null?',['null','nil','None','void'],'None','easy','Python'),
  mcq('PY list slice','my_list[1:3] on [0,1,2,3,4]?',['[1,2,3]','[1,2]','[0,1]','[2,3]'],'[1,2]','easy','Python'),
  mcq('PY in operator','How to check if item in list?',['list.contains()','item in list','list.has()','in(list, item)'],'item in list','easy','Python'),
  mcq('PY for loop','for i in range(3): iterates?',['1,2,3','0,1,2','0,1,2,3','1,2'],'0,1,2','easy','Python'),
  mcq('PY str upper','How to uppercase a string?',['str.upper()','str.toUpper()','upper(str)','str.UP()'],'str.upper()','easy','Python'),
  mcq('PY tuple','Tuples are?',['Mutable ordered','Immutable ordered','Mutable unordered','Immutable unordered'],'Immutable ordered','easy','Python'),
  mcq('PY split','"a,b,c".split(",") returns?',['("a","b","c")','["a","b","c"]','{a,b,c}','a b c'],'["a","b","c"]','easy','Python'),
  mcq('PY set','Sets in Python are?',['Ordered with duplicates','Unordered no duplicates','Ordered no duplicates','Unordered with duplicates'],'Unordered no duplicates','easy','Python'),
  mcq('PY int cast','int("42") returns?',['42','Error','"42"','42.0'],'42','easy','Python'),
  mcq('PY multi assign','a, b = 1, 2 is called?',['Multi-assign','Tuple unpacking','Spread','Destructuring'],'Tuple unpacking','easy','Python'),
  mcq('PY not','not True evaluates to?',['True','False','None','Error'],'False','easy','Python'),

  // ═══ Python – Medium ══════════════════════════════════════════════════════
  mcq('PY list comprehension','[x*2 for x in range(3)] produces?',['[0,2,4]','[2,4,6]','[1,2,3]','[0,1,2]'],'[0,2,4]','medium','Python'),
  mcq('PY lambda','lambda x: x+1 is a?',['Class','Anonymous function','Generator','Decorator'],'Anonymous function','medium','Python'),
  mcq('PY decorator','Decorators in Python use?',['@','#','$','!'],'@','medium','Python'),
  mcq('PY generator','Generator functions use?',['return','yield','emit','send'],'yield','medium','Python'),
  mcq('PY *args','*args in function allows?',['Keyword args','Variable positional args','Required args','Default args'],'Variable positional args','medium','Python'),
  mcq('PY map','map(str, [1,2,3]) returns?',['["1","2","3"]','[1,2,3]','map object','Error'],'map object','medium','Python'),
  mcq('PY filter','filter(lambda x: x>2, [1,2,3,4])?',['[3,4]','[1,2]','[2,3]','filter object'],'filter object','medium','Python'),
  mcq('PY class','__init__ in a class is?',['Destructor','Constructor','Static method','Class method'],'Constructor','medium','Python'),
  mcq('PY inheritance','class B(A) means?',['B imports A','B inherits from A','B extends A interface','A inherits B'],'B inherits from A','medium','Python'),
  mcq('PY zip','zip([1,2],[a,b]) produces?',['[[1,a],[2,b]]','[(1,"a"),(2,"b")]','{1:a,2:b}','Error'],'[(1,"a"),(2,"b")]','medium','Python'),
  mcq('PY enumerate','enumerate(["a","b"]) gives?',['indexes only','(index,value) pairs','values only','dict'],'(index,value) pairs','medium','Python'),
  mcq('PY try except','Which block always executes?',['try','except','finally','else'],'finally','medium','Python'),
  mcq('PY global','Keyword to use global variable inside function?',['global','extern','public','static'],'global','medium','Python'),
  mcq('PY dict comprehension','{k:v for k,v in d.items()} creates?',['List','New dict','Set','Tuple'],'New dict','medium','Python'),
  mcq('PY isinstance','isinstance(3, int) returns?',['True','False','Error','None'],'True','medium','Python'),

  // ═══ Python – Hard ════════════════════════════════════════════════════════
  mcq('PY GIL','Python GIL prevents?',['Multiple processes','True parallel threads','Garbage collection','Module loading'],'True parallel threads','hard','Python'),
  mcq('PY metaclass','Metaclass is?',['Base class','Class of a class','Module','Interface'],'Class of a class','hard','Python'),
  mcq('PY slots','__slots__ reduces?',['Execution time','Memory usage per instance','Import time','I/O time'],'Memory usage per instance','hard','Python'),
  mcq('PY descriptor','Descriptor protocol implements?',['__get__/__set__/__delete__','__init__/__new__','__call__/__repr__','__enter__/__exit__'],'__get__/__set__/__delete__','hard','Python'),
  mcq('PY asyncio','asyncio runs on?',['Multiple threads','Single thread event loop','Multiple processes','GPU'],'Single thread event loop','hard','Python'),

  // ═══ Data Structures – Easy ═══════════════════════════════════════════════
  mcq('DS stack','Stack follows?',['FIFO','LIFO','Random','FILO same as LIFO'],'LIFO','easy','Data Structures'),
  mcq('DS queue','Queue follows?',['LIFO','FIFO','Random','Priority'],'FIFO','easy','Data Structures'),
  mcq('DS array index','Array indexing starts from?',['1','0','-1','Depends'],'0','easy','Data Structures'),
  mcq('DS linked list node','Linked list node contains?',['Data only','Pointer only','Data and pointer','Index'],'Data and pointer','easy','Data Structures'),
  mcq('DS binary search','Binary search requires array to be?',['Sorted','Unsorted','Linked','Hashed'],'Sorted','easy','Data Structures'),
  mcq('DS tree root','Tree node with no parent is?',['Leaf','Root','Child','Branch'],'Root','easy','Data Structures'),
  mcq('DS hash table','Hash table provides average O(?) lookup',['O(n)','O(log n)','O(1)','O(n²)'],'O(1)','easy','Data Structures'),
  mcq('DS array insert end','Inserting at end of dynamic array is?',['O(n)','O(1) amortized','O(log n)','O(n²)'],'O(1) amortized','easy','Data Structures'),
  mcq('DS tree leaf','A node with no children is called?',['Root','Internal','Leaf','Branch'],'Leaf','easy','Data Structures'),
  mcq('DS push pop','Stack peek operation?',['Removes top','Adds to top','Views top without removing','Clears stack'],'Views top without removing','easy','Data Structures'),
  mcq('DS set','Set data structure provides?',['Ordered unique elements','Unordered unique elements','Ordered duplicates','Key-value pairs'],'Unordered unique elements','easy','Data Structures'),
  mcq('DS graph vertex','Vertices in a graph are connected by?',['Nodes','Edges','Weights','Levels'],'Edges','easy','Data Structures'),
  mcq('DS priority queue','Priority queue dequeues based on?',['Insertion order','Priority value','Random','LIFO'],'Priority value','easy','Data Structures'),
  mcq('DS 2D array','Matrix is a?',['1D array','2D array','3D array','Linked list'],'2D array','easy','Data Structures'),
  mcq('DS deque','Deque allows insertion/deletion?',['Only front','Only back','Both ends','Middle only'],'Both ends','easy','Data Structures'),

  // ═══ Data Structures – Medium ════════════════════════════════════════════
  mcq('DS BST search','BST search average complexity?',['O(n)','O(log n)','O(1)','O(n log n)'],'O(log n)','medium','Data Structures'),
  mcq('DS heap','Min-heap root is?',['Largest element','Smallest element','Middle element','Last inserted'],'Smallest element','medium','Data Structures'),
  mcq('DS graph BFS','BFS uses which structure?',['Stack','Queue','Heap','Array'],'Queue','medium','Data Structures'),
  mcq('DS graph DFS','DFS uses which structure?',['Queue','Stack','Heap','Tree'],'Stack','medium','Data Structures'),
  mcq('DS balanced tree','AVL tree ensures height difference of?',['0','At most 1','At most 2','Any'],'At most 1','medium','Data Structures'),
  mcq('DS hash collision','Chaining resolves hash collision using?',['New hash','Linked list','Tree','Skip'],'Linked list','medium','Data Structures'),
  mcq('DS trie','Trie is used for?',['Sorting','String prefix search','Graph traversal','Number hashing'],'String prefix search','medium','Data Structures'),
  mcq('DS graph cycle','Detecting cycle in directed graph uses?',['BFS','DFS with coloring','Dijkstra','Prim','DFS with coloring'],'DFS with coloring','medium','Data Structures'),
  mcq('DS inorder','Inorder traversal of BST gives?',['Random order','Sorted order','Reverse sorted','Level order'],'Sorted order','medium','Data Structures'),
  mcq('DS space linked list','Linked list vs array: key advantage?',['Faster access','Dynamic size','Less memory','Cache friendly'],'Dynamic size','medium','Data Structures'),

  // ═══ Data Structures – Hard ═══════════════════════════════════════════════
  mcq('DS segment tree','Segment tree supports range queries in?',['O(1)','O(log n)','O(n)','O(n log n)'],'O(log n)','hard','Data Structures'),
  mcq('DS red black tree','Red-black tree guarantees height?',['O(n)','O(log n)','O(1)','O(n²)'],'O(log n)','hard','Data Structures'),
  mcq('DS skip list','Skip list average search complexity?',['O(n)','O(log n)','O(1)','O(n²)'],'O(log n)','hard','Data Structures'),
  mcq('DS fibonacci heap','Fibonacci heap decrease-key is?',['O(1) amortized','O(log n)','O(n)','O(n log n)'],'O(1) amortized','hard','Data Structures'),
  mcq('DS suffix array','Suffix array is used for?',['Graph problems','Substring search','Sorting integers','Hashing'],'Substring search','hard','Data Structures'),

  // ═══ Algorithms – Easy ════════════════════════════════════════════════════
  mcq('ALGO bubble sort','Bubble sort worst case?',['O(n)','O(n log n)','O(n²)','O(log n)'],'O(n²)','easy','Algorithms'),
  mcq('ALGO linear search','Linear search complexity?',['O(1)','O(n)','O(log n)','O(n²)'],'O(n)','easy','Algorithms'),
  mcq('ALGO selection sort','Selection sort selects?',['Largest','Smallest each pass','Random','Median'],'Smallest each pass','easy','Algorithms'),
  mcq('ALGO binary search complexity','Binary search complexity?',['O(n)','O(log n)','O(1)','O(n log n)'],'O(log n)','easy','Algorithms'),
  mcq('ALGO recursion','Recursion requires?',['Loop','Base case','Global variable','Array'],'Base case','easy','Algorithms'),
  mcq('ALGO factorial','5! equals?',['20','60','120','24'],'120','easy','Algorithms'),
  mcq('ALGO insertion sort','Insertion sort best case?',['O(n²)','O(n log n)','O(n)','O(1)'],'O(n)','easy','Algorithms'),
  mcq('ALGO greedy','Greedy algorithm picks?',['Best future choice','Locally optimal choice','Random choice','Global optimum always'],'Locally optimal choice','easy','Algorithms'),
  mcq('ALGO merge sort stable','Merge sort is?',['Unstable','Stable','In-place','O(1) space'],'Stable','easy','Algorithms'),
  mcq('ALGO divide conquer','Merge sort uses?',['Greedy','Dynamic programming','Divide and conquer','Backtracking'],'Divide and conquer','easy','Algorithms'),

  // ═══ Algorithms – Medium ══════════════════════════════════════════════════
  mcq('ALGO quick sort average','Quick sort average case?',['O(n²)','O(n log n)','O(n)','O(log n)'],'O(n log n)','medium','Algorithms'),
  mcq('ALGO dijkstra','Dijkstra finds?',['Minimum spanning tree','Shortest path','Maximum flow','Topological order'],'Shortest path','medium','Algorithms'),
  mcq('ALGO DP memo','Memoization stores?',['Function defs','Previously computed results','Sorted data','Graph edges'],'Previously computed results','medium','Algorithms'),
  mcq('ALGO knapsack','0/1 Knapsack uses?',['Greedy','BFS','Dynamic Programming','Divide and Conquer'],'Dynamic Programming','medium','Algorithms'),
  mcq('ALGO topological sort','Topological sort applies to?',['Any graph','Undirected graph','DAG','Trees only'],'DAG','medium','Algorithms'),
  mcq('ALGO kmp','KMP algorithm is for?',['Sorting','Pattern matching','Graph search','Hashing'],'Pattern matching','medium','Algorithms'),
  mcq('ALGO bellman ford','Bellman-Ford handles?',['Only positive weights','Negative weights','Only trees','Unweighted graphs'],'Negative weights','medium','Algorithms'),
  mcq('ALGO two pointers','Two pointer technique commonly solves?',['Tree problems','Sorted array problems','Graph problems','String matching'],'Sorted array problems','medium','Algorithms'),
  mcq('ALGO sliding window','Sliding window is used for?',['Fixed/variable size subarray problems','Sorting','Graph traversal','Recursion'],'Fixed/variable size subarray problems','medium','Algorithms'),
  mcq('ALGO backtracking','N-Queens problem uses?',['DP','Greedy','Backtracking','BFS'],'Backtracking','medium','Algorithms'),

  // ═══ Algorithms – Hard ════════════════════════════════════════════════════
  mcq('ALGO NP hard','NP-Hard means?',['Solvable in polynomial time','At least as hard as NP problems','Unsolvable','Linear complexity'],'At least as hard as NP problems','hard','Algorithms'),
  mcq('ALGO floyd warshall','Floyd-Warshall finds?',['Single source shortest path','All-pairs shortest path','MST','Topological order'],'All-pairs shortest path','hard','Algorithms'),
  mcq('ALGO suffix automaton','Suffix automaton size is?',['O(n)','O(n²)','O(n log n)','O(2n)'],'O(2n)','hard','Algorithms'),
  mcq('ALGO FFT complexity','FFT complexity is?',['O(n²)','O(n log n)','O(n)','O(log n)'],'O(n log n)','hard','Algorithms'),
  mcq('ALGO convex hull','Convex hull using Graham scan?',['O(n)','O(n log n)','O(n²)','O(log n)'],'O(n log n)','hard','Algorithms'),

  // ═══ React – Easy ══════════════════════════════════════════════════════════
  mcq('REACT component','React component returns?',['CSS','JSX','HTML string','Plain JS'],'JSX','easy','React'),
  mcq('REACT state','useState returns?',['Value only','Setter only','[value, setter]','{value, setter}'],'[value, setter]','easy','React'),
  mcq('REACT key','Keys in lists help React?',['Style elements','Identify changed items','Animate','Route'],'Identify changed items','easy','React'),
  mcq('REACT props','Props are?',['Mutable state','Immutable component inputs','Event handlers','CSS classes'],'Immutable component inputs','easy','React'),
  mcq('REACT virtual DOM','Virtual DOM is?',['Browser DOM','In-memory DOM representation','CSS tree','JS engine'],'In-memory DOM representation','easy','React'),
  mcq('REACT hook rule','Hooks must be called?',['Inside conditions','Inside loops','At top level of component','Inside classes'],'At top level of component','easy','React'),
  mcq('REACT useEffect','useEffect runs?',['Before render','After render','During render','On compile'],'After render','easy','React'),
  mcq('REACT fragment','React.Fragment is used to?',['Add styles','Group without extra DOM node','Create context','Handle errors'],'Group without extra DOM node','easy','React'),
  mcq('REACT event','React events are?',['Native DOM events','Synthetic events','Custom events','WebSocket events'],'Synthetic events','easy','React'),
  mcq('REACT conditional','Conditional rendering uses?',['if statements in JSX','&&, ternary in JSX','switch only','CSS display'],'&&, ternary in JSX','easy','React'),

  // ═══ React – Medium ═══════════════════════════════════════════════════════
  mcq('REACT context','useContext avoids?',['State mutation','Prop drilling','Re-renders','Side effects'],'Prop drilling','medium','React'),
  mcq('REACT memo','React.memo prevents re-render when?',['State changes','Props are same','Context changes','Always'],'Props are same','medium','React'),
  mcq('REACT reducer','useReducer is preferred over useState when?',['Simple state','Complex state logic','Async operations','Styling'],'Complex state logic','medium','React'),
  mcq('REACT ref','useRef persists value without?',['Rendering','Re-rendering','Mounting','Effect'],'Re-rendering','medium','React'),
  mcq('REACT lazy','React.lazy enables?',['Server rendering','Code splitting','State management','Routing'],'Code splitting','medium','React'),
  mcq('REACT portal','ReactDOM.createPortal renders child?',['In parent DOM','Outside parent DOM hierarchy','In shadow DOM','In iframe'],'Outside parent DOM hierarchy','medium','React'),
  mcq('REACT error boundary','Error boundaries catch errors in?',['Event handlers','Async code','Child component render','All of above'],'Child component render','medium','React'),
  mcq('REACT custom hook','Custom hooks must start with?',['use','hook','custom','handle'],'use','medium','React'),
  mcq('REACT reconciliation','React reconciliation is?',['Styling process','Diffing algorithm','Build process','Testing tool'],'Diffing algorithm','medium','React'),
  mcq('REACT suspense','Suspense is used with?',['useState','lazy loading','useEffect','useRef'],'lazy loading','medium','React'),

  // ═══ React – Hard ══════════════════════════════════════════════════════════
  mcq('REACT fiber','React Fiber enables?',['CSS animations','Incremental rendering','Network requests','Server-side rendering'],'Incremental rendering','hard','React'),
  mcq('REACT concurrent','Concurrent mode allows?',['Parallel JS threads','Interruptible rendering','Multi-tab sync','GPU rendering'],'Interruptible rendering','hard','React'),
  mcq('REACT server components','React Server Components run on?',['Browser','Server with zero client JS','CDN','Web worker'],'Server with zero client JS','hard','React'),
  mcq('REACT batching','Automatic batching in React 18?',['Batches only setState','Batches all state updates including async','Disabled by default','Only in StrictMode'],'Batches all state updates including async','hard','React'),
  mcq('REACT scheduler','React scheduler uses?',['setTimeout','requestIdleCallback/MessageChannel','setInterval','Promise.then'],'requestIdleCallback/MessageChannel','hard','React'),

  // ═══ Node.js – Easy ════════════════════════════════════════════════════════
  mcq('NODE runtime','Node.js is built on?',['SpiderMonkey','V8 engine','JavaScriptCore','Chakra'],'V8 engine','easy','Node.js'),
  mcq('NODE require','require() is used to?',['Define function','Import module','Export module','Install package'],'Import module','easy','Node.js'),
  mcq('NODE async','Node.js handles I/O?',['Synchronously','Asynchronously non-blocking','With threads','With processes'],'Asynchronously non-blocking','easy','Node.js'),
  mcq('NODE http','To create HTTP server use?',['express only','http module','net module','https only'],'http module','easy','Node.js'),
  mcq('NODE npm','npm stands for?',['Node Package Manager','Node Project Manager','New Package Module','Node Protocol Manager'],'Node Package Manager','easy','Node.js'),
  mcq('NODE event emitter','EventEmitter is in which module?',['events','http','fs','os'],'events','easy','Node.js'),
  mcq('NODE file read','To read a file asynchronously?',['fs.readSync','fs.readFile','file.read','io.read'],'fs.readFile','easy','Node.js'),
  mcq('NODE process','process.argv contains?',['Environment vars','Command line arguments','File paths','HTTP headers'],'Command line arguments','easy','Node.js'),
  mcq('NODE global','Global object in Node.js?',['window','document','global','self'],'global','easy','Node.js'),
  mcq('NODE path','path.join() is in which module?',['fs','path','os','url'],'path','easy','Node.js'),

  // ═══ Node.js – Medium ══════════════════════════════════════════════════════
  mcq('NODE stream','Streams handle data?',['All at once','In chunks','Synchronously','From database only'],'In chunks','medium','Node.js'),
  mcq('NODE cluster','Cluster module creates?',['HTTP servers','Child processes sharing port','Threads','Databases'],'Child processes sharing port','medium','Node.js'),
  mcq('NODE middleware','Express middleware function signature?',['(req,res)','(req,res,next)','(err,res)','(req,next)'],'(req,res,next)','medium','Node.js'),
  mcq('NODE buffer','Buffer in Node.js handles?',['String data','Binary data','JSON data','File paths'],'Binary data','medium','Node.js'),
  mcq('NODE env','process.env accesses?',['Global variables','Environment variables','File system','Network'],'Environment variables','medium','Node.js'),
  mcq('NODE promise all','Promise.all resolves when?',['First resolves','All resolve','Any rejects','None rejects'],'All resolve','medium','Node.js'),
  mcq('NODE express router','express.Router() creates?',['Mini Express app','Database connection','WebSocket','Template engine'],'Mini Express app','medium','Node.js'),
  mcq('NODE cors','CORS stands for?',['Cross-Origin Resource Sharing','Cross-Object Reference System','Core Object Runtime Service','Custom Origin Request Service'],'Cross-Origin Resource Sharing','medium','Node.js'),
  mcq('NODE helmet','Helmet.js sets?',['CORS headers','Security HTTP headers','Cookie headers','Auth headers'],'Security HTTP headers','medium','Node.js'),
  mcq('NODE mongoose connect','Mongoose connects to?',['PostgreSQL','MySQL','MongoDB','Redis'],'MongoDB','medium','Node.js'),

  // ═══ Node.js – Hard ════════════════════════════════════════════════════════
  mcq('NODE libuv','libuv provides Node.js with?',['V8 engine','Event loop and async I/O','Package management','HTTP parsing'],'Event loop and async I/O','hard','Node.js'),
  mcq('NODE worker threads','Worker threads share?',['Nothing','ArrayBuffer/SharedArrayBuffer','All memory','Event loop'],'ArrayBuffer/SharedArrayBuffer','hard','Node.js'),
  mcq('NODE native addon','Native addons use?',['JavaScript','N-API/NAN','Python','C# interop'],'N-API/NAN','hard','Node.js'),
  mcq('NODE backpressure','Stream backpressure occurs when?',['Read faster than write','Write faster than read can consume','Memory full','Network slow'],'Write faster than read can consume','hard','Node.js'),
  mcq('NODE v8 heap','V8 heap memory limit default in old Node?',['512MB','1.5GB','4GB','256MB'],'1.5GB','hard','Node.js'),

  // ═══ MongoDB – Easy ════════════════════════════════════════════════════════
  mcq('MONGO type','MongoDB is a?',['Relational DB','Document DB','Graph DB','Column DB'],'Document DB','easy','MongoDB'),
  mcq('MONGO format','MongoDB stores data as?',['Tables','JSON-like BSON documents','XML','CSV'],'JSON-like BSON documents','easy','MongoDB'),
  mcq('MONGO find','To query all docs in collection?',['db.col.query()','db.col.find()','db.col.select()','db.col.get()'],'db.col.find()','easy','MongoDB'),
  mcq('MONGO insert','To insert one document?',['db.col.add()','db.col.insertOne()','db.col.push()','db.col.create()'],'db.col.insertOne()','easy','MongoDB'),
  mcq('MONGO id','Default MongoDB document ID field?',['id','_id','docId','mongoId'],'_id','easy','MongoDB'),
  mcq('MONGO delete','To delete one document?',['db.col.remove()','db.col.deleteOne()','db.col.drop()','db.col.delete()'],'db.col.deleteOne()','easy','MongoDB'),
  mcq('MONGO update','To update one document?',['db.col.set()','db.col.updateOne()','db.col.modify()','db.col.change()'],'db.col.updateOne()','easy','MongoDB'),
  mcq('MONGO count','To count documents?',['db.col.count()','db.col.countDocuments()','db.col.length','db.col.size()'],'db.col.countDocuments()','easy','MongoDB'),
  mcq('MONGO index','Indexes in MongoDB improve?',['Insert speed','Query speed','Storage','Security'],'Query speed','easy','MongoDB'),
  mcq('MONGO collection','MongoDB collection is similar to SQL?',['Row','Column','Table','Database'],'Table','easy','MongoDB'),

  // ═══ MongoDB – Medium ══════════════════════════════════════════════════════
  mcq('MONGO aggregate','MongoDB aggregation uses?',['SQL syntax','Pipeline stages','JOIN syntax','XML queries'],'Pipeline stages','medium','MongoDB'),
  mcq('MONGO populate','Mongoose populate is similar to SQL?',['Inner query','JOIN','UNION','GROUP BY'],'JOIN','medium','MongoDB'),
  mcq('MONGO schema','Mongoose Schema defines?',['Query language','Document structure','Connection','Index only'],'Document structure','medium','MongoDB'),
  mcq('MONGO transaction','MongoDB supports ACID transactions since version?',['2.0','3.0','4.0','5.0'],'4.0','medium','MongoDB'),
  mcq('MONGO atlas','MongoDB Atlas is?',['Local MongoDB','Cloud-managed MongoDB','MongoDB GUI','MongoDB ORM'],'Cloud-managed MongoDB','medium','MongoDB'),
  mcq('MONGO match','$match in aggregation is like SQL?',['GROUP BY','ORDER BY','WHERE','HAVING'],'WHERE','medium','MongoDB'),
  mcq('MONGO group','$group in aggregation is like SQL?',['WHERE','ORDER BY','GROUP BY','LIMIT'],'GROUP BY','medium','MongoDB'),
  mcq('MONGO lookup','$lookup performs?',['Left outer join','Inner join','Cross join','Self join'],'Left outer join','medium','MongoDB'),
  mcq('MONGO regex','MongoDB regex query uses?',['LIKE','$regex','MATCH','SIMILAR TO'],'$regex','medium','MongoDB'),
  mcq('MONGO sparse index','Sparse index in MongoDB?',['Indexes all docs','Indexes only docs with field','Indexes embedded docs','Full-text index'],'Indexes only docs with field','medium','MongoDB'),

  // ═══ MongoDB – Hard ════════════════════════════════════════════════════════
  mcq('MONGO sharding','Sharding in MongoDB distributes?',['Queries','Data across multiple servers','Indexes','Connections'],'Data across multiple servers','hard','MongoDB'),
  mcq('MONGO replica set','Replica set provides?',['Sharding','High availability and redundancy','Caching','Load balancing'],'High availability and redundancy','hard','MongoDB'),
  mcq('MONGO oplog','Oplog in MongoDB is used for?',['Logging queries','Replication','Authentication','Journaling'],'Replication','hard','MongoDB'),
  mcq('MONGO wiredtiger','WiredTiger is MongoDB default?',['Query engine','Storage engine','Replication engine','Sharding engine'],'Storage engine','hard','MongoDB'),
  mcq('MONGO change stream','Change streams use?',['Polling','Oplog tailing','WebSockets','HTTP SSE'],'Oplog tailing','hard','MongoDB'),

  // ═══ CSS – Easy ═══════════════════════════════════════════════════════════
  mcq('CSS box model','CSS box model layers (outside in)?',['Content/Padding/Border/Margin','Margin/Border/Padding/Content','Border/Margin/Content/Padding','Padding/Content/Border/Margin'],'Margin/Border/Padding/Content','easy','CSS'),
  mcq('CSS flexbox center','To center flex items horizontally?',['align-items: center','justify-content: center','text-align: center','margin: auto'],'justify-content: center','easy','CSS'),
  mcq('CSS position','position: fixed is relative to?',['Parent','Document','Viewport','Body'],'Viewport','easy','CSS'),
  mcq('CSS selector class','Class selector uses?',['#','dot (.)','colon (:)','at @'],'dot (.)','easy','CSS'),
  mcq('CSS z-index','z-index controls?',['Margin','Layer order','Size','Transparency'],'Layer order','easy','CSS'),
  mcq('CSS display none','display:none vs visibility:hidden?',['Same','none removes from flow, hidden keeps space','hidden removes from flow','Both keep space'],'none removes from flow, hidden keeps space','easy','CSS'),
  mcq('CSS media query','Media queries enable?',['Animations','Responsive design','Variables','Imports'],'Responsive design','easy','CSS'),
  mcq('CSS grid','CSS Grid is?',['1D layout','2D layout','Animation system','Color system'],'2D layout','easy','CSS'),
  mcq('CSS inherit','CSS inherit value?',['Resets to default','Takes parent value','Removes property','Sets to none'],'Takes parent value','easy','CSS'),
  mcq('CSS specificity','Most specific CSS selector?',['Element','Class',':hover','ID #id'],'ID #id','easy','CSS'),

  // ═══ CSS – Medium ══════════════════════════════════════════════════════════
  mcq('CSS custom props','CSS variables use?',['$var','--var','@var','#var'],'--var','medium','CSS'),
  mcq('CSS transition','CSS transition shorthand order?',['property duration timing delay','duration property delay timing','property timing duration delay','timing property duration delay'],'property duration timing delay','medium','CSS'),
  mcq('CSS grid auto','grid-auto-flow: dense?',['Fills rows first','Back-fills gaps','Fills columns first','Creates new rows'],'Back-fills gaps','medium','CSS'),
  mcq('CSS pseudo element','::before requires?',['display:flex','content property','position:absolute','z-index'],'content property','medium','CSS'),
  mcq('CSS calc','calc(100% - 20px) calculates?',['At design time','At render time','At compile time','Never'],'At render time','medium','CSS'),
  mcq('CSS blend mode','mix-blend-mode controls?',['Font blending','Element blending with background','Image resizing','Color parsing'],'Element blending with background','medium','CSS'),
  mcq('CSS clip path','clip-path property?',['Clips overflow','Creates clipping region','Clips z-index','Clips text'],'Creates clipping region','medium','CSS'),
  mcq('CSS contain','CSS contain improves?',['Font loading','Rendering performance','Network speed','Animation'],'Rendering performance','medium','CSS'),
  mcq('CSS logical props','margin-inline-start is?',['Always left margin','Writing-mode aware margin','Top margin','Absolute position'],'Writing-mode aware margin','medium','CSS'),
  mcq('CSS aspect ratio','aspect-ratio: 16/9 sets?',['Font ratio','Width to height ratio','Grid ratio','Flex ratio'],'Width to height ratio','medium','CSS'),

  // ═══ SQL – Easy ═══════════════════════════════════════════════════════════
  mcq('SQL select','SELECT * FROM users returns?',['Selected columns','All columns all rows','First row','Count'],'All columns all rows','easy','SQL'),
  mcq('SQL where','WHERE clause filters?',['Columns','Rows','Tables','Databases'],'Rows','easy','SQL'),
  mcq('SQL pk','Primary key must be?',['Unique and not null','Unique only','Not null only','Foreign key'],'Unique and not null','easy','SQL'),
  mcq('SQL join','INNER JOIN returns?',['All from left','All from right','Matching rows only','All rows'],'Matching rows only','easy','SQL'),
  mcq('SQL order','ORDER BY sorts?',['Tables','Columns','Rows','Databases'],'Rows','easy','SQL'),
  mcq('SQL count','COUNT(*) counts?',['Columns','Non-null values','All rows including null','Tables'],'All rows including null','easy','SQL'),
  mcq('SQL group by','GROUP BY groups rows for?',['Sorting','Aggregate functions','Filtering','Joins'],'Aggregate functions','easy','SQL'),
  mcq('SQL insert','INSERT INTO adds?',['Column','New row','Index','Constraint'],'New row','easy','SQL'),
  mcq('SQL delete','DELETE without WHERE?',['Deletes first row','Deletes all rows','Error','Deletes last row'],'Deletes all rows','easy','SQL'),
  mcq('SQL null check','To check for NULL use?',['= NULL','== NULL','IS NULL','NULL =='],'IS NULL','easy','SQL'),

  // ═══ SQL – Medium ══════════════════════════════════════════════════════════
  mcq('SQL subquery','Correlated subquery runs?',['Once','Once per outer row','Twice','Depends on index'],'Once per outer row','medium','SQL'),
  mcq('SQL index btree','Default SQL index type?',['Hash','B-Tree','Sparse','Clustered'],'B-Tree','medium','SQL'),
  mcq('SQL window func','ROW_NUMBER() is a?',['Aggregate function','Window function','Scalar function','Table function'],'Window function','medium','SQL'),
  mcq('SQL transaction isolation','REPEATABLE READ prevents?',['Dirty reads and non-repeatable reads','Only dirty reads','Phantom reads','All anomalies'],'Dirty reads and non-repeatable reads','medium','SQL'),
  mcq('SQL left join','LEFT JOIN with WHERE right.col IS NULL finds?',['All matches','Non-matching left rows only','All left rows','Null rows'],'Non-matching left rows only','medium','SQL'),
  mcq('SQL having','HAVING filters?',['Rows before grouping','Groups after GROUP BY','Columns','Joins'],'Groups after GROUP BY','medium','SQL'),
  mcq('SQL cte','WITH clause creates?',['Permanent table','CTE (Common Table Expression)','Index','View'],'CTE (Common Table Expression)','medium','SQL'),
  mcq('SQL exists','EXISTS vs IN difference?',['No difference','EXISTS stops at first match','IN is faster always','EXISTS uses index always'],'EXISTS stops at first match','medium','SQL'),
  mcq('SQL normalization','3NF removes?',['Duplicate rows','Transitive dependencies','All redundancy','Null values'],'Transitive dependencies','medium','SQL'),
  mcq('SQL deadlock','SQL deadlock occurs when?',['Table is locked','Two transactions wait for each other','Index missing','Query timeout'],'Two transactions wait for each other','medium','SQL'),

  // ═══ HTML – Easy ══════════════════════════════════════════════════════════
  mcq('HTML doctype','<!DOCTYPE html> declares?',['CSS version','HTML5 document','JS strict mode','XML mode'],'HTML5 document','easy','HTML'),
  mcq('HTML semantic','Which is semantic HTML?',['<div>','{[span]}','<article>','<b>'],'<article>','easy','HTML'),
  mcq('HTML alt','alt attribute on <img> provides?',['Tooltip','Alternative text for accessibility','Caption','Title'],'Alternative text for accessibility','easy','HTML'),
  mcq('HTML form method','Default form method?',['POST','GET','PUT','DELETE'],'GET','easy','HTML'),
  mcq('HTML head','<head> contains?',['Visible content','Metadata and links','Navigation','Footer'],'Metadata and links','easy','HTML'),
  mcq('HTML self closing','Which tag is self-closing?',['<div>','<p>','<span>','<br>'],'<br>','easy','HTML'),
  mcq('HTML href','<a href="#"> links to?',['External page','Top of current page','Empty link technically (hash)','New tab'],'Top of current page','easy','HTML'),
  mcq('HTML table header','Table header cell tag?',['<td>','<th>','<tr>','<thead>'],'<th>','easy','HTML'),
  mcq('HTML script defer','defer attribute on <script>?',['Blocks parsing','Loads async executes after parse','Executes immediately','Ignores script'],'Loads async executes after parse','easy','HTML'),
  mcq('HTML input type','<input type="email"> validates?',['Password','Phone number','Email format','URL'],'Email format','easy','HTML'),

  // ═══ Operating Systems – Easy ════════════════════════════════════════════
  mcq('OS process','A process is?',['Program on disk','Program in execution','File in memory','Thread'],'Program in execution','easy','Operating Systems'),
  mcq('OS thread','Thread is?',['Lightweight process','Heavy process','File','Socket'],'Lightweight process','easy','Operating Systems'),
  mcq('OS deadlock','Deadlock requires?',['Mutual exclusion only','Mutual exclusion, hold & wait, no preemption, circular wait','Only circular wait','Only no preemption'],'Mutual exclusion, hold & wait, no preemption, circular wait','easy','Operating Systems'),
  mcq('OS virtual memory','Virtual memory provides?',['Faster RAM','Illusion of more memory','Physical RAM','Cache'],'Illusion of more memory','easy','Operating Systems'),
  mcq('OS scheduling','Round Robin scheduling uses?',['Priority queue','Time quantum','FIFO only','Random'],'Time quantum','easy','Operating Systems'),
  mcq('OS context switch','Context switch saves/restores?',['File handles','Process state (registers, PC)','Network connections','Heap only'],'Process state (registers, PC)','easy','Operating Systems'),
  mcq('OS paging','Paging divides memory into?',['Segments','Fixed-size pages','Variable blocks','Clusters'],'Fixed-size pages','easy','Operating Systems'),
  mcq('OS semaphore','Semaphore is used for?',['Memory allocation','Process synchronization','File I/O','CPU scheduling'],'Process synchronization','easy','Operating Systems'),
  mcq('OS kernel','Kernel runs in?',['User space','Kernel space','Both','Neither'],'Kernel space','easy','Operating Systems'),
  mcq('OS pipe','IPC pipes communicate?',['Network','Between related processes','Between files','Across networks'],'Between related processes','easy','Operating Systems'),

  // ═══ Networks – Easy ══════════════════════════════════════════════════════
  mcq('NET HTTP status','HTTP 404 means?',['Server error','Not found','Redirect','Unauthorized'],'Not found','easy','Networking'),
  mcq('NET TCP UDP','TCP vs UDP key difference?',['Speed','TCP reliable ordered, UDP unreliable faster','UDP has handshake','TCP is faster'],'TCP reliable ordered, UDP unreliable faster','easy','Networking'),
  mcq('NET DNS','DNS resolves?',['IP to MAC','Domain to IP','URL to HTML','Port to service'],'Domain to IP','easy','Networking'),
  mcq('NET HTTP methods','Idempotent HTTP method?',['POST','GET, PUT, DELETE','PATCH','POST, DELETE'],'GET, PUT, DELETE','easy','Networking'),
  mcq('NET port','HTTP default port?',['443','8080','80','22'],'80','easy','Networking'),
  mcq('NET HTTPS port','HTTPS default port?',['80','8443','443','4443'],'443','easy','Networking'),
  mcq('NET REST','REST stands for?',['Remote Execution State Transfer','Representational State Transfer','Resource External Service Transfer','Remote State Transfer'],'Representational State Transfer','easy','Networking'),
  mcq('NET IP class','Private IP 192.168.x.x is class?',['A','B','C','D'],'C','easy','Networking'),
  mcq('NET websocket','WebSocket provides?',['One-way communication','Full-duplex communication','Request-response only','File transfer'],'Full-duplex communication','easy','Networking'),
  mcq('NET cookie','Cookies are stored?',['Server','Database','Client browser','CDN'],'Client browser','easy','Networking'),

  // ═══ Security – Easy ══════════════════════════════════════════════════════
  mcq('SEC XSS','XSS stands for?',['Cross-Site Scripting','Cross-Server Script','Custom Script Sharing','CSS Extension'],'Cross-Site Scripting','easy','Security'),
  mcq('SEC SQL injection','SQL injection prevention?',['Firewall only','Prepared statements/parameterized queries','Input length limit','HTTPS'],'Prepared statements/parameterized queries','easy','Security'),
  mcq('SEC CSRF','CSRF attack forges?',['Password reset','User request from another site','Cookie theft','DNS'],'User request from another site','easy','Security'),
  mcq('SEC JWT parts','JWT has how many parts?',['2','3','4','5'],'3','easy','Security'),
  mcq('SEC bcrypt','bcrypt is used for?',['Encryption','Password hashing','Token generation','Key exchange'],'Password hashing','easy','Security'),
  mcq('SEC HTTPS','HTTPS uses?',['HTTP + FTP','HTTP + TLS/SSL','HTTP + SSH','HTTP + UDP'],'HTTP + TLS/SSL','easy','Security'),
  mcq('SEC salt','Salt in password hashing?',['Encrypts password','Random value added before hashing','Decrypts stored hash','Validates token'],'Random value added before hashing','easy','Security'),
  mcq('SEC 2FA','2FA means?',['Two Factor Authentication','Two File Authentication','Transfer Factor Auth','Two Firewall Auth'],'Two Factor Authentication','easy','Security'),
  mcq('SEC cors','CORS policy is enforced by?',['Server','Browser','Router','Database'],'Browser','easy','Security'),
  mcq('SEC phishing','Phishing attacks target?',['Servers','Users via deception','Databases','Networks'],'Users via deception','easy','Security'),

  // ═══ Code Output Questions ════════════════════════════════════════════════
  code('JS output 1','What is the output of: console.log(typeof [])?','object','easy','JavaScript'),
  code('JS output 2','What is the output of: console.log(0.1 + 0.2 === 0.3)?','false','easy','JavaScript'),
  code('JS output 3','console.log(1 + "2" + 3) outputs?','123','easy','JavaScript'),
  code('JS output 4','console.log(+"") outputs?','0','easy','JavaScript'),
  code('JS output 5','console.log(null == undefined) outputs?','true','easy','JavaScript'),
  code('JS output 6','let x=1; if(x=2){console.log(x)} outputs?','2','easy','JavaScript'),
  code('JS output 7','console.log([1,2]+[3,4]) outputs?','1,23,4','medium','JavaScript'),
  code('JS output 8','console.log(typeof NaN) outputs?','number','easy','JavaScript'),
  code('JS output 9','console.log(!!"") outputs?','false','easy','JavaScript'),
  code('JS output 10','console.log(2**10) outputs?','1024','easy','JavaScript'),

  // ═══ Java – Easy ══════════════════════════════════════════════════════════
  mcq('Java entry point','What is the signature of the main method in Java?',['public void main(String[] args)','public static void main(String args)','public static void main(String[] args)','static public void main(args)'],'public static void main(String[] args)','easy','Java'),
  mcq('Java default value','What is the default value of a boolean in Java?',['true','false','null','0'],'false','easy','Java'),
  mcq('Java compilation','Java source code is compiled into?',['Machine code','Source code','Bytecode','Assembly'],'Bytecode','easy','Java'),
  mcq('Java operator','Which operator is used to create an object in Java?',['new','create','alloc','make'],'new','easy','Java'),
  mcq('Java inherit','Which keyword is used for inheritance in Java?',['inherits','extends','implements','base'],'extends','easy','Java'),
  mcq('Java print','How to print to console in Java?',['console.log()','System.out.println()','printf()','print()'],'System.out.println()','easy','Java'),
  mcq('Java string','String in Java is a?',['Primitive type','Object','Array','Character'],'Object','easy','Java'),
  mcq('Java size','Size of int in Java is?',['16-bit','32-bit','64-bit','8-bit'],'32-bit','easy','Java'),

  // ═══ TypeScript – Easy ════════════════════════════════════════════════════
  mcq('TS type','Which keyword is used to define a type alias?',['type','interface','alias','define'],'type','easy','TypeScript'),
  mcq('TS boolean','How to type a boolean variable?',['let x: bool','let x: boolean','let x: Boolean','let x: flag'],'let x: boolean','easy','TypeScript'),
  mcq('TS unknown','Difference between any and unknown?',['No difference','unknown is safer (requires check)','any is safer','unknown is only for numbers'],'unknown is safer (requires check)','easy','TypeScript'),
  mcq('TS enum','Enums in TS provide?',['Numeric values only','Named constants','Strings only','Function shortcuts'],'Named constants','easy','TypeScript'),
  mcq('TS compiler','TS compiles to?',['Assembly','Machine code','JavaScript','C++'],'JavaScript','easy','TypeScript'),

  // ═══ C++ – Easy ═══════════════════════════════════════════════════════════
  mcq('CPP pointer','How to declare a pointer to an int?',['int &p','int *p','pointer int p','int $p'],'int *p','easy','C++'),
  mcq('CPP memory','Which operator deletes memory allocated with new?',['free','delete','remove','destroy'],'delete','easy','C++'),
  mcq('CPP header','C++ standard input/output header?',['<stdio.h>','<iostream>','<conio.h>','<stdlib.h>'],'<iostream>','easy','C++'),
  mcq('CPP namespace','Standard namespace in C++?',['std','main','sys','lib'],'std','easy','C++'),

  // ═══ DevOps & Docker – Easy ══════════════════════════════════════════════
  mcq('Docker image','A running instance of an image is called?',['Process','Pod','Container','Node'],'Container','easy','DevOps'),
  mcq('Docker build','What file defines a Docker image?',['docker.sh','Dockerfile','config.yml','docker-compose.json'],'Dockerfile','easy','DevOps'),
  mcq('Git branch','command to create a new branch?',['git create','git branch','git checkout -b','git new'],'git checkout -b','easy','DevOps'),
  mcq('CI/CD','CI stands for?',['Continuous Integration','Continuous Improvement','Code Integration','Central Interface'],'Continuous Integration','easy','DevOps'),

  // ═══ Cloud (AWS) – Easy ═══════════════════════════════════════════════════
  mcq('AWS compute','What is the AWS service for virtual servers?',['S3','EC2','Lambda','RDS'],'EC2','easy','Cloud'),
  mcq('AWS storage','S3 is primarily used for?',['Databases','Object storage','Compute','Networking'],'Object storage','easy','Cloud'),
  mcq('Cloud region','A collection of data centers in a specific area?',['Zone','Region','Bucket','Cluster'],'Region','easy','Cloud'),
  mcq('AWS serverless','AWS service for running code without servers?',['Fargate','EC2','Lambda','Lightsail'],'Lambda','easy','Cloud'),

  // ═══ More Python ══════════════════════════════════════════════════════════
  mcq('PY range 2','What is range(2, 5) results?',['2,3,4,5','2,3,4','3,4,5','2,5'],'2,3,4','easy','Python'),
  mcq('PY docstring','Docstrings use which quotes?',['"','\'','"""','//'],'"""','easy','Python'),
  mcq('PY set add','How to add to a set?',['set.append()','set.add()','set.push()','set.insert()'],'set.add()','easy','Python'),

  // ═══ More JavaScript ══════════════════════════════════════════════════════
  mcq('JS event bubble','Event bubbling moves?',['Down the DOM','Up the DOM','Sideways','Nowhere'],'Up the DOM','easy','JavaScript'),
  mcq('JS localstorage','localStorage data persists until?',['Browser closed','Cleared manually/script','1 hour','1 day'],'Cleared manually/script','easy','JavaScript'),
  mcq('JS fetch','fetch() returns a?',['XML','Object','Promise','String'],'Promise','easy','JavaScript'),

  code('PY output 1','print(type([]).__name__) outputs?','list','easy','Python'),
  code('PY output 2','print(3//2) in Python 3 outputs?','1','easy','Python'),
  code('PY output 3','print("ab"*3) outputs?','ababab','easy','Python'),
  code('PY output 4','print(bool("")) outputs?','False','easy','Python'),
  code('PY output 5','x=[1,2,3]; x.append(x); print(len(x)) outputs?','4','medium','Python'),
  code('JS async output','Output order: console.log(1); setTimeout(()=>console.log(2),0); console.log(3)?','1 3 2','medium','JavaScript'),
  code('JS closure output','let fns=[]; for(var i=0;i<3;i++)fns.push(()=>i); fns[0]() outputs?','3','medium','JavaScript'),
  code('JS proto output','console.log([] instanceof Array) outputs?','true','easy','JavaScript'),
  code('PY list mult','print([0]*3) outputs?','[0, 0, 0]','easy','Python'),
  code('PY dict get','d={"a":1}; print(d.get("b",0)) outputs?','0','easy','Python'),
  code('JAVA output 1','System.out.println(5 + 5 + "10") outputs?','1010','medium','Java'),
  code('JAVA output 2','System.out.println("10" + 5 + 5) outputs?','1055','medium','Java'),
  code('CPP output 1','cout << 10/3; (assume integers) outputs?','3','easy','C++'),
  code('TS output 1','let x: any = 1; x = "a"; console.log(typeof x); outputs?','string','easy','TypeScript'),
];

// ─── Seed Function ────────────────────────────────────────────────────────────
async function seed() {
  try {
    await User.deleteMany({});
    await Question.deleteMany({});
    await Quiz.deleteMany({});

    // Create admin
    const admin = await User.create({
      name: 'samhitha', email: 'samhitha@gmail.com',
      password: 'samhitha@gmail.com', role: 'admin',
    });

    // Create sample students
    const students = await User.insertMany([
      { name: 'Alice Dev', email: 'alice@test.com', password: 'Test@1234', role: 'student' },
      { name: 'Bob Coder', email: 'bob@test.com', password: 'Test@1234', role: 'student' },
      { name: 'Carol Script', email: 'carol@test.com', password: 'Test@1234', role: 'student' },
    ]);

    // Insert all questions
    const withCreator = questions.map(q => ({ ...q, createdBy: admin._id }));
    const saved = await Question.insertMany(withCreator);
    console.log(`✅ Inserted ${saved.length} questions`);

    // Create quizzes by topic
    const topics = ['JavaScript', 'Python', 'Data Structures', 'Algorithms', 'React', 'Node.js', 'MongoDB', 'SQL', 'CSS', 'HTML', 'Security', 'Networking', 'Java', 'TypeScript', 'DevOps', 'Cloud', 'C++'];
    const difficulties = ['easy', 'medium', 'hard'];

    for (const topic of topics) {
      const topicQs = saved.filter(q => q.topic === topic);
      if (topicQs.length === 0) continue;

      for (const diff of difficulties) {
        const diffQs = topicQs.filter(q => q.difficulty === diff);
        if (diffQs.length === 0) continue;
        const quiz = new Quiz({
          title: `${topic} – ${diff.charAt(0).toUpperCase() + diff.slice(1)} Quiz`,
          description: `Test your ${topic} knowledge at ${diff} level.`,
          difficulty: diff, category: topic,
          timeLimit: diff === 'easy' ? 15 : diff === 'medium' ? 25 : 40,
          questions: diffQs.map(q => q._id),
          createdBy: admin._id, isPublished: true,
        });
        quiz.totalMarks = diffQs.reduce((a, q) => a + q.marks, 0);
        quiz.passingMarks = Math.ceil(quiz.totalMarks * 0.4);
        await quiz.save();
      }
    }

    // Mixed master quiz
    const masterQs = saved.slice(0, 50);
    const master = new Quiz({
      title: '🏆 CodeQuest Master Challenge',
      description: 'The ultimate 50-question mixed challenge covering all topics!',
      difficulty: 'mixed', category: 'General', timeLimit: 60,
      questions: masterQs.map(q => q._id),
      createdBy: admin._id, isPublished: true,
    });
    master.totalMarks = masterQs.reduce((a, q) => a + q.marks, 0);
    master.passingMarks = Math.ceil(master.totalMarks * 0.4);
    await master.save();

    console.log('✅ Quizzes created!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Admin:   samhitha@gmail.com  |  samhitha@gmail.com');
    console.log('📧 Student: alice@test.com       |  Test@1234');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
