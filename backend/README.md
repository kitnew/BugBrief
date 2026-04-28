# BugBrief Backend

This is the Node.js Express backend for the BugBrief platform. It provides a REST API for user authentication, bug report management, and integration with Azure OpenAI for AI-powered bug analysis.

## Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL (v15+)
- Docker and Docker Compose (for containerized setup)

## Environment Variables

Create a \`.env\` file in the \`backend\` directory (use \`.env.example\` as a template) with the following variables:

\`\`\`env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_DATABASE=bug_brief
DB_SSL=false

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-endpoint.cognitiveservices.azure.com
AZURE_OPENAI_API_KEY=your_api_key
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
AZURE_OPENAI_API_VERSION=2025-01-01-preview
\`\`\`

## Running Locally

### Using Docker Compose (Recommended)
From the root of the project, run:
\`\`\`bash
docker compose up -d --build
\`\`\`
This will spin up the backend, frontend, and PostgreSQL database. The schema will be automatically initialized.

### Manual Setup
1. **Install Dependencies:**
   \`\`\`bash
   npm install
   \`\`\`
2. **Initialize Database:**
   Run the \`database/schema.sql\` script on your PostgreSQL instance to create the necessary tables.
3. **Run Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

- **Auth:** \`/api/auth/register\`, \`/api/auth/login\`, \`/api/auth/me\`
- **Reports:** 
  - \`POST /api/reports/analyze\` - Generates a report using AI.
  - \`GET /api/reports\` - Fetches user's reports.
  - \`PATCH /api/reports/:id/status\` - Updates report status.
  - \`DELETE /api/reports/:id\` - Deletes a report.
