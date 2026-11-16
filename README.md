<div align="center">

  <table align="center" border="0" style="border: none; background: transparent;">
    <tr>
      <td align="center" valign="middle" style="border: none; padding: 20px;">
        <img src="public/bano-qabil.png" alt="Bano Qabil Official Logo" width="140" />
      </td>
      <td align="center" valign="middle" style="border: none; padding: 20px;">
        <img src="public/hafiz.png" alt="Hafiz Naeem ur Rehman - Patron-in-Chief" width="140" style="border-radius: 50%; border: 3px solid #015b30;" />
      </td>
    </tr>
  </table>

  # BANO QABIL 2.0
  ## Directorate of Education and Artificial Intelligence Training
  ### Essentials of AI — Midterm Examination Platform

  <p align="center">
    <strong>Patron-in-Chief: Hafiz Naeem ur Rehman</strong><br />
    <em>Empowering the Youth of Pakistan through Free, High-Impact AI Education</em>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Platform-Next.js%2016-015b30?style=flat-square" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/Language-TypeScript-008b74?style=flat-square" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-7cb342?style=flat-square" alt="Tailwind CSS v4" />
    <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Inference-Groq%20Cloud-F05A28?style=flat-square" alt="Groq Cloud" />
    <img src="https://img.shields.io/badge/Deployment-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
    <img src="https://img.shields.io/badge/Examiner-io%40maziz.me-015b30?style=flat-square" alt="Examiner" />
  </p>

</div>

---

## Executive Summary

The **Bano Qabil AI Midterm Examination Platform** is an enterprise-grade academic assessment system engineered for students undertaking the nationwide "Essentials of AI" curriculum (Weeks 1 through 6).

The platform pairs rigorous academic evaluation with cutting-edge web infrastructure, featuring real-time bilingual switching between English (Book Antiqua typography) and authentic Urdu (Noto Nastaliq script with complete RTL orientation), automated evaluation via Groq Cloud LLM acceleration (`llama-3.3-70b-versatile`), a zero-latency deterministic rubric fallback engine, persistent cloud storage via Supabase, single-attempt examination locking, and an official A4 printable certificate marksheet.

---

## Institutional Leadership and Patronage

Under the vision and leadership of **Hafiz Naeem ur Rehman**, the Bano Qabil initiative has expanded across Pakistan to deliver fully funded, merit-based vocational training in modern software engineering, data science, and applied artificial intelligence.

This platform exemplifies that vision by upholding strict examination integrity, transparent evaluation rubrics, and high-standard educational reporting for thousands of young candidates.

---

## Core System Architecture

```
[ Candidate Browser ]
        │
        ├── Bilingual Interface (English Book Antiqua / Urdu Noto Nastaliq)
        ├── Dynamic Local Storage Backup (Zero Progress Loss)
        └── Single Attempt State Locking
        │
        ▼ (HTTPS POST /api/evaluate)
[ Next.js Serverless Edge Runtime ]
        │
        ├── 1. Verification of Prior Submissions (Roll Number / Email)
        ├── 2. Deterministic Objective Scoring (Section A MCQs)
        ├── 3. Instant Heuristic Rubric Scoring (Sections B, C, D)
        │
        ├── 4. PRE-SAVE PERSISTENCE (Guaranteed Zero-Data-Loss)
        │       └── Supabase Cloud Database (student_submissions table)
        │
        ├── 5. Groq Cloud AI Inference (Strict 3.5s Timeout Bounded)
        │       ├── llama-3.3-70b-versatile
        │       └── llama-3.1-8b-instant
        │
        └── 6. Dynamic Result Hydration and Re-Upsert to Supabase
```

---

## Key Platform Capabilities

### 1. Bilingual Localization (English and Urdu Nastaliq)
- **One-Click Instant Toggle:** A dedicated navbar switcher seamlessly alternates the application between standard English and Urdu.
- **Authentic Noto Nastaliq Typography:** Full RTL rendering with calibrated line-height to ensure diacritics, nuqtas, and ligatures display with typographical elegance.
- **Full Curriculum Translation:** All 20 Section A MCQs, Section B short questions, Section C scenarios, Section D practical milestones, instructions, and error notifications are authentically translated.
- **State Preservation:** Toggling between languages mid-examination preserves every single typed answer and selected option without data loss.

### 2. Zero-Data-Loss Architecture (Supabase First)
- **Pre-Execution Save:** Upon clicking final submission, the student's personal details, timestamps, and every single answer are committed to Supabase before any external AI network calls are made.
- **Groq Resilience:** If Groq Cloud is offline, unconfigured, or experiencing latency, the server transparently uses the built-in deterministic marking engine. The paper is already safely archived in Supabase, and the candidate receives their verified scorecard instantly with zero HTTP 500 errors.
- **Client Auto-Save:** Draft progress is backed up locally during the exam, protecting against accidental browser refreshes, disconnects, or power failures.

### 3. Strict Single Attempt Policy
- **Examination Locking:** Once submitted, a candidate's paper is permanently finalized. Re-taking the exam is strictly prohibited under institutional regulations.
- **Multi-Layer Validation:** Duplicate attempts are blocked at both client level (local submission lock) and database level (`/api/submissions/check` queries Supabase by Roll Number and Email).
- **Session Restoration:** Returning students are presented with their official locked scorecard directly.

### 4. Official Printable Marksheet (A4 Format)
- **High-Fidelity Print Engine:** Calibrated specifically for standard A4 portrait output with `-webkit-print-color-adjust: exact` enabled.
- **Distraction-Free Output:** Automatically strips screen-only elements (navigation bars, timers, interactive tabs, action buttons) during print or PDF export.
- **Comprehensive Academic Transcript:** Displays official institutional crests, student demographics, section-by-section breakdown, score percentages, evaluator qualitative feedback, verification reference codes, and signature lines for candidate and Controller of Examinations.

### 5. Role-Protected Examiner Dashboard (`io@maziz.me`)
- **Master Class Analytics:** Live aggregation of total submissions, class score average, top score, lowest score, and pass rate.
- **Paper Auditing:** Full inspection of student submissions, raw answers, and question-level scoring rationale.
- **CSV Data Export:** One-click generation of RFC-4180 compliant CSV marksheets for external administrative processing.
- **Cryptographic Session Guard:** Access restricted strictly to authorized examiner identity (`io@maziz.me`).

---

## Examination Structure and Syllabus Breakdown

Total Duration: **80 Minutes (1 Hour 20 Minutes)**  
Total Assessment Weightage: **100 Marks**

| Section | Domain | Format | Questions | Maximum Marks |
| :--- | :--- | :--- | :--- | :---: |
| **Section A** | Core AI Foundations | Multiple Choice Questions | 20 Objective Questions | 20 Marks |
| **Section B** | Conceptual Analysis | Short Answer Questions | 2 Questions (Sub-parts) | 10 Marks |
| **Section C** | Real-World Application | Long Scenario Analysis | 1 Multi-Part Question | 20 Marks |
| **Section D** | Practical Project | "The Smart Canteen AI" | 5 Milestone Deliverables | 50 Marks |
| **TOTAL** | **Cumulative Assessment** | **Full Midterm Examination** | **Complete Paper** | **100 Marks** |

### Section-Level Details

#### Section A: Objective Foundations (20 Marks)
- Narrow AI (ANI) versus Artificial General Intelligence (AGI)
- Supervised versus Unsupervised Learning mechanics
- Overfitting causes, remedies, and the four pillars of quality training data
- Computer Vision: Classification, bounding boxes, segmentation, and camera angles
- Voice Assistant pipelines: Speech-to-Text (STT), Large Language Models (LLM), Text-to-Speech (TTS)
- Natural Language Processing: Sarcasm detection, cultural slang, and Roman Urdu challenges
- Data privacy, personally identifiable information (PII), and medical false alarms versus misses

#### Section B: Short Conceptual Questions (10 Marks)
- **Question 1 (5 Marks):** Supervised learning (labels as solved past papers) versus unsupervised learning (unlabeled automatic clustering). Application to Pakistani platforms (Easypaisa transaction fraud filters and Daraz buyer segment clustering).
- **Question 2 (5 Marks):** Root causes of model overfitting ("ratta") and the four Urdu/English pillars of quality data: Enough (*Kaafi*), Balanced (*Mutawazin*), Varied (*Mutanawwo*), and Correct (*Durust*).

