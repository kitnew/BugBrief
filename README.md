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

The backend forwards this text to an AI service, which generates a structured bug report.

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
AWS Backend Service
REST API, authentication, business logic
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
| Backend | AWS service + API Gateway endpoint | AWS | Hosting the REST API and application logic |
| Database | Amazon RDS for PostgreSQL | AWS | Persistent storage for users and bug reports |
| AI service | Azure OpenAI Service | Microsoft Azure | AI generation of structured bug reports |

## Production frontend configuration

The deployed frontend communicates with the backend through the following API URL:

```env
VITE_API_BASE_URL=https://pj9b0lp0ul.execute-api.eu-north-1.amazonaws.com/
```

This endpoint is used for cloud communication between the frontend and backend services.

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
- REST API
- Authentication
- Database communication
- AI integration
- JSON validation

### Database
- PostgreSQL
- Amazon RDS

### AI service
- Azure OpenAI Service
- Secure backend-only integration

## Project structure

```text
BugBrief/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── App.tsx
│   │   ├── AuthContext.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── package.json
└── README.md
```

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/reports/analyze` | Generate structured bug report |
| `GET` | `/api/reports` | Get reports |
| `GET` | `/api/reports/:id` | Get one report |
| `PATCH` | `/api/reports/:id/status` | Update report status |
| `DELETE` | `/api/reports/:id` | Delete report |
| `POST` | `/api/auth/register` | Register user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/auth/me` | Current user |

## Cloud deployment documentation

### Frontend deployment

Hosted on AWS Amplify Hosting with repository integration and automatic builds.

| Setting | Value |
|---|---|
| Repository | `kitnew/BugBrief` |
| App root | `frontend` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variable | `VITE_API_BASE_URL=https://pj9b0lp0ul.execute-api.eu-north-1.amazonaws.com/` |

### Backend deployment

The backend is deployed on AWS and exposed through a public API Gateway endpoint:

```text
https://pj9b0lp0ul.execute-api.eu-north-1.amazonaws.com/
```

The backend handles:

- authentication;
- report processing;
- communication with PostgreSQL;
- communication with Azure OpenAI;
- secure responses to frontend requests.

### Database deployment

Amazon RDS for PostgreSQL is used for persistent storage.

Rules:
- database is not directly accessible from frontend;
- only backend communicates with database;
- credentials stored securely in environment variables.

### AI deployment

Azure OpenAI Service is used as an external AI service from another provider.

Flow:

```text
Frontend -> AWS Backend -> Azure OpenAI -> PostgreSQL -> Frontend
```

## Security considerations

- API keys stored only in cloud environment variables;
- database credentials never exposed in frontend;
- passwords stored as hashes;
- JWT tokens signed securely;
- HTTPS communication used in production;
- database accessible only from backend.

## Assignment requirements coverage

| Requirement | Implementation |
|---|---|
| Frontend service | AWS Amplify Hosting |
| Backend service | AWS cloud backend + API Gateway |
| Database service | Amazon RDS PostgreSQL |
| Cloud deployment | Managed cloud services |
| External provider | Azure OpenAI Service |
| API communication | REST API |
| Persistent data | PostgreSQL |
| AI functionality | Structured bug report generation |

## Team roles

| Member | Area | Responsibilities |
|---|---|---|
| Vladyslav Rudion | Frontend | User interface, pages, components, frontend logic |
| Yaroslav Tsaryk | Backend / Database | REST API, authentication, database architecture, PostgreSQL integration |
| Nikita Chernysh | AI / Integration / Full-stack support | Azure OpenAI integration, AI logic, frontend support, backend support, database support |

## Demonstration scenario

1. User opens the deployed frontend.
2. User signs in or continues as guest.
3. User enters bug description.
4. Frontend sends request to AWS backend.
5. Backend calls Azure OpenAI.
6. AI returns structured report.
7. Backend stores data in PostgreSQL.
8. Frontend displays the result.

## Authors

Developed by:

- Vladyslav Rudion
- Yaroslav Tsaryk
- Nikita Chernysh
