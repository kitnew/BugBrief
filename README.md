# BugBrief

BugBrief is an AI-powered cloud web application for creating and managing structured software bug reports. The main purpose of the project is to transform short, unstructured or incomplete bug descriptions into clear QA reports with severity, category, reproduction steps, expected result, actual result, technical notes and a suggested fix.

The application is designed as a multi-service cloud solution consisting of a frontend, backend API, database and an external AI service. The main application infrastructure is planned on AWS, while the AI functionality is provided by Microsoft Azure. This separation satisfies the assignment requirement to use cloud services from more than one provider.

## Project goal

The goal of BugBrief is to simplify the process of reporting software bugs. Instead of manually writing a complete QA report, the user enters a raw bug description, for example:

```text
When I click login, the page refreshes but nothing happens.
Console says: 401 Unauthorized.
Expected: user should be redirected to dashboard.
```

The backend forwards this text to an AI service, which generates a structured bug report:

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

The generated report is displayed in the frontend and can be saved in the database for authenticated users.

## Cloud architecture

```text
User
  |
  v
AWS Amplify Hosting
Frontend: React + Vite + TypeScript
  |
  | REST API over HTTPS
  v
AWS Elastic Beanstalk / AWS App Runner
Backend: REST API, authentication, business logic
  |
  | SQL connection
  v
Amazon RDS for PostgreSQL
Persistent storage for users and bug reports
  |
  | AI request from backend
  v
Microsoft Azure OpenAI Service
Structured bug report generation
```

## Used cloud services

| System part | Cloud service | Provider | Purpose |
|---|---|---|---|
| Frontend | AWS Amplify Hosting | AWS | Hosting the React/Vite frontend application |
| Backend | AWS Elastic Beanstalk / AWS App Runner | AWS | Hosting the REST API and application logic |
| Database | Amazon RDS for PostgreSQL | AWS | Persistent storage for users and bug reports |
| AI service | Azure OpenAI Service | Microsoft Azure | AI generation of structured bug reports |

## Why this architecture was selected

The frontend is hosted on AWS Amplify Hosting because it is suitable for modern static frontend applications built with React and Vite. It supports deployment directly from GitHub and allows environment variables to be configured for the deployed application.

The backend is planned for AWS Elastic Beanstalk or AWS App Runner because both services allow deployment of a REST API without manually managing virtual machines. The backend is responsible for authentication, communication with the database, validation of incoming data and communication with the AI service.

Amazon RDS for PostgreSQL is used as a managed relational database. It stores user accounts, original bug descriptions, generated report fields, report status and timestamps. The database is not accessed directly by the frontend; only the backend communicates with it.

Azure OpenAI Service is used for the AI part of the project. It is intentionally placed on a different cloud provider than the main application infrastructure. The backend sends raw bug descriptions to Azure OpenAI and receives structured JSON responses.

## Main features

- create a bug report from an unstructured text description;
- generate title, severity, category and reproduction steps;
- display generated reports in the frontend;
- support authenticated and guest users;
- store authenticated user reports in the database;
- keep guest-generated reports temporarily in browser session storage;
- manage report status: `open`, `in progress`, `resolved`;
- support report severity: `Low`, `Medium`, `High`, `Critical`;
- provide dashboard and report list views;
- use token-based authentication for protected API requests.

## Technology stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS / CSS styling

### Backend

Expected backend responsibilities:

- REST API for reports and authentication;
- JWT-based authentication;
- validation of user input;
- communication with PostgreSQL;
- communication with Azure OpenAI;
- returning structured JSON responses to the frontend.

### Database

- PostgreSQL
- hosted as Amazon RDS for PostgreSQL
- used for persistent storage of users and generated bug reports

### AI service

- Azure OpenAI Service
- called only from backend
- API key stored only in backend environment variables
- response validated before saving into the database

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

## Frontend and backend communication

The frontend communicates with the backend through REST API requests. The backend URL is provided through the frontend environment variable:

```env
VITE_API_BASE_URL=https://your-backend-cloud-url
```

In the deployed cloud version, this value must point to the public HTTPS URL of the backend service deployed on AWS.

## Reports API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/reports/analyze` | Generate a structured bug report from raw input |
| `GET` | `/api/reports` | Get all saved reports of the authenticated user |
| `GET` | `/api/reports/:id` | Get detail of one report |
| `PATCH` | `/api/reports/:id/status` | Update report status |
| `DELETE` | `/api/reports/:id` | Delete report |

## Authentication API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in and receive an authentication token |
| `GET` | `/api/auth/me` | Get the currently authenticated user |

The authentication token is stored in the browser and added to API requests as:

