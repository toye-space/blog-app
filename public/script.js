// === API URL ===
const API_URL = '/api/posts';

// === GRAB ELEMENTS ===
const postsGrid = document.getElementById('posts-grid');
const formOverlay = document.getElementById('form-overlay');
const formTitle = document.getElementById('form-title');
const postIdInput = document.getElementById('post-id');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const contentInput = document.getElementById('content');
const feedback = document.getElementById('form-feedback');// === SHOW FORM ===
function showForm() {
  formTitle.textContent = 'New Post';
  postIdInput.value = '';
  titleInput.value = '';
  authorInput.value = '';
  contentInput.value = '';
  feedback.textContent = '';
  formOverlay.classList.add('active');
}

// === HIDE FORM ===
function hideForm() {
  formOverlay.classList.remove('active');
}// === FETCH ALL POSTS ===
async function fetchPosts() {
  try {
    const response = await fetch(API_URL);
    const posts = await response.json();

    if (posts.length === 0) {
      postsGrid.innerHTML = '<p class="empty-state">No posts yet. Create your first post!</p>';
      return;
    }

    postsGrid.innerHTML = posts.map(post => `
      <div class="post-card">
        <h3>${post.title}</h3>
        <p class="post-meta">By ${post.author} • ${new Date(post.createdAt).toLocaleDateString()}</p>
        <p>${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}</p>
        <div class="post-actions">
          <button class="edit-btn" onclick="editPost('${post._id}')">Edit</button>
          <button class="delete-btn" onclick="deletePost('${post._id}')">Delete</button>
        </div>
      </div>
    `).join('');

  } catch (error) {
    postsGrid.innerHTML = '<p class="empty-state">Failed to load posts.</p>';
  }
}// === SAVE POST ===
async function savePost() {
  const id = postIdInput.value;
  const title = titleInput.value.trim();
  const author = authorInput.value.trim() || 'Anonymous';
  const content = contentInput.value.trim();

  if (!title || !content) {
    feedback.textContent = 'Title and content are required.';
    return;
  }

  const postData = { title, author, content };

  try {
    if (id) {
      // UPDATE existing post
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
    } else {
      // CREATE new post
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
    }

    hideForm();
    fetchPosts();

  } catch (error) {
    feedback.textContent = 'Something went wrong. Try again.';
  }
}// === EDIT POST ===
async function editPost(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const post = await response.json();

    formTitle.textContent = 'Edit Post';
    postIdInput.value = post._id;
    titleInput.value = post.title;
    authorInput.value = post.author;
    contentInput.value = post.content;
    feedback.textContent = '';

    formOverlay.classList.add('active');

  } catch (error) {
    alert('Failed to load post.');
  }
}

// === DELETE POST ===
async function deletePost(id) {
  if (!confirm('Are you sure you want to delete this post?')) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchPosts();
  } catch (error) {
    alert('Failed to delete post.');
  }
}

// === LOAD POSTS ON PAGE LOAD ===
fetchPosts();