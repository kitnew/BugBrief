# BugBrief Frontend

BugBrief is a React frontend for creating, viewing and managing AI-generated software bug reports. The application allows a user to enter an unstructured bug description, send it to the backend API, and view structured report data such as severity, status, category, reproduction steps, expected result, actual result and suggested fix.

## Technology stack

- React
- TypeScript
- Vite
- Axios
- Custom CSS
- AWS Amplify Hosting for deployment

Tailwind CSS is not used in the current frontend implementation. The UI is styled with custom CSS files.

## Project structure

```text
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── reportsApi.ts
│   ├── components/
│   │   ├── Badges.css
│   │   ├── BugReportForm.tsx
│   │   ├── ReportCard.tsx
│   │   ├── ReportDetail.tsx
│   │   ├── ReportsList.tsx
│   │   ├── SeverityBadge.tsx
│   │   └── StatusBadge.tsx
│   ├── data/
│   │   └── mockReports.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── NavFix.css
├── .env.example
├── index.html
├── package.json
└── vite.config.ts
```

## Local setup

Install Node.js first. Then open the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

On Windows PowerShell, if `cp` is not available, use:

```powershell
Copy-Item .env.example .env
```

## Environment variables

The frontend uses the following Vite environment variable:

```env
VITE_API_BASE_URL=http://localhost:5000
```

For local development, `http://localhost:5000` can be used while the backend runs locally.

For AWS Amplify or any deployed environment, replace it with the deployed backend URL:

```env
VITE_API_BASE_URL=https://your-backend-api-url
```

If the backend is not available, the reports list falls back to demo data from `src/data/mockReports.ts`. The create report form will show an API error until the backend endpoint is available.

## Available scripts

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

## Main frontend features

### Main layout and navigation

The main layout is defined in `src/App.tsx`. The navigation uses buttons instead of hash links to avoid browser jump and focus issues. Smooth scrolling is handled directly in React.

### Bug report form

The form component is located in:

```text
src/components/BugReportForm.tsx
```

It collects:

- project name
- environment
- raw bug description

The form validates required fields and sends the data to the backend API.

### Reports list

The reports list is located in:

```text
src/components/ReportsList.tsx
```

It tries to load reports from the backend. If the backend is not available, it displays demo reports.

### Report detail

The report detail view is located in:

```text
src/components/ReportDetail.tsx
```

It displays structured information about the selected report:

- severity
- status
- category
- steps to reproduce
- expected result
- actual result
- technical notes
- suggested fix

### Badges

Severity and status UI is split into reusable components:

```text
src/components/SeverityBadge.tsx
src/components/StatusBadge.tsx
src/components/Badges.css
```

Supported severity values:

```text
Low, Medium, High, Critical
```

Supported status values:

```text
open, in progress, resolved
```

## API integration

API functions are located in:

```text
src/api/reportsApi.ts
```

Expected backend endpoints:

```text
POST /api/reports/analyze
GET /api/reports
GET /api/reports/:id
```

The API base URL is controlled by `VITE_API_BASE_URL`.

## AWS Amplify deployment

The repository contains an Amplify configuration file in the repository root:

```text
amplify.yml
```

The frontend is a monorepo app located in:

```text
frontend
```

Required Amplify environment variables:

```env
AMPLIFY_MONOREPO_APP_ROOT=frontend
VITE_API_BASE_URL=https://your-backend-api-url
```

Temporary value while the backend is not deployed:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Build settings:

```text
Build command: npm run build
Build output directory: dist
App root: frontend
```

More deployment details are available in:

```text
frontend/AMPLIFY_DEPLOYMENT.md
```

## Current limitations

- The backend API must be running for real report creation.
- Without backend deployment, the form submit will show an API connection error.
- The reports list uses mock data as fallback.
- Authentication is not implemented in the frontend.
