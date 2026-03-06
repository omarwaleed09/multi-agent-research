@echo off
echo Starting Multi-Agent Research Assistant...

start cmd /k "cd /d D:\projects\multi-agent-research && venv\Scripts\activate && uvicorn backend.main:app --reload --port 8000"

timeout /t 3 /nobreak > nul

start cmd /k "cd /d D:\projects\multi-agent-research\frontend && npm run dev"