import { GoogleGenerativeAI } from "@google/generative-ai"
import { parseAnalysisPayload } from "./aiSchemas.js"

let client = null;

const getClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    if (!client) {
        client = new GoogleGenerativeAI(apiKey);
    }

    return client;
};

export const analyzeDiffWithAI = async (diffText) => {
    try {
        const model = getClient().getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `
      You are an expert Application Security Engineer performing a code security audit on a GitHub Pull Request.
      Analyze the following Git diff for security vulnerabilities (e.g., SQL Injection, Hardcoded Secrets/API Keys, XSS, Broken Access Control, Command Injection, Insecure Deserialization, etc.).

      Git Diff:
      \`\`\`diff
      ${diffText}
      \`\`\`

      Respond strictly with a JSON object adhering to this schema:
      {
        "securityGrade": "A" | "B" | "C" | "D" | "F",
        "status": "PASSED" | "FAILED",
        "summary": "Brief executive summary of findings",
        "vulnerabilities": [
          {
            "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
            "type": "Vulnerability Type (e.g., SQL Injection)",
            "filePath": "path/to/file.js",
            "lineNumber": 42,
            "description": "Detailed explanation of the risk",
            "recommendation": "Suggested code fix or best practice"
          }
        ]
      }
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Validated and normalized: the worker only ever persists canonical findings.
        return parseAnalysisPayload(responseText);
    } catch (error) {
        console.error('[AI Service Error]', error.message);
        throw new Error(`AI Analysis failed: ${error.message}`);
    }
};

export const formatSecurityCommentMarkdown = (analysis = {}) => {
    const gradeEmojis = {
        A: '🟢',
        B: '🟢',
        C: '🟡',
        D: '🟠',
        F: '🔴',
    };

    const grade = analysis.securityGrade || 'N/A';
    const vulnerabilities = Array.isArray(analysis.vulnerabilities) ? analysis.vulnerabilities : [];
    const status = analysis.status || (vulnerabilities.length > 0 ? 'FAILED' : 'PASSED');
    const emoji = gradeEmojis[grade] || '🛡️';

    let markdown = `## 🛡️ GuardAI Security Audit Report\n\n`;
    markdown += `**Overall Security Grade:** ${emoji} **Grade ${grade}** (${status})\n\n`;
    markdown += `### 📝 Summary\n${analysis.summary || 'No summary provided.'}\n\n`;

    if (vulnerabilities.length === 0) {
        markdown += `### ✅ No Security Issues Detected\nNo critical, high, or medium vulnerabilities were found in this Pull Request.\n`;
    } else {
        markdown += `### ⚠️ Identified Security Risks (${vulnerabilities.length})\n\n`;
        vulnerabilities.forEach((vuln, idx) => {
            const severity = vuln.severity || 'MEDIUM';
            const sevEmoji = severity === 'CRITICAL' || severity === 'HIGH' ? '🔴' : '🟡';
            markdown += `#### ${idx + 1}. ${sevEmoji} [${severity}] ${vuln.type || vuln.title || 'Security issue'}\n`;
            markdown += `- **File:** \`${vuln.filePath || 'unknown'}\` (Line ${vuln.lineNumber ?? 'N/A'})\n`;
            markdown += `- **Risk:** ${vuln.description || 'No description provided.'}\n`;
            markdown += `- **Suggested Fix:** ${vuln.recommendation || 'No recommendation provided.'}\n\n`;
        });
    }

    markdown += `---\n*Automated security review powered by GuardAI*`;
    return markdown;
};
