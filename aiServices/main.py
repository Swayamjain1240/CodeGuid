import os
import uvicorn

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from schemas import AuditRequest, SecurityAuditResponse
from analyzer import analyze_pr_patch


load_dotenv()


app = FastAPI(title="GitGuard AI Audit Microservice")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "service": "aiServices"
    }


@app.post("/analyze", response_model=SecurityAuditResponse)
def analyze_code(payload: AuditRequest):

    try:
        if not payload.patch.strip():
            raise HTTPException(
                status_code=400,
                detail="Patch content cannot be empty."
            )

        report = analyze_pr_patch(payload)

        return report

    except Exception as err:
        raise HTTPException(
            status_code=500,
            detail=str(err)
        )


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )