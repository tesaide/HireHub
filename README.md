# HireHub — Job Board API

Node.js + Express + PostgreSQL + Vue 3 + WebSocket

## Стек. 

| Шар | Технологія |
|---|---|
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + node-postgres |
| Auth | JWT + bcrypt |
| RealTime | Socket.io |
| Frontend | Vue 3 + Pinia + Vue Router + Axios |
| DevOps | Docker + docker-compose |
| Validation | Zod |

## Швидкий старт

### Варіант 1: Docker

```bash
# Скопіювати .env
cp backend/.env.example backend/.env

# Запустити все
docker-compose up --build

# Backend: http://localhost:3000
# Frontend: http://localhost:5173
```

### Варіант 2: Локально (для розробки)

```bash
# 1. Запустити тільки БД
docker-compose up postgres -d

# 2. Backend
cd backend
cp .env.example .env
npm install
npm run dev

# 3. Frontend (в іншому терміналі)
cd frontend
npm install
npm run dev
```

## Структура проекту

```
hirehub/
├── backend/
│   └── src/
│       ├── config.ts          # Env змінні (День 8)
│       ├── index.ts           # Точка входу + WebSocket (День 9, 14)
│       ├── types/             # TypeScript інтерфейси (День 6)
│       ├── db/                # PostgreSQL клієнт + схема (День 11)
│       ├── middleware/        # auth, errorHandler (День 9, 13)
│       ├── routes/            # Express роути (День 9)
│       ├── controllers/       # Обробка req/res (День 10)
│       └── services/          # Бізнес-логіка + SQL (День 11-12)
│
└── frontend/
    └── src/
        ├── api/               # Axios instance + методи (День 16)
        ├── stores/            # Pinia stores (День 16)
        ├── router/            # Vue Router + guards (День 16)
        ├── composables/       # useSocket (День 14)
        └── pages/             # Vue сторінки
```

## API Endpoints

### Auth
```
POST /api/auth/register   { name, email, password, role }
POST /api/auth/login      { email, password }
GET  /api/auth/me         🔒 token required
```

### Jobs
```
GET    /api/jobs           ?city=Kyiv&category=Backend&minSalary=1000
GET    /api/jobs/:id
POST   /api/jobs           🔒 employer only
PUT    /api/jobs/:id       🔒 employer only
DELETE /api/jobs/:id       🔒 employer only
```

### Applications
```
POST   /api/applications            🔒 seeker only
GET    /api/applications/my         🔒 seeker only
GET    /api/applications/job/:id    🔒 employer only
PATCH  /api/applications/:id/status 🔒 employer only
```

## Тестові акаунти 

| Email | Пароль | Роль |
|---|---|---| 
| alpha@corp.com | password123 | employer |
| beta@studio.com | password123 | employer |
| ivan@gmail.com | password123 | seeker |
| olena@gmail.com | password123 | seeker |




