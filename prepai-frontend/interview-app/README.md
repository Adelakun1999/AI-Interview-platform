# PrepAI — Frontend

React + Vite frontend for the AI Interview Platform.

## Setup

```bash
npm install
npm run dev
```

The app runs at **http://localhost:3000** and proxies all API calls to your FastAPI backend at **http://localhost:8000**.

## Features

- 🔐 **Auth** — Register & login (JWT stored in localStorage)
- 📄 **Resumes** — Upload PDF, trigger basic or LLM-powered analysis
- 🎙️ **Interview** — Choose resume, type (technical / behavioural / system design / HR) & difficulty, get AI questions, type answers, get scored feedback
- 📊 **Analytics** — Overall stats: total sessions, avg/best/lowest score

## Backend requirements

Make sure your FastAPI backend is running:

```bash
cd backend
uvicorn app.main:app --reload
```

The CORS config in `main.py` already allows `http://localhost:3000`.
