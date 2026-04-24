# AWS Amplify deployment

This frontend is prepared for deployment on AWS Amplify Hosting.

## Build settings

The repository contains an `amplify.yml` file in the root directory. It tells Amplify that the frontend application is located in the `frontend` folder.

Amplify build commands:

```bash
npm ci
npm run build
```

Build output directory:

```text
dist
```

## Required environment variable

Set this variable in AWS Amplify environment variables:

```env
VITE_API_BASE_URL=https://your-backend-api-url
```

For local development, copy `.env.example` to `.env` and adjust the value:

```bash
cp .env.example .env
```

Example local value:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Deployment steps

1. Open AWS Amplify Console.
2. Choose **New app**.
3. Select **Host web app**.
4. Connect the GitHub repository `kitnew/BugBrief`.
5. Select the `main` branch.
6. Confirm that Amplify detected the `amplify.yml` configuration.
7. Add the `VITE_API_BASE_URL` environment variable.
8. Start deployment.

After deployment, the frontend should be available through the Amplify generated domain.
