-- HireHub Database Schema
-- TODO День 11: виконати через psql або docker exec

CREATE TABLE IF NOT EXISTS users (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role         VARCHAR(10) NOT NULL CHECK (role IN ('employer', 'seeker')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  description  TEXT NOT NULL,
  salary_min   INTEGER NOT NULL,
  salary_max   INTEGER NOT NULL,
  city         VARCHAR(100) NOT NULL,
  category     VARCHAR(100) NOT NULL,
  employer_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id           SERIAL PRIMARY KEY,
  job_id       INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  seeker_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cover_letter TEXT NOT NULL,
  status       VARCHAR(20) NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'reviewed', 'rejected', 'accepted')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, seeker_id)
);

-- Індекси (День 12)
CREATE INDEX IF NOT EXISTS idx_jobs_city       ON jobs(city);
CREATE INDEX IF NOT EXISTS idx_jobs_category   ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_salary_min ON jobs(salary_min);
CREATE INDEX IF NOT EXISTS idx_jobs_employer   ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_apps_job        ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_apps_seeker     ON applications(seeker_id);
