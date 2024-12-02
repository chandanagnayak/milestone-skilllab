const express = require('express');
const app = express();
app.use(express.json());

// Preloaded articles
let articles = [
  {
    id: 1,
    title: "Introduction to Node.js",
    content: "Node.js is a JavaScript runtime built on Chrome's V8 engine. It is used for building fast and scalable server applications.",
    date: new Date().toISOString()
  },
  {
    id: 2,
    title: "Understanding Express.js",
    content: "Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
    date: new Date().toISOString()
  },
  {
    id: 3,
    title: "Getting Started with REST APIs",
    content: "REST APIs allow systems to communicate with each other. They use HTTP requests to perform CRUD operations.",
    date: new Date().toISOString()
  }
];

let index = {}; // In-memory index for search

// Helper function to index an article
function indexArticle(id, title, content) {
  const words = (title + ' ' + content).toLowerCase().split(/\s+/);
  words.forEach(word => {
    if (!index[word]) {
      index[word] = new Set();
    }
    index[word].add(id);
  });
}

// Helper function to build index for all articles
function buildIndex() {
  index = {}; // Reset index
  articles.forEach(article => {
    indexArticle(article.id, article.title, article.content);
  });
}

// Build initial index
buildIndex();

// Add Article
app.post('/articles', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const article = {
    id: articles.length + 1,
    title,
    content,
    date: new Date().toISOString()
  };
  articles.push(article);
  indexArticle(article.id, title, content);
  res.status(201).json({ message: 'Article added successfully', id: article.id });
});

// Search Articles
app.get('/articles/search', (req, res) => {
  const keyword = req.query.keyword?.toLowerCase();
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required.' });
  }

  const matchingIds = Array.from(index[keyword] || []);
  const results = articles.filter(article => matchingIds.includes(article.id));
  res.json(results);
});

// Get Article by ID
app.get('/articles/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const article = articles.find(a => a.id === id);
  if (!article) {
    return res.status(404).json({ error: 'Article not found.' });
  }
  res.json(article);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
