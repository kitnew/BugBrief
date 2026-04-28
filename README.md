# BugBrief

BugBrief is an AI-powered web application for creating and managing structured software bug reports. The goal of the project is to help users turn short, messy or incomplete bug descriptions into clear QA reports containing severity, category, reproduction steps, expected result, actual result, technical notes and a suggested fix.

The project is developed as a cloud application with a frontend, backend API, database and an external AI service.

## Main idea

A user enters an unstructured bug description, for example:

```text
When I click login, the page refreshes but nothing happens.
Console says: 401 Unauthorized.
Expected: user should be redirected to dashboard.
```

The backend sends this input to an AI service and receives a structured bug report:

```json
{
  "title": "Login fails with 401 Unauthorized",
  "severity": "High",
  "category": "Authentication",
  "stepsToReproduce": [
    "Open the login page",
    "Enter valid credentials",
    "Click the login button"
  ],
  "expectedResult": "User is redirected to the dashboard",
  "actualResult": "Page refreshes and the user remains on the login page",
  "technicalNotes": "Console shows 401 Unauthorized",
  "suggestedFix": "Check authentication token handling and backend login endpoint"
}
```

The generated report can then be displayed in the frontend and, for authenticated users, saved in the database.

## Features

Current frontend functionality:

- landing page with project description;
- bug report creation form;
- project name, environment and raw bug description inputs;
- connection to backend API through Axios;
- report list and dashboard views;
- sign in / registration modal;
- token-based authentication support in API requests;
- local session storage for guest-generated reports;
- report status support: `open`, `in progress`, `resolved`;
- report severity support: `Low`, `Medium`, `High`, `Critical`.

Planned / backend-related functionality:

- AI-based generation of structured bug reports;
- storing reports in PostgreSQL;
- authenticated user reports;
- updating report status;
- deleting reports;
- cloud deployment of frontend, backend and database.

## Technology stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS / CSS styling

### Backend

The frontend is prepared to communicate with a REST API. The expected backend API base URL is configured through the `VITE_API_BASE_URL` environment variable. If the variable is not set, the frontend uses:

```text
http://localhost:3000
```

Expected backend technologies:

- Node.js / Express or equivalent REST API backend;
- PostgreSQL database;
- JWT-based authentication;
- Azure OpenAI or another AI service for report generation.

### Cloud architecture

Target cloud architecture for the full project:

| Part | Service | Provider | Purpose |
|---|---|---|---|
| Frontend | AWS Amplify Hosting | AWS | Hosting the React/Vite application |
| Backend | AWS Elastic Beanstalk / AWS App Runner | AWS | Hosting the REST API |
| Database | Amazon RDS for PostgreSQL | AWS | Persistent report storage |
| AI service | Azure OpenAI Service | Microsoft Azure | Generating structured bug reports |

This architecture satisfies the requirement that the main application and database are hosted on one cloud provider while the AI functionality uses a service from a different provider.

## Project structure

```text
BugBrief/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── authApi.ts
│   │   │   └── reportsApi.ts
│   │   ├── components/
│   │   ├── App.tsx
│   │   ├── AuthContext.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── package.json
└── README.md
```

## Frontend API communication

The frontend uses two API modules:

### Reports API

Base URL:

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'
```

Main endpoints expected by the frontend:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/reports/analyze` | Generate a structured bug report from raw input |
| `GET` | `/api/reports` | Get all saved reports |
| `GET` | `/api/reports/:id` | Get one report by ID |
| `PATCH` | `/api/reports/:id/status` | Update report status |
| `DELETE` | `/api/reports/:id` | Delete report |

### Auth API

Base URL:

```text
/api/auth
```

Expected endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in and receive a token |
| `GET` | `/api/auth/me` | Get current authenticated user |

The authentication token is stored in `localStorage` and automatically added to API requests as:

```text
Authorization: Bearer <token>
```

## Data model

Recommended PostgreSQL table for bug reports:

```sql
CREATE TABLE bug_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    project_name VARCHAR(255),
    environment TEXT,
    raw_description TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    steps_to_reproduce JSONB,
    expected_result TEXT,
    actual_result TEXT,
    technical_notes TEXT,
    suggested_fix TEXT,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Recommended user table:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## How to run locally

### 1. Clone repository

```bash
git clone https://github.com/kitnew/BugBrief.git
cd BugBrief
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Use the deployed backend URL instead of localhost when running against a cloud backend.

