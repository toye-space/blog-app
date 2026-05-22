const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store posts in memory (no MongoDB needed)
let posts = [
  {
    id: 1,
    title: "My First Post",
    content: "Welcome to my blog! This is my first post.",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Learning Full-Stack",
    content: "I'm building a blog with Node.js and Express!",
    createdAt: new Date().toISOString()
  }
];

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Blog API is running on Railway!' });
});

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  post ? res.json(post) : res.status(404).json({ error: "Post not found" });
});

app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  const post = {
    id: Date.now(),
    title: title || "Untitled",
    content: content || "",
    createdAt: new Date().toISOString()
  };
  posts.push(post);
  res.json(post);
});

app.put('/api/posts/:id', (req, res) => {
  const index = posts.findIndex(p => p.id == req.params.id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...req.body };
    res.json(posts[index]);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

app.delete('/api/posts/:id', (req, res) => {
  posts = posts.filter(p => p.id != req.params.id);
  res.json({ message: "Post deleted" });
});

// Root route
app.get('/', (req, res) => {
  res.send('Blog API is running! Visit /api/posts to see posts.');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});