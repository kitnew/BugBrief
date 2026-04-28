# BugBrief Architecture & Technical Documentation

BugBrief is a modern, full-stack web application designed to help QA engineers and developers convert unstructured bug descriptions into structured, standardized bug reports using AI.

## High-Level Architecture

BugBrief utilizes a classic client-server architecture with three main components:

1.  **Frontend (Client)**: A React Single Page Application (SPA) built with Vite.
2.  **Backend (API Server)**: A Node.js server built with Express.js.
3.  **Database**: A PostgreSQL relational database.

These components are orchestrated using **Docker Compose** for easy local development and seamless deployment.

---

## 1. Frontend Architecture

The frontend is built with **React**, **TypeScript**, and **Vite**.

### State Management & Data Flow
- **Global Auth State**: Managed via React Context (\`AuthContext\`). It stores the current user, handles the JWT token lifecycle (saved in \`localStorage\`), and provides login/logout methods.
- **Local State**: Managed using standard React Hooks (\`useState\`, \`useEffect\`).
- **Guest vs. Authenticated Modes**: 
  - If a user is not logged in, generated reports are saved locally using the browser's \`sessionStorage\`. The application dispatches custom \`window\` events (\`localBugReportsUpdated\`) to trigger UI updates synchronously.
  - If a user is authenticated, the app sends \`saveToDb: true\` to the backend, bypassing \`sessionStorage\` and relying entirely on database persistence via API calls.

### API Integration
- **Axios Interceptors**: The \`reportsApi\` utilizes Axios interceptors to automatically attach the \`Authorization: Bearer <token>\` header to every outgoing request. This ensures secure communication with protected backend routes.

---

## 2. Backend Architecture

The backend is a RESTful API built with **Express.js** and **TypeScript**.

### Security & Authentication
- **Password Hashing**: User passwords are encrypted using \`bcrypt\` before being stored in the database.
- **JWT (JSON Web Tokens)**: Upon successful login, the server issues a JWT. 
- **Middleware**: 
  - \`authenticateToken\`: Secures endpoints by verifying the JWT. If validation fails, it returns a 401/403 status.
  - \`optionalAuthenticateToken\`: Extracts the user object if a token is present, but allows the request to proceed even if unauthenticated (useful for public/guest report generation).

### Database Access
- **PostgreSQL**: The \`pg\` library is used to manage connection pools.
- **Conditional SSL**: The database connection intelligently toggles SSL. If connecting to a local Docker container (\`DB_HOST=database\` or \`localhost\`), SSL is disabled. If connecting to an external service like AWS RDS, SSL is enabled.

### AI Integration
- **Service Layer**: The Azure OpenAI logic is encapsulated in a dedicated service (\`azureOpenAI.service.ts\`). This layer handles prompt engineering, API communication, and response parsing, ensuring that parsing failures are handled gracefully (using regex fallback for JSON extraction).

---

## 3. Database Schema

The database relies on a relational model to ensure data integrity.

### \`users\` Table
- \`id\` (SERIAL PRIMARY KEY)
- \`email\` (VARCHAR, UNIQUE)
- \`password_hash\` (VARCHAR)
- \`created_at\` (TIMESTAMP)

### \`bug_reports\` Table
- \`id\` (SERIAL PRIMARY KEY)
- \`user_id\` (INTEGER, FOREIGN KEY referencing \`users(id)\` with ON DELETE CASCADE)
- \`project_name\`, \`title\`, \`severity\`, \`category\`, \`status\`
- \`steps_to_reproduce\` (JSONB)
- \`expected_result\`, \`actual_result\`, \`technical_notes\`, \`suggested_fix\` (TEXT)

This schema guarantees data isolation; users can only retrieve, modify, or delete bug reports associated with their specific \`user_id\`.

---

## 4. Containerization (Docker)

The entire stack is containerized for consistency across environments.

- **Frontend Container**: Uses a multi-stage build. First, it compiles the TypeScript React app using Node.js. Then, it copies the static assets (\`dist/\`) into a lightweight **Nginx** container configured for SPA routing (redirecting all paths to \`index.html\`).
- **Backend Container**: Uses a multi-stage build to compile TypeScript into JavaScript, reducing the final image size.
- **Database Container**: Uses the official \`postgres:15-alpine\` image and automatically initializes the schema via a volume mount to \`/docker-entrypoint-initdb.d/\`.
- **Docker Compose**: The root \`compose.yml\` stitches everything together, managing networks, internal DNS resolution (\`database\`), and environment variable overrides.
