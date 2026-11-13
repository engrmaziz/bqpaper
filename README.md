# 🚀 Bano Qabil - Essentials of AI Midterm Examination Platform

A modern, full-stack, AI-powered online examination platform designed for 8th-grade students covering **Weeks 1 to 6 ("Essentials of AI")**. The platform features instant automated grading via **Groq Cloud API (`llama-3.3-70b-versatile`)**, interactive timed exams, student score breakdowns, and an executive **Teacher Marksheet Dashboard** with 1-click CSV download.

---

## 🌟 Key Features

### 1. 🎓 Student Experience
- **Unique Registration:** Captures Student Full Name, Email Address, Roll Number (e.g. `BQ-801`), and Section (`Grade 8A/8B`).
- **80-Minute Countdown Timer:** Live countdown calibrated for 1 hour 20 minutes with automatic submission when time expires.
- **Structured Sections:**
  - **Section A (20 Marks):** 20 Multiple Choice Questions with radio button selection and visual review grid.
  - **Section B (10 Marks):** 2 Conceptual Short Answer Questions with guided sub-questions (Supervised vs. Unsupervised, Pakistani real-world cases, Data quality 4 pillars, Overfitting/Ratta).
  - **Section C (20 Marks):** 1 Comprehensive Long Question covering voice assistant architectures (STT $\to$ LLM $\to$ TTS), Roman Urdu sarcasm/slang analysis, and Computer Vision healthcare ethics (False Alarms vs. Misses).
  - **Section D (50 Marks):** "The Smart Canteen AI" 5-Milestone Practical Project (Teachable Machine data collection, clean tabular schemas, spreadsheet anomaly debugging, Landbot prompt engineering, and model cards).
- **Instant Result & Feedback:** Upon clicking "Submit Exam", the Groq AI engine grades the subjective answers against the official rubric in seconds, presenting a celebration modal, letter grade (A+, A, B, C, D, F), section breakdown, and personalized feedback.

### 2. 👨‍🏫 Teacher Dashboard & Marksheet
- **Class Performance Analytics:** Live metrics showing total submissions, class average score, highest score, lowest score, and pass rate ($\ge 50\%$).
- **Search & Filter:** Instant search by student name, roll number, section, or grade.
- **Detailed Paper Inspection:** Click any student row to view their full submission, question-by-question breakdown, and evaluator notes.
- **Downloadable CSV Marksheet:** One-click instant export of the complete class marksheet formatted with student demographics, individual section scores, total marks, percentage, letter grade, and evaluation engine.

### 3. 🎨 Visual Identity (`maziz.me` Thematics)
- **Deep Space Canvas:** `#050a14` base background with `#0a1224` glassmorphism card surfaces.
- **Electric Cyan Accents:** `#00d4ff` glows, borders, and primary interactive highlights.
- **Warm Gold Accents:** `#E8B86D` badges, timer alerts, and score callouts.
- **Typography:** Crisp sans-serif with high contrast readability (`#e8eef7`).

### 4. ⚡ Zero-Failure Groq AI & Heuristic Fallback
- Powered by Groq's high-throughput `llama-3.3-70b-versatile` model.
- Enter your Groq API key via `.env.local` or directly through the in-app **API Key Modal** (top-right key icon).
- **Guaranteed Zero-Crash Fallback:** If no API key is provided or network quota is exceeded, the built-in deterministic rubric grading engine takes over seamlessly, scoring every answer according to the official marking criteria.

---

## 🛠️ Tech Stack
- **Framework:** Next.js 16 (Turbopack, App Router)
- **UI & Styling:** React 19, Tailwind CSS v4, Lucide Icons
- **Animation & Effects:** `canvas-confetti`
- **AI Evaluation:** Groq Cloud API (`llama-3.3-70b-versatile`)
- **Persistence:** High-reliability hybrid storage (memory + local JSON store)
- **Export:** Native RFC 4180 CSV engine

---

## 🏃 Local Development

1. **Install dependencies:**
   ```bash
   cd ai-exam-platform
   npm install
   ```

2. **Configure Groq API Key (Optional):**
   Create a `.env.local` file:
   ```env
   GROQ_API_KEY=gsk_your_api_key_here
   ```
   *(Note: You can also enter the key directly in the live web app using the top-right settings button!)*

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build & Start:**
   ```bash
   npm run build
   npm start
   ```

---

## ☁️ Deploy Free of Cost on Vercel

### Option A: 1-Click Deployment via GitHub (Recommended)
1. Push this repository to your GitHub account:
   ```bash
   git remote add origin https://github.com/<your-username>/bano-qabil-ai-exam.git
   git push -u origin master
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. (Optional) Add your `GROQ_API_KEY` under **Environment Variables**.
5. Click **"Deploy"**. Your live platform will be ready in under 60 seconds with free SSL!

### Option B: Deploy via Vercel CLI
1. Log in to Vercel in your terminal:
   ```bash
   npx vercel login
   ```
2. Deploy to production:
   ```bash
   npx vercel --prod
   ```

---

## 🧪 Verification & Automated Test Suite
Run the automated test suite anytime to verify all endpoints:
```bash
python ../../C:/Users/pc/.gemini/antigravity/brain/3b6ef673-c4f4-4081-bd13-ef60619a16f1/scratch/test_api.py
```
**Test Coverage:**
- `GET /api/submissions`: Verifies real-time submission retrieval.
- `POST /api/evaluate`: Verifies full 100-mark paper evaluation, MCQ verification, and rubric calculation.
- Database Persistence: Verifies submitted papers are recorded and queryable.
- `GET /api/submissions/export`: Verifies full RFC 4180 CSV Marksheet generation and download.
