const express = require('express');
const cors = require('cors');

const app = express();
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

// Get all posts
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// Get single post
app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// Create a post
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

// Update a post
app.put('/api/posts/:id', (req, res) => {
  const index = posts.findIndex(p => p.id == req.params.id);
  if (index !== -1) {
    posts[index] = { 
      ...posts[index], 
      title: req.body.title || posts[index].title,
      content: req.body.content || posts[index].content
    };
    res.json(posts[index]);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// Delete a post
app.delete('/api/posts/:id', (req, res) => {
  posts = posts.filter(p => p.id != req.params.id);
  res.json({ message: "Post deleted" });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working with local storage!' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Blog API ready (using in-memory storage)`);
  console.log(`📋 Test the API at: http://localhost:5000/api/test`);
});