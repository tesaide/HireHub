-- Seed data — паролі всі: "password123"
-- bcrypt hash для "password123" з salt=10

INSERT INTO users (name, email, password_hash, role) VALUES
  ('Alpha Corp',    'alpha@corp.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh2.', 'employer'),
  ('Beta Studio',   'beta@studio.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh2.', 'employer'),
  ('Ivan Petrenko', 'ivan@gmail.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh2.', 'seeker'),
  ('Olena Koval',   'olena@gmail.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh2.', 'seeker'),
  ('Max Bondar',    'max@gmail.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh2.', 'seeker')
ON CONFLICT DO NOTHING;

INSERT INTO jobs (title, description, salary_min, salary_max, city, category, employer_id) VALUES
  ('Node.js Developer',    'Розробка REST API на Express та NestJS', 2000, 3500, 'Kyiv',   'Backend',  1),
  ('Vue.js Developer',     'Розробка SPA на Vue 3 з TypeScript',     1800, 3000, 'Lviv',   'Frontend', 1),
  ('Full-Stack Developer', 'Node.js + React, стартап команда',        2500, 4000, 'Remote', 'Fullstack',1),
  ('Python Developer',     'Data pipeline та автоматизація',          1500, 2800, 'Kyiv',   'Backend',  2),
  ('DevOps Engineer',      'Docker, Kubernetes, CI/CD налаштування',  3000, 5000, 'Remote', 'DevOps',   2),
  ('QA Engineer',          'Ручне та автоматизоване тестування',       1200, 2200, 'Kharkiv','QA',       2),
  ('React Developer',      'Front-end для фінтех продукту',           2200, 3800, 'Kyiv',   'Frontend', 1),
  ('TypeScript Developer', 'Підтримка та розвиток корпоративного ПЗ', 2000, 3500, 'Remote', 'Backend',  2)
ON CONFLICT DO NOTHING;
