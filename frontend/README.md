# BugBrief Frontend

BugBrief frontend is the user interface for creating, viewing and managing AI-generated software bug reports. The application allows users to enter an unstructured bug description, send it to the backend API and display the generated structured report.

## Technology stack

- React
- TypeScript
- Vite
- Axios
- CSS
- AWS Amplify Hosting

## Frontend responsibilities

The frontend part of the project provides:

- main application layout and navigation
- bug report creation form
- connection to backend API endpoints
- reports list view
- selected report detail view
- severity and status visual indicators
- deployment configuration for AWS Amplify Hosting

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
├── index.html
├── package.json
└── vite.config.ts
```

## Application layout and navigation

The main layout is implemented in:

```text
src/App.tsx
```

The page contains:

- header with BugBrief branding
- navigation buttons
- hero section
- report creation section
- reports list section
- report detail section

Navigation is handled through React button actions and smooth scrolling between page sections.

## Bug report form

The bug report form is implemented in:

```text
src/components/BugReportForm.tsx
```

The form collects:

- project name
- environment
- raw bug description

After validation, the form sends the report data to the backend API for analysis and structured report generation.

## Reports list

The reports list is implemented in:

```text
src/components/ReportsList.tsx
```

It displays generated bug reports and allows the user to select a report for detailed inspection.

Each report card is implemented in:

```text
src/components/ReportCard.tsx
```

The card displays the project name, report title, category, status, severity and suggested fix summary.

## Report detail view

The report detail view is implemented in:

```text
src/components/ReportDetail.tsx
```

It displays the structured contents of a selected bug report:

- title
- project name
- severity
- status
- category
- steps to reproduce
- expected result
- actual result
- technical notes
- suggested fix

## Severity and status UI

Severity and status labels are implemented as reusable components:

```text
src/components/SeverityBadge.tsx
src/components/StatusBadge.tsx
```

Their styles are defined in:

```text
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

Frontend API communication is implemented in:

```text
src/api/reportsApi.ts
```

The frontend expects the backend to provide the following endpoints:

```text
POST /api/reports/analyze
GET /api/reports
GET /api/reports/:id
```

The backend API address is configured through the Vite environment variable:

```env
VITE_API_BASE_URL=https://pj9b0lp0ul.execute-api.eu-north-1.amazonaws.com/
```

## AWS Amplify deployment

The frontend is prepared for deployment through AWS Amplify Hosting. The deployment configuration is located in the repository root:

```text
amplify.yml
```

The frontend is located in the monorepo subdirectory:

```text
frontend
```

Amplify build configuration:

```text
App root: frontend
Build command: npm run build
Build output directory: dist
```

Required Amplify environment variables:

```env
AMPLIFY_MONOREPO_APP_ROOT=frontend
VITE_API_BASE_URL=https://pj9b0lp0ul.execute-api.eu-north-1.amazonaws.com/
```

Additional deployment notes are available in:

```text
frontend/AMPLIFY_DEPLOYMENT.md
```
