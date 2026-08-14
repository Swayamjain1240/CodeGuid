from pydantic import BaseModel
from typing import List, Optional


class VulnerabilityIssue(BaseModel):
    type: str
    severity: str
    file: Optional[str] = None
    line: Optional[int] = None
    description: str
    recommendation: str


class SecurityAuditResponse(BaseModel):
    securityGrade: str
    vulnerabilities: List[VulnerabilityIssue]
    summary: str


class AuditRequest(BaseModel):
    prTitle: str
    prDescription: Optional[str] = ""
    patch: str