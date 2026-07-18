# 🤖 AI Knowledge Base Assistant

An AI-powered Knowledge Base Assistant that enables users to upload documents and ask intelligent, context-aware questions. The application extracts document content, stores metadata securely, and uses a Large Language Model (LLM) to generate responses grounded in the uploaded documents.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- User Login
- JWT-based Authentication
- Protected API Routes
- Secure Password Hashing using bcrypt

### 📄 Document Management
- Upload PDF, TXT, and Markdown files
- Automatic document text extraction
- Store document metadata
- Preview uploaded documents
- Delete documents
- Search uploaded documents

### 🤖 AI Question Answering
- Ask questions based on uploaded documents
- AI responses grounded in document content
- Prevents hallucinations by responding only from available context
- Graceful fallback when information is unavailable

### 💬 Chat History
- Stores previous conversations
- View historical questions and AI responses
- Search chat history

### 📊 Dashboard
- Total uploaded documents
- Total questions asked
- Failed extraction count
- Recent uploads
- Recent AI conversations

### ⚡ Additional Features
- Responsive UI
- Loading and Empty States
- Error Handling
- RESTful APIs
- Clean MVC Architecture

---

# 🛠 Tech Stack

## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- bcrypt

## AI
- Groq API
- Llama/OpenAI Compatible Model

---

# 📁 Project Structure

```
AI-Knowledge-Base-Assistant
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── app.js
│   ├── package.json
│   └── .env.example
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.ts
│
├── README.md
├── AI_USAGE.md
├── ARCHITECTURE.md
└── DEBUG_NOTES.md
```

---

# ⚙️ Environment Variables

## Backend

Create a `.env` file inside the backend folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_jwt_secret

GROQ_API_KEY=your_groq_api_key
```

---

# 💻 Installation

## Clone Repository

```bash
git clone https://github.com/your-username/ai-knowledge-base-assistant.git

cd ai-knowledge-base-assistant
```

---

## Backend Setup

```bash
cd backend

npm install

cp .env.example .env

npm run dev
```

---

## Frontend Setup

Open another terminal.

```bash
cd frontend

npm install

npm run dev
```

---

# 🌐 Running the Application

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |

---

## Documents

| Method | Endpoint |
|---------|----------|
| GET | /api/documents |
| POST | /api/documents |
| DELETE | /api/documents/:id |

---

## AI

| Method | Endpoint |
|---------|----------|
| POST | /api/ask |

---

## History

| Method | Endpoint |
|---------|----------|
| GET | /api/history |

---

## Dashboard

| Method | Endpoint |
|---------|----------|
| GET | /api/dashboard |

---

# 🔒 Security

- JWT Authentication
- Password Hashing using bcrypt
- Input Validation
- Protected Routes
- Secure Environment Variables
- Centralized Error Handling

---

# 🧠 AI Workflow

1. Upload a document.
2. Extract text from the document.
3. Store metadata and extracted content.
4. User submits a question.
5. Relevant document content is sent to the AI model.
6. AI generates a context-aware response.
7. Conversation is stored in chat history.

---

# 🚀 Future Improvements

- Semantic Search using Vector Database
- OCR Support
- Role-Based Access Control
- Redis Caching
- Streaming AI Responses
- Docker Support
- Unit & Integration Tests
- Multi-document Question Answering

---

# 📷 Screenshots

Add application screenshots here.

- Dashboard
- Documents
- AI Chat
- Chat History

---

# 👨‍💻 Author

**Om Prakash Karri**

GitHub: https://github.com/OMPRAKASHKARRI

LinkedIn: https://www.linkedin.com/in/omprakash-k-/

---

# 📄 License

This project was developed as part of a Full Stack Developer Technical Assessment and is intended for educational and evaluation purposes.