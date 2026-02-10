🎥 YouTube Backend Project
-----------------------------
A backend project inspired by YouTube, built with Node.js, Express, and MongoDB.
This repository implements the backend logic for a video streaming platform, including authentication, video management, and user interactions.

📂 Project Structure
----------------------
src/
├── app.js             # Express application configuration
├── index.js           # Entry point: server startup & DB connection
├── constants.js       # Centralized constants (status codes, messages)
├── db/                # MongoDB connection setup
├── models/            # Mongoose models (User, Video, etc.)
├── controllers/       # Business logic for authentication & video features
├── routes/            # API route definitions
├── middlewares/       # Authentication & error ha




<h2>🔎 Functional Overview</h2>

<h3>Server Layer</h3>
<ul>
  <li><strong>index.js</strong> initializes the server and establishes the database connection.</li>
  <li><strong>app.js</strong> configures middleware (JSON parsing, cookies, CORS) and registers routes.</li>
</ul>

<h3>Database Layer</h3>
<ul>
  <li><strong>db/</strong> manages MongoDB connectivity using Mongoose.</li>
  <li><strong>models/</strong> define schemas for core entities:
    <ul>
      <li><strong>User</strong> → authentication, profile, subscriptions</li>
      <li><strong>Video</strong> → upload, metadata, streaming</li>
    </ul>
  </li>
</ul>

<h3>Application Logic</h3>
<ul>
  <li><strong>controllers/</strong> implement the core features:
    <ul>
      <li>User authentication (signup, login, JWT handling)</li>
      <li>Video operations (upload, delete, fetch)</li>
      <li>User interactions (likes, comments, playlists)</li>
    </ul>
  </li>
</ul>

<h3>Routing Layer</h3>
<ul>
  <li><strong>routes/</strong> map API endpoints to controllers (e.g., <code>/api/auth</code>, <code>/api/videos</code>).</li>
</ul>

<h3>Middleware Layer</h3>
<ul>
  <li>Authentication middleware validates JWT tokens.</li>
  <li>Error middleware ensures consistent and professional API responses.</li>
</ul>

<h3>Utility Layer</h3>
<ul>
  <li><strong>utils/</strong> provide helper functions for token generation, file handling, and reusable logic.</li>
</ul>

<h3>Constants</h3>
<ul>
  <li><strong>constants.js</strong> centralizes status codes and messages for clean, maintainable responses.</li>
</ul>


🛠️ Tech Stack
- Node.js – runtime environment
- Express.js – server framework
- MongoDB + Mongoose – database and ODM
- JWT – authentication
- Prettier – code formatting


