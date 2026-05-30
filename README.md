# PrepAI — AI Interview Preparation Platform

PrepAI is a full-stack web application that helps job seekers prepare for technical and behavioural interviews. Users upload their resume, receive AI-powered feedback on it, then practice with interview questions generated specifically from their background. Every answer is evaluated by an AI interviewer that gives a score, identifies strengths and weaknesses, and offers improvement suggestions.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Local Setup](#local-setup)
  - [Prerequisites](#prerequisites)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Deployment](#deployment)
  - [Backend on Render](#backend-on-render)
  - [Frontend on Vercel](#frontend-on-vercel)
  - [Connecting Frontend to Backend](#connecting-frontend-to-backend)
- [Known Limitations](#known-limitations)

---

## Features

### Authentication
- Register with name, email, and password
- Login returns a JWT access token (1-hour expiry)
- Passwords are hashed with bcrypt
- All protected routes require a Bearer token

### Resume Management
- Upload a PDF resume (stored on the server)
- Text is automatically extracted from the PDF using `pdfplumber`
- **Basic analysis** — rule-based keyword scanner that identifies known skills (Python, FastAPI, Docker, AWS, SQL, TensorFlow, etc.) and returns strengths and recommendations
- **AI analysis** — GPT-4o reads the full resume and returns technical strengths, missing skills, career recommendations, interview preparation advice, and an overall evaluation

### Interview Practice
- Select a resume, interview type, and difficulty level
- GPT-4o generates 5 tailored interview questions based on the actual resume content
- Supported interview types: Technical, Behavioural, System Design, HR
- Difficulty levels: Easy, Medium, Hard
- Answer each question in the browser
- GPT-4o evaluates every answer and returns:
  - A score out of 10
  - Strengths of the answer
  - Weaknesses of the answer
  - Specific improvement suggestions
  - A final summary evaluation
- Each session (question + answer + score) is persisted to the database

### Analytics
- Total number of interview sessions completed
- Average score across all sessions
- Highest score achieved
- Lowest score achieved

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | FastAPI (Python) |
| Database ORM | SQLAlchemy |
| Database | PostgreSQL (or SQLite locally) |
| Authentication | JWT via `python-jose`, passwords via `passlib[bcrypt]` |
| PDF extraction | `pdfplumber` |
| AI — question generation | OpenAI GPT-4o |
| AI — answer evaluation | OpenAI GPT-4o |
| AI — resume analysis | OpenAI GPT-4o |
| Basic resume analysis | Custom keyword matcher |
| Frontend framework | React 18 |
| Frontend build tool | Vite |
| Frontend styling | Plain CSS with CSS variables (no framework) |
| Fonts | Syne + DM Mono (Google Fonts) |
| Deployment — backend | Render |
| Deployment — frontend | Vercel |

---

## Project Structure

```
ai-interview-platform/
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── answer_evaluator.py       # GPT-4o answer scoring
│   │   │   ├── interview_generator.py    # GPT-4o question generation
│   │   │   ├── llm_resume_analyzer.py    # GPT-4o resume analysis
│   │   │   └── resume_analyzer.py        # Rule-based keyword analysis
│   │   ├── db/
│   │   │   ├── database.py               # SQLAlchemy engine setup
│   │   │   └── session.py                # DB session dependency
│   │   ├── models/
│   │   │   ├── users.py                  # User table
│   │   │   ├── resume.py                 # Resume table
│   │   │   └── interview_session.py      # Interview session table
│   │   ├── routes/
│   │   │   ├── auth.py                   # POST /auth/register, /auth/login
│   │   │   ├── user.py                   # GET /user
│   │   │   ├── resume.py                 # Resume upload & analysis
│   │   │   ├── interview.py              # Question generation & evaluation
│   │   │   └── analytics.py              # Performance stats
│   │   ├── schemas/
│   │   │   └── user.py                   # Pydantic schemas
│   │   ├── utils/
│   │   │   ├── dependencies.py           # get_current_user dependency
│   │   │   └── security.py               # JWT + bcrypt helpers
│   │   └── main.py                       # App entry point, CORS config
│   ├── uploads/                          # Uploaded PDF files (gitignore this)
│   ├── .env                              # Environment variables (never commit)
│   └── requirements.txt
│
└── prepai-frontend/
    └── interview-app/
        ├── src/
        │   ├── services/
        │   │   └── api.js                # All fetch calls to the backend
        │   ├── App.jsx                   # All pages and components
        │   └── main.jsx                  # React root
        ├── index.html
        ├── vite.config.js                # Dev server + API proxy
        └── package.json
```

---

## How It Works

### Authentication flow
1. User registers → password is bcrypt-hashed → stored in `users` table
2. User logs in → password is verified → a signed JWT is returned
3. The frontend stores the JWT in `localStorage` and sends it as `Authorization: Bearer <token>` on every subsequent request
4. Protected FastAPI routes use the `get_current_user` dependency to decode the token and identify the user

### Resume flow
1. User uploads a PDF → saved to the `/uploads` directory on the server
2. `pdfplumber` extracts all text from every page
3. The extracted text is stored in the `resumes` table alongside the user ID and filename
4. Basic analysis: the text is scanned for known skill keywords
5. LLM analysis: the full extracted text is sent to GPT-4o with a career coaching prompt

### Interview flow
1. User selects a resume, interview type, and difficulty
2. The resume's extracted text is fetched from the database
3. GPT-4o receives the resume text, interview type, and difficulty and returns 5 questions as a plain text string
4. The frontend splits the string on newlines and strips numbering to render each question separately
5. The user types an answer for each question and clicks Evaluate
6. GPT-4o receives the question and answer and returns a structured evaluation (Score / Strengths / Weaknesses / Suggestions / Final Evaluation)
7. The question, answer, score, and evaluation are saved to the `interview_session` table
8. The score is parsed from the text using a regex on `Score: X/10`

---

## Local Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- A PostgreSQL database (or use SQLite for local dev by changing `DATABASE_URL`)
- An OpenAI API key

### Backend

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create your .env file (see Environment Variables section below)

# 5. Start the server
uvicorn app.main:app --reload
```

The API will be running at `http://localhost:8000`.
Interactive docs are available at `http://localhost:8000/docs`.

### Frontend

```bash
# 1. Navigate to the frontend folder
cd prepai-frontend/interview-app

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be running at `http://localhost:3000`.
The Vite dev server proxies all API calls to `http://localhost:8000` automatically, so no CORS issues during development.

---

## Environment Variables

Create a `.env` file inside the `backend/` folder with the following:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/prepai
# For local SQLite (no Postgres needed):
# DATABASE_URL=sqlite:///./prepai.db

# JWT
SECRET_KEY=your-long-random-secret-key-here
ALGORITHM=HS256

# OpenAI
OPENAI_API_KEY=sk-...
```

**Generating a secure SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

> Never commit your `.env` file. Add it to `.gitignore`.

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| POST | `/auth/register` | Create a new account | No |
| POST | `/auth/login` | Login and receive a JWT | No |

**Register body:**
```json
{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }
```

**Login** uses `application/x-www-form-urlencoded` with fields `username` (email) and `password`. Returns:
```json
{ "access_token": "eyJ...", "token_type": "bearer" }
```

---

### Resumes

All resume endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/resume/upload` | Upload a PDF resume |
| GET | `/resume/resume` | Get all resumes for the current user |
| GET | `/resume/analyze/{resume_id}` | Rule-based keyword analysis |
| GET | `/resume/llm-analysis/{resume_id}` | GPT-4o deep analysis |

---

### Interview

All interview endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/interview/generate/{resume_id}` | Generate 5 interview questions |
| POST | `/interview/evaluate` | Evaluate a single answer |

**Generate questions query params:** `interview_type`, `difficulty`

**Evaluate query params:** `question`, `answer`, `interview_type`, `difficulty`

**Evaluate response:**
```json
{
  "score": 7,
  "evaluation": "Score: 7/10\n\nStrengths:\n- ...\n\nWeaknesses:\n- ...",
  "session_id": 12
}
```

---

### Analytics

| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| GET | `/analytics/performance` | Aggregated score stats | Yes |

**Response:**
```json
{
  "total_sessions": 14,
  "average_score": 6.79,
  "highest_score": 9,
  "lowest_score": 3
}
```

---

## Deployment

### Backend on Render

1. Push the `backend/` folder to a GitHub repository
2. Go to [render.com](https://render.com) → **New Web Service** → connect your repo
3. Configure the service:
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Under **Environment Variables**, add all variables from your `.env` file:
   - `DATABASE_URL` — use Render's free PostgreSQL add-on and copy the connection string it provides
   - `SECRET_KEY`
   - `ALGORITHM`
   - `OPENAI_API_KEY`
5. Click **Deploy**

Your API will be live at `https://your-service-name.onrender.com`.

---

### Frontend on Vercel

1. Push the `prepai-frontend/` folder to GitHub (can be the same repo)
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Set **Root Directory** to `prepai-frontend/interview-app`
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://your-service-name.onrender.com`
5. Click **Deploy**

---

### Connecting Frontend to Backend

After both are deployed you need to make two small changes:

**1. Update CORS in `backend/app/main.py`:**
```python
allow_origins=[
    "http://localhost:3000",
    "https://your-app.vercel.app",   # ← add your Vercel URL
],
```

**2. Update the base URL in `prepai-frontend/interview-app/src/services/api.js`:**
```js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
```

Commit and push both changes. Render and Vercel will automatically redeploy.

---

## Known Limitations

- **Uploaded files** are stored on the server's local filesystem. On Render's free tier the filesystem is ephemeral — files disappear on redeploy. For production, move file storage to an S3-compatible service (AWS S3, Cloudflare R2, Supabase Storage).
- **Render free tier** spins down after 15 minutes of inactivity. The first request after idle takes ~30 seconds to wake up. Upgrade to the $7/month plan or use a cron job to ping the service every 10 minutes to keep it warm.
- **JWT tokens** are stored in `localStorage`, which is readable by JavaScript. For higher security, switch to `httpOnly` cookies.
- **Basic resume analysis** only scans for a fixed list of 11 skills. It does not understand context — a resume that mentions "no experience with Docker" would still match "Docker".
- **No token refresh** — sessions expire after 1 hour and the user must log in again.
- **Answer evaluation** uses regex to extract the score from GPT-4o's response. If the model formats the score differently, the score defaults to 0 and the session is still saved.
