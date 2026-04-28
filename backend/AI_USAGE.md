# BugBrief AI Integration Guide

BugBrief leverages **Azure OpenAI** to transform unstructured, messy bug descriptions into structured, professional Quality Assurance reports. This document outlines how the AI is configured and utilized within the backend.

## AI Service Configuration

The integration is located in \`src/services/azureOpenAI.service.ts\`. It relies on the \`axios\` HTTP client to communicate with the Azure REST API and uses \`zod\` to define the expected schema for type safety.

### Required Environment Variables

To successfully connect to the Azure OpenAI service, the following environment variables must be present:

- \`AZURE_OPENAI_ENDPOINT\`: The base URL of your Azure Cognitive Services instance.
- \`AZURE_OPENAI_API_KEY\`: Your authentication key.
- \`AZURE_OPENAI_DEPLOYMENT\`: The name of the deployed model (e.g., \`gpt-4o-mini\`).
- \`AZURE_OPENAI_API_VERSION\`: The API version (e.g., \`2025-01-01-preview\`).

## The Prompting Strategy

The AI is provided with a strict system prompt instructing it to act as an expert QA engineer. It expects raw user input detailing a bug and must output a JSON object adhering to the following schema:

\`\`\`json
{
  "title": "Clear and concise bug title",
  "severity": "Low | Medium | High | Critical",
  "category": "e.g., UI, Backend, Database, Authentication",
  "stepsToReproduce": ["Step 1", "Step 2"],
  "expectedResult": "What should have happened",
  "actualResult": "What actually happened",
  "technicalNotes": "Any technical assumptions or logs",
  "suggestedFix": "Possible solution"
}
\`\`\`

The backend explicitly instructs the model to return *only* the JSON object, wrapped inside standard JSON formatting.

## Response Parsing and Resilience

Because LLMs can sometimes output markdown wrappers (like \`\`\`json ... \`\`\`), the \`extractJson\` utility function is implemented to ensure resilience. If standard \`JSON.parse()\` fails, the function falls back to using a Regular Expression (\`/\\{[\\s\\S]*\\}/\`) to extract the JSON block from the surrounding text.

## Error Handling

If the user attempts to inject malicious prompts or provides garbage data, the AI will likely fail to produce valid JSON or the API might reject the prompt entirely. The backend propagates these errors, allowing the frontend to present a fun, custom error message ("Nice try, hacker!").
