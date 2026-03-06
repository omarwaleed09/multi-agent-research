import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from backend.graph import run_research

load_dotenv()

app= FastAPI(
    title="Multi-Agent Research Assistant",
    description="An AI system that researches any topic using multiple agents",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    query: str

class ResearchResponse(BaseModel):
    query: str
    plan: list
    research: str
    final_answer: str
    iterations: int
    verdict: str

@app.post("/research", response_model=ResearchRequest)
async def research(request: ResearchRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    result = run_research(request.query)
    verdict_line = result["critique"].split("\n")[0] if result["critique"] else "UNKNOWN"

    return ResearchResponse(
        query=result["query"],
        plan=result["plan"],
        research=result["research"],
        final_answer=result["final_answer"],
        iterations=result["iterations"],
        verdict=verdict_line
    )

@app.get("/health")
async def health():
    return {"status": "ok", "message": "Multi-Agent Research Assistant is running!"}
