import { GoogleGenerativeAi } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export const analyzeDiffWithAI = async (diffText) => {
    try {
        const model = genAI.getGenerativeModel({
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
        const analysis = JSON.parse(responseText);

        return analysis;
    } catch (error) {
        console.error('[AI Service Error]', error.message);
        throw new Error(`AI Analysis failed: ${error.message}`);
    }
};

export const formatSecurityCommentMarkdown = (analysis) => {
    const gradeEmojis = {
        A: '🟢',
        B: '🟢',
        C: '🟡',
        D: '🟠',
        F: '🔴',
    };

    const emoji = gradeEmojis[analysis.securityGrade] || '🛡️';

    let markdown = `## 🛡️ GuardAI Security Audit Report\n\n`;
    markdown += `**Overall Security Grade:** ${emoji} **Grade ${analysis.securityGrade}** (${analysis.status})\n\n`;
    markdown += `### 📝 Summary\n${analysis.summary}\n\n`;

    if (!analysis.vulnerabilities || analysis.vulnerabilities.length === 0) {
        markdown += `### ✅ No Security Issues Detected\nNo critical, high, or medium vulnerabilities were found in this Pull Request.\n`;
    } else {
        markdown += `### ⚠️ Identified Security Risks (${analysis.vulnerabilities.length})\n\n`;
        analysis.vulnerabilities.forEach((vuln, idx) => {
            const sevEmoji = vuln.severity === 'CRITICAL' || vuln.severity === 'HIGH' ? '🔴' : '🟡';
            markdown += `#### ${idx + 1}. ${sevEmoji} [${vuln.severity}] ${vuln.type}\n`;
            markdown += `- **File:** \`${vuln.filePath}\` (Line ${vuln.lineNumber || 'N/A'})\n`;
            markdown += `- **Risk:** ${vuln.description}\n`;
            markdown += `- **Suggested Fix:** ${vuln.recommendation}\n\n`;
        });
    }

    markdown += `---\n*Automated security review powered by GuardAI*`;
    return markdown;
};