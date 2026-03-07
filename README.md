# 🎬 YouTube Backend Project

A backend clone of **YouTube’s core features**, extended with a **React + Tailwind frontend** for authentication.  
This project demonstrates how a modern content-sharing platform can be structured with **Node.js, Express, MongoDB**, and a sleek **React UI**.

---

## 🛠️ Technologies Used

### ⚙️ Backend
- 🚀 **Node.js + Express.js** → RESTful API development  
- 🗄️ **MongoDB (Mongoose)** → Schema & data models (User, Video, Comment, Like, Playlist, Subscription, Tweet)  
- 🔐 **JWT Authentication** → Secure login & session handling  
- ✨ **Prettier** → Code formatting  

### 🎨 Frontend
- ⚛️ **React.js** → Component-based UI  
- 🎨 **Tailwind CSS** → Utility-first styling for responsive, modern design  
- 🧭 **React Router** → Navigation between login/register pages  
- 🌐 **Axios/Fetch** → API calls to backend  

---

## ⚙️ How It Works (Completed Features)

### 🔑 Authentication Flow
- 📝 **Register (React + Tailwind)**  
  - User fills styled form → React sends request to backend API  
  - Backend validates input, hashes password, stores user in MongoDB  
  - ✅ Success message returned to frontend  

- 🔑 **Login (React + Tailwind)**  
  - User submits credentials → React sends request to backend API  
  - Backend verifies password and generates JWT token  
  - 🔄 Token returned to frontend → stored for session management  
  - 🎨 Tailwind ensures clean, responsive UI for forms  

### 🎥 Video Module (Backend)
- 📤 Authenticated users can **upload, update, and delete videos**  
- 📝 Metadata (title, description, tags) stored in MongoDB  
- 👤 Videos linked to user accounts  

---

## 📌 Current Status

- ✅ **Working**  
  - Backend: User & Video controllers/routers  
  - Frontend: Login & Register pages (React + Tailwind) connected to backend  

- ⏳ **Pending**  
  - Backend: Controllers/routers for comments, likes, playlists, subscriptions, tweet  
  - Frontend: Video upload UI, playlist management interface, user dashboard  

---
