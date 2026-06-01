const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";  

const getToken = () => localStorage.getItem("token");

const headers = (isForm = false) => {
  const h = { Authorization: `Bearer ${getToken()}` };
  if (!isForm) h["Content-Type"] = "application/json";
  return h;
};

// Auth
export const register = (name, email, password) =>
  fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  }).then((r) => r.json());

export const login = (email, password) => {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);
  return fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: form,
  }).then((r) => r.json());
};

// Resume
export const uploadResume = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return fetch(`${BASE_URL}/resume/upload`, {
    method: "POST",
    headers: headers(true),
    body: fd,
  }).then((r) => r.json());
};

export const getResumes = () =>
  fetch(`${BASE_URL}/resume/resume`, { headers: headers() }).then((r) => r.json());

export const analyzeResume = (id) =>
  fetch(`${BASE_URL}/resume/analyze/${id}`, { headers: headers() }).then((r) => r.json());

export const llmAnalyzeResume = (id) =>
  fetch(`${BASE_URL}/resume/llm-analysis/${id}`, { headers: headers() }).then((r) => r.json());

// Interview
export const generateQuestions = (resumeId, interviewType, difficulty) =>
  fetch(
    `${BASE_URL}/interview/generate/${resumeId}?interview_type=${encodeURIComponent(interviewType)}&difficulty=${encodeURIComponent(difficulty)}`,
    { method: "POST", headers: headers() }
  ).then((r) => r.json());

export const evaluateAnswer = (question, answer, interviewType, difficulty) => {
  const params = new URLSearchParams({ question, answer, interview_type: interviewType, difficulty });
  return fetch(`${BASE_URL}/interview/evaluate?${params}`, {
    method: "POST",
    headers: headers(),
  }).then((r) => r.json());
};

// Analytics
export const getAnalytics = () =>
  fetch(`${BASE_URL}/analytics/performance`, { headers: headers() }).then((r) => r.json());
