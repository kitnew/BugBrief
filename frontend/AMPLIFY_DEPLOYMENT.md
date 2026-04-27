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

## Required environment variables

Set these variables in AWS Amplify environment variables:

```env
AMPLIFY_MONOREPO_APP_ROOT=frontend
VITE_API_BASE_URL=https://pj9b0lp0ul.execute-api.eu-north-1.amazonaws.com/
```

## Deployment steps

1. Open AWS Amplify Console.
2. Choose **Create new app**.
3. Select **GitHub** as the source provider.
4. Connect the GitHub repository `kitnew/BugBrief`.
5. Select the `main` branch.
6. Enable monorepo mode and set the app root to `frontend`.
7. Confirm the build command `npm run build` and output directory `dist`.
8. Add the required environment variables.
9. Start deployment.

After deployment, the frontend is available through the Amplify generated domain.