#### Section C: Comprehensive Scenario (20 Marks)
- **Part A (6 Marks):** Technical breakdown of voice assistants (Ears = STT, Brain = LLM, Mouth = TTS) and failure propagation under noisy Karachi traffic conditions.
- **Part B (6 Marks):** NLP failure modes in Roman Urdu sarcasm (*"Shukriya"* masking criticism) and cricket slang (*"aag"*, *"tabahi"*, *"sick"* misinterpreted as negative sentiment).
- **Part C (8 Marks):** Stranger testing vulnerability in computer vision models and medical ethics of an automated tuberculosis screening tool (impact of False Alarms versus Misses).

#### Section D: Practical AI Project — "The Smart Canteen" (50 Marks)
- **Milestone 1 (10 Marks):** Teachable machine class definitions (Roll, Samosa, Empty Counter), multi-angle variation planning, and privacy-preserving camera framing.
- **Milestone 2 (10 Marks):** Tabular schema design with five validated columns and stripping of customer phone numbers/names to protect privacy.
- **Milestone 3 (10 Marks):** Spreadsheet anomaly cleaning (case normalization, missing quantity indicators, currency string stripping, test row elimination, and out-of-bounds rating handling).
- **Milestone 4 (10 Marks):** Conversational chatbot engineering (4-part prompt recipe: Persona, Task, Context, Format constraints in polite Roman Urdu) and allergy emergency escalation safety.
- **Milestone 5 (10 Marks):** Accuracy metric calculations ($17 / 20 = 85\%$), business decision insights based on sales figures, and technical Model Card documentation.

---

## Database Schema (Supabase)

The platform operates on a single high-performance PostgreSQL table managed through Supabase:

```sql
create table if not exists student_submissions (
  id text primary key,
  student_name text not null,
  student_email text not null,
  roll_number text not null,
  section text not null,
  student_raw jsonb not null,
  answers jsonb,
  section_scores jsonb,
  total_score numeric default 0,
  percentage numeric default 0,
  grade text,
  evaluated_by text,
  model_used text,
  mcq_results jsonb,
  subjective_feedback jsonb,
  general_feedback jsonb,
  time_spent_seconds integer default 0,
  submitted_at text,
  created_at timestamptz default now()
);

create index if not exists idx_student_submissions_email on student_submissions(student_email);
create index if not exists idx_student_submissions_roll on student_submissions(roll_number);
create index if not exists idx_student_submissions_score on student_submissions(total_score desc);
create index if not exists idx_student_submissions_created on student_submissions(created_at desc);
```

---

## Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Groq Cloud API Credentials (Server-side evaluation)
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Supabase Cloud Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Examiner Security Access (io@maziz.me)
EXAMINER_PASSCODE=your_secure_examiner_passcode
```

---

## Local Development and Deployment

### 1. Prerequisites
- Node.js version 18.18 or higher (Node.js 20+ recommended)
- npm version 9 or higher
- Git version control

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/engrmaziz/bqpaper.git

# Navigate into the project folder
cd bqpaper

# Install project dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Production Build Verification
```bash
npm run build
npm run start
```

### 5. Vercel Deployment
The repository is directly integrated with Vercel for continuous deployment:
1. Connect repository `engrmaziz/bqpaper` on [Vercel](https://vercel.com).
2. Configure environment variables (`GROQ_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `EXAMINER_PASSCODE`).
3. Deploy. Every push to the `main` branch automatically triggers production redeployment.

---

## Technical Specifications

- **Application Framework:** Next.js 16.4 (Turbopack engine, App Router architecture)
- **Frontend Core:** React 19, TypeScript
- **Styling Architecture:** Tailwind CSS v4, Custom CSS Print Directives
- **Vector Icons:** Lucide React
- **Cloud Database:** Supabase (PostgreSQL with Row Level Security)
- **AI Acceleration:** Groq Cloud OpenAI-compatible Chat Completions API
- **Typography:**
  - Latin: Book Antiqua, Palatino, Georgia, serif
  - Arabic / Urdu: Noto Nastaliq Urdu, Jameel Noori Nastaleeq, serif
- **Commit Authorship:** Strictly locked to `engrmaziz <io@maziz.me>`

---

## Institutional License and Copyright

Copyright 2026 Alkhidmat Bano Qabil Pakistan. All Rights Reserved.  
Course Materials: Essentials of AI  
Technical Architecture and Assessment Platform maintained by Controller of Examinations (`io@maziz.me`).
