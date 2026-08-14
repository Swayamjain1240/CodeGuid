import os

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

from schemas import SecurityAuditResponse, AuditRequest

load_dotenv()


llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.2,
    api_key=os.getenv("OPENAI_API_KEY")
)


structured_llm = llm.with_structured_output(SecurityAuditResponse)


prompt_template = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are an expert Senior Cybersecurity Auditor. "
        "Analyze the provided Git pull request diff for security vulnerabilities, "
        "secrets, injection bugs, or code smells. "
        "Provide a security grade (A, B, C, D, F) and detailed issues."
    ),
    (
        "human",
        "PR Title: {prTitle}\n"
        "PR Description: {prDescription}\n\n"
        "Git Diff Patch:\n{patch}"
    )
])


def analyze_pr_patch(request_data: AuditRequest):
    return (prompt_template | structured_llm).invoke({
        "prTitle": request_data.prTitle,
        "prDescription": request_data.prDescription or "No description provided.",
        "patch": request_data.patch
    })