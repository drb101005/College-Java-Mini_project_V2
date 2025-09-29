export const seedData = () => {
  // Check if data already exists
  if (localStorage.getItem('users') && JSON.parse(localStorage.getItem('users')).length > 0) {
    return; // Data already seeded
  }

  // Sample users
  const users = [
    {
      id: 1,
      username: 'john_student',
      email: 'student@test.com',
      password: 'password',
      role: 'student',
      bio: 'Computer Science student passionate about programming',
      points: 45,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      username: 'sarah_mentor',
      email: 'mentor@test.com',
      password: 'password',
      role: 'mentor',
      bio: 'Senior Software Engineer with 8 years experience',
      points: 120,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      username: 'alex_coder',
      email: 'alex@test.com',
      password: 'password',
      role: 'student',
      bio: 'Learning web development and loving it!',
      points: 28,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 4,
      username: 'prof_smith',
      email: 'professor@test.com',
      password: 'password',
      role: 'mentor',
      bio: 'Mathematics Professor specializing in algorithms',
      points: 95,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Sample questions
  const questions = [
    {
      id: 1,
      title: 'How do I center a div in CSS?',
      description: 'I\'ve been trying to center a div both horizontally and vertically but nothing seems to work. I\'ve tried margin: auto but it only centers horizontally. What\'s the best modern approach?',
      tags: 'css, html, styling',
      userId: 1,
      username: 'john_student',
      userRole: 'student',
      isSolved: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      title: 'What is the difference between let, const, and var in JavaScript?',
      description: 'I keep seeing these different ways to declare variables in JavaScript. When should I use each one? What are the main differences between them?',
      tags: 'javascript, variables, es6',
      userId: 3,
      username: 'alex_coder',
      userRole: 'student',
      isSolved: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      title: 'How to implement binary search algorithm?',
      description: 'I understand the concept of binary search but I\'m having trouble implementing it in code. Can someone show me a clean implementation and explain the time complexity?',
      tags: 'algorithms, binary-search, programming',
      userId: 1,
      username: 'john_student',
      userRole: 'student',
      isSolved: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 4,
      title: 'React useState vs useEffect - when to use each?',
      description: 'I\'m new to React hooks and I\'m confused about when to use useState versus useEffect. Can someone explain the difference and provide some examples?',
      tags: 'react, hooks, javascript',
      userId: 3,
      username: 'alex_coder',
      userRole: 'student',
      isSolved: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 5,
      title: 'Best practices for database design?',
      description: 'I\'m working on my first database project and want to make sure I follow good practices. What are the most important principles for database design?',
      tags: 'database, design, sql',
      userId: 1,
      username: 'john_student',
      userRole: 'student',
      isSolved: false,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Sample answers
  const answers = [
    {
      id: 1,
      questionId: 1,
      userId: 2,
      username: 'sarah_mentor',
      userRole: 'mentor',
      answerText: 'The modern and most flexible way to center a div is using Flexbox:\n\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}\n\nThis centers the child div both horizontally and vertically. You can also use CSS Grid:\n\n.container {\n  display: grid;\n  place-items: center;\n  height: 100vh;\n}\n\nBoth methods are widely supported and much cleaner than older techniques.',
      votes: 12,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      questionId: 1,
      userId: 3,
      username: 'alex_coder',
      userRole: 'student',
      answerText: 'You can also use the transform method:\n\n.centered {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n\nThis works well when you need absolute positioning.',
      votes: 5,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      questionId: 2,
      userId: 2,
      username: 'sarah_mentor',
      userRole: 'mentor',
      answerText: 'Great question! Here are the key differences:\n\n**var:**\n- Function-scoped or globally-scoped\n- Can be redeclared\n- Hoisted and initialized with undefined\n\n**let:**\n- Block-scoped\n- Cannot be redeclared in same scope\n- Hoisted but not initialized (temporal dead zone)\n\n**const:**\n- Block-scoped\n- Cannot be redeclared or reassigned\n- Must be initialized at declaration\n- Hoisted but not initialized\n\nUse const by default, let when you need to reassign, and avoid var in modern JavaScript.',
      votes: 18,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 4,
      questionId: 3,
      userId: 4,
      username: 'prof_smith',
      userRole: 'mentor',
      answerText: 'Here\'s a clean recursive implementation of binary search:\n\n```javascript\nfunction binarySearch(arr, target, left = 0, right = arr.length - 1) {\n  if (left > right) {\n    return -1; // Element not found\n  }\n  \n  const mid = Math.floor((left + right) / 2);\n  \n  if (arr[mid] === target) {\n    return mid;\n  } else if (arr[mid] > target) {\n    return binarySearch(arr, target, left, mid - 1);\n  } else {\n    return binarySearch(arr, target, mid + 1, right);\n  }\n}\n```\n\nTime complexity: O(log n)\nSpace complexity: O(log n) due to recursion stack\n\nFor an iterative version with O(1) space complexity, you can use a while loop instead.',
      votes: 8,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Sample comments
  const comments = [
    {
      id: 1,
      answerId: 1,
      userId: 1,
      username: 'john_student',
      userRole: 'student',
      commentText: 'Thanks! The flexbox solution worked perfectly for my project.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      answerId: 1,
      userId: 3,
      username: 'alex_coder',
      userRole: 'student',
      commentText: 'CSS Grid is so much simpler than I thought!',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      answerId: 3,
      userId: 1,
      username: 'john_student',
      userRole: 'student',
      commentText: 'This explanation finally made it click for me. Thank you!',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Store data in localStorage
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('questions', JSON.stringify(questions));
  localStorage.setItem('answers', JSON.stringify(answers));
  localStorage.setItem('comments', JSON.stringify(comments));
  localStorage.setItem('reports', JSON.stringify([]));

  console.log('Sample data seeded successfully!');
};