### 4. Start frontend

```bash
npm run dev
```

The application will be available at the URL printed by Vite, usually:

```text
http://localhost:5173
```

### 5. Build frontend

```bash
npm run build
```

### 6. Preview production build

```bash
npm run preview
```

## Environment variables

### Frontend

| Variable | Example | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3000` | Backend API base URL |

### Backend

Recommended backend variables:

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for authentication tokens |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key |
| `AZURE_OPENAI_DEPLOYMENT` | Azure model deployment name |

Do not commit real API keys or database passwords to GitHub.

## Example request

```http
POST /api/reports/analyze
Content-Type: application/json
Authorization: Bearer <token>
```

```json
{
  "projectName": "Student Portal",
  "environment": "Chrome, Windows, production",
  "rawDescription": "When I click login, the page refreshes but nothing happens. Console shows 401 Unauthorized.",
  "saveToDb": true
}
```

Expected response:

```json
{
  "id": 1,
  "projectName": "Student Portal",
  "title": "Login fails with 401 Unauthorized",
  "severity": "High",
  "category": "Authentication",
  "stepsToReproduce": [
    "Open the login page",
    "Enter valid credentials",
    "Click the login button"
  ],
  "expectedResult": "User is redirected to the dashboard",
  "actualResult": "The page refreshes and the user remains on the login page",
  "technicalNotes": "Console shows 401 Unauthorized",
  "suggestedFix": "Check authentication token handling and backend login endpoint",
  "status": "open",
  "createdAt": "2026-04-28T12:00:00.000Z"
}
```

## AI integration

The AI service should receive the raw bug description and return only valid JSON. A recommended prompt structure is:

```text
You are a software QA assistant. Convert the user's unstructured bug description into a structured bug report.

Return only valid JSON with the following fields:
title, severity, category, stepsToReproduce, expectedResult, actualResult, technicalNotes, suggestedFix.

Severity must be one of: Low, Medium, High, Critical.
```

The backend should validate the AI response before saving it to the database. If the AI returns invalid JSON, the backend should return a clear error or use a fallback response.

## Deployment plan

### Frontend deployment

Recommended service: AWS Amplify Hosting.

Basic steps:

1. Connect the GitHub repository to AWS Amplify.
2. Select the `frontend` directory as the application root.
3. Set build command:

```bash
npm run build
```

4. Set output directory:

```text
dist
```

5. Add environment variable:

```env
VITE_API_BASE_URL=https://your-backend-url
```

### Backend deployment

Recommended service: AWS Elastic Beanstalk or AWS App Runner.

Backend must expose the REST API endpoints required by the frontend and must allow CORS requests from the deployed frontend domain.

### Database deployment

Recommended service: Amazon RDS for PostgreSQL.

The database should not be publicly used by the frontend. Only the backend should communicate with the database.

### AI deployment

Recommended service: Azure OpenAI Service.

The backend communicates with Azure OpenAI through REST API. The Azure API key must be stored only as a backend environment variable.

## Team roles

| Member | Area | Responsibilities |
|---|---|---|
| Nikita Chernysh | Frontend / UI | React interface, forms, visual layout, user interaction |
| Yaroslav Tsaryk | Backend / Database | REST API, authentication, PostgreSQL integration |
| Vladyslav Rudion | Frontend / Documentation / Integration | Frontend API connection, documentation, project structure, integration support |

## Security notes

- API keys must be stored in environment variables.
- Passwords must be stored as hashes, not plain text.
- The database should only be accessible from the backend.
- CORS should allow only trusted frontend domains in production.
- JWT secrets must not be committed to the repository.
- `.env` files should remain ignored by Git.

## Development notes

Useful frontend commands:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Recommended Git workflow:

```bash
git checkout main
git pull origin main
git checkout -b feature/name-of-feature
# make changes
git add .
git commit -m "feat: describe change"
git push origin feature/name-of-feature
```

Then open a pull request into `main`.

## Authors

Developed by:

- Nikita Chernysh
- Yaroslav Tsaryk
- Vladyslav Rudion