```text
Authorization: Bearer <token>
```

## Example API request

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

## Example API response

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

## Database model

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

## AI integration

The AI service receives a raw bug description and returns a structured JSON object. The backend should use a strict prompt and validate the AI output before saving it.

Recommended AI prompt:

```text
You are a software QA assistant. Convert the user's unstructured bug description into a structured bug report.

Return only valid JSON with the following fields:
title, severity, category, stepsToReproduce, expectedResult, actualResult, technicalNotes, suggestedFix.

Severity must be one of: Low, Medium, High, Critical.
```

The backend should reject or repair invalid AI responses. It should also prevent empty or unrelated user input from being processed as a valid bug report.

## Cloud deployment documentation

### Frontend deployment: AWS Amplify Hosting

The frontend is deployed as a static React/Vite application.

Required Amplify configuration:

| Setting | Value |
|---|---|
| Repository | `kitnew/BugBrief` |
| App root | `frontend` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variable | `VITE_API_BASE_URL=https://your-backend-cloud-url` |

Expected deployment result:

```text
User opens AWS Amplify URL -> React frontend loads -> frontend sends HTTPS requests to backend API
```

### Backend deployment: AWS Elastic Beanstalk / AWS App Runner

The backend is deployed as a cloud REST API service. It must expose the report and authentication endpoints required by the frontend.

Required backend environment variables:

| Variable | Purpose |
|---|---|
| `PORT` | Port used by the backend service |
| `DATABASE_URL` | Connection string to Amazon RDS PostgreSQL |
| `JWT_SECRET` | Secret key for signing authentication tokens |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI API endpoint |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key |
| `AZURE_OPENAI_DEPLOYMENT` | Azure OpenAI model deployment name |

The backend must also configure CORS so that only the deployed frontend domain can access the API in production.

### Database deployment: Amazon RDS for PostgreSQL

The database is deployed as a managed PostgreSQL instance in AWS.

Recommended database rules:

- database is not directly accessible from the frontend;
- only the backend service can connect to the database;
- credentials are stored in backend environment variables;
- generated reports and user accounts are stored persistently;
- database backups can be enabled through RDS settings.

### AI deployment: Azure OpenAI Service

Azure OpenAI is used as an external AI service from a different cloud provider.

The backend sends requests to Azure OpenAI and receives structured bug report data. The Azure API key is never exposed to the frontend.

Expected AI flow:

```text
Frontend submits raw bug description
  -> Backend validates input
  -> Backend sends prompt to Azure OpenAI
  -> Azure OpenAI returns JSON
  -> Backend validates JSON
  -> Backend saves report to PostgreSQL
  -> Frontend displays generated report
```

## Security considerations

- API keys must be stored only in cloud environment variables.
- Azure OpenAI keys must never be exposed in frontend code.
- Database credentials must not be committed to GitHub.
- Passwords must be stored as hashes.
- JWT tokens must be signed with a strong secret.
- CORS should be restricted to the deployed frontend domain.
- The database should only accept connections from the backend service.
- HTTPS should be used for communication between frontend and backend.

## Assignment requirements coverage

| Requirement | Implementation in BugBrief |
|---|---|
| Frontend service | React/Vite frontend deployed on AWS Amplify Hosting |
| Backend service | REST API deployed on AWS Elastic Beanstalk or AWS App Runner |
| Database service | PostgreSQL database deployed on Amazon RDS |
| Cloud deployment | Application is designed for PaaS/managed cloud services |
| External cloud service | Azure OpenAI Service from Microsoft Azure |
| API communication | Frontend communicates with backend through REST API |
| Persistent data | Bug reports and users are stored in PostgreSQL |
| AI functionality | AI generates structured bug reports from raw text |

## Team roles

| Member | Area | Responsibilities |
|---|---|---|
| Nikita Chernysh | Frontend / UI | React interface, layout, forms, user interaction |
| Yaroslav Tsaryk | Backend / Database | REST API, authentication, PostgreSQL integration |
| Vladyslav Rudion | Frontend / Documentation / Integration | API connection, documentation, cloud architecture description, integration support |

## Demonstration scenario

1. User opens the deployed frontend application.
2. User signs in or continues as guest.
3. User enters project name, environment and raw bug description.
4. Frontend sends the data to the backend API.
5. Backend sends the description to Azure OpenAI.
6. AI returns a structured bug report.
7. Backend validates the response and saves it to PostgreSQL if required.
8. Frontend displays the generated report to the user.
9. User can view reports, check severity and update report status.

## Authors

Developed by:

- Nikita Chernysh
- Yaroslav Tsaryk
- Vladyslav Rudion
