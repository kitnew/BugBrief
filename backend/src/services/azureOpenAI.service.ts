import axios from "axios";
import { z } from "zod";

const BugReportSchema = z.object({
    title: z.string(),
    severity: z.enum(["Low", "Medium", "High", "Critical"]),
    category: z.string(),
    stepsToReproduce: z.array(z.string()),
    expectedResult: z.string(),
    actualResult: z.string(),
    technicalNotes: z.string(),
    suggestedFix: z.string(),
});

export type GeneratedBugReport = z.infer<typeof BugReportSchema>;

type AnalyzeBugInput = {
    projectName?: string;
    environment?: string;
    rawDescription: string;
};

function extractJson(text: string): unknown {
    try {
        return JSON.parse(text);
    } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (!match) {
            throw new Error("AI response does not contain valid JSON");
        }

        return JSON.parse(match[0]);
    }
}

export async function analyzeBugWithAzureAI(
    input: AnalyzeBugInput
): Promise<GeneratedBugReport> {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

    if (!endpoint || !apiKey || !deployment || !apiVersion) {
        throw new Error("Azure OpenAI environment variables are missing");
    }

    const response = await axios.post(
        `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`,
        {
            model: deployment,
            messages: [
                {
                    role: "system",
                    content: `
You are a senior QA engineer and software bug triage assistant.

Your task is to convert an unstructured bug description into a structured bug report.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations outside JSON.

JSON schema:
{
  "title": "string",
  "severity": "Low | Medium | High | Critical",
  "category": "string",
  "stepsToReproduce": ["string"],
  "expectedResult": "string",
  "actualResult": "string",
  "technicalNotes": "string",
  "suggestedFix": "string"
}

Severity rules:
- Critical: application crash, data loss, security issue, total outage
- High: core feature broken, authentication/payment/data operation broken
- Medium: important but workaround exists
- Low: cosmetic or minor usability issue
          `.trim(),
                },
                {
                    role: "user",
                    content: `
Project name: ${input.projectName || "Unknown"}
Environment: ${input.environment || "Unknown"}

Raw bug description:
${input.rawDescription}
          `.trim(),
                },
            ],
            temperature: 0.2,
            max_tokens: 800,
        },
        {
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey,
            },
            timeout: 30000,
        }
    );

    const content = response.data?.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error("Azure OpenAI returned empty response");
    }

    const parsed = extractJson(content);

    return BugReportSchema.parse(parsed);
}