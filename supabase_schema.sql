-- =========================================================================
-- Bano Qabil AI Exam Platform — Supabase Database Schema
-- Run this script in your Supabase SQL Editor (SQL Editor -> New Query -> Run)
-- =========================================================================

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

-- Fast Indexing for searches & teacher reports
create index if not exists idx_student_submissions_email on student_submissions(student_email);
create index if not exists idx_student_submissions_roll on student_submissions(roll_number);
create index if not exists idx_student_submissions_score on student_submissions(total_score desc);
create index if not exists idx_student_submissions_created on student_submissions(created_at desc);

-- Row Level Security (RLS) Configuration
alter table student_submissions enable row level security;

-- Policies allowing the platform backend to save and query student submissions
drop policy if exists "Allow backend inserts" on student_submissions;
create policy "Allow backend inserts" on student_submissions for insert with check (true);

drop policy if exists "Allow backend updates" on student_submissions;
create policy "Allow backend updates" on student_submissions for update using (true);

drop policy if exists "Allow backend reads" on student_submissions;
create policy "Allow backend reads" on student_submissions for select using (true);

