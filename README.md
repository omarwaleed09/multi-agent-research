# 🤖 Multi-Agent Research Assistant

A production-style AI system where **4 specialized agents collaborate** to research any topic — planning, searching the web, evaluating quality, and writing a polished final answer.

Built with **LangGraph**, **Groq (LLaMA 3)**, **Pinecone**, and a **React** frontend.

---

## 🎥 Demo

> Ask a question → watch 4 agents work together → get a structured, well-researched answer

https://github.com/user-attachments/assets/a27ba942-94b1-45de-9405-2afffb371e2d

---

## 🧠 How It Works

```
User Question
      │
      ▼
┌─────────────┐
│  🧠 Planner  │  Breaks the question into 3–5 search steps
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│  🔍 Researcher   │  Searches the web (Tavily) · Saves findings to Pinecone memory
└──────┬───────────┘
       │
       ▼
┌─────────────┐
│  🔎 Critic   │  Evaluates research quality → loops back if needed (max 3x)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  ✍️ Writer   │  Synthesizes everything into a clean, structured answer
└─────────────┘
```

Each agent reads from and writes to a **shared state** — a dictionary that acts as the team's whiteboard. LangGraph manages the flow and handles the critic's feedback loop automatically.

---

## ✨ Features

- **Multi-agent pipeline** — 4 agents with distinct roles, orchestrated by LangGraph
- **Agentic loop** — the Critic can send the Researcher back for more work (up to 3 iterations)
- **Web search** — real-time search powered by Tavily API
- **Agent memory** — research findings are embedded and stored in Pinecone so the system avoids redundant searches and reuses past knowledge across queries
- **Fast LLM** — powered by Groq's LLaMA 3.3 70B (free & blazing fast)
- **Clean React UI** — live pipeline visualizer, collapsible detail cards, copy button, query history

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Agent Framework** | LangGraph |
| **LLM** | Groq — LLaMA 3.3 70B |
| **Web Search** | Tavily API |
| **Agent Memory** | Pinecone (vector database) |
| **Embeddings** | HuggingFace — all-mpnet-base-v2 (free, local) |
| **Backend** | FastAPI + Uvicorn |
| **Frontend** | React + Vite |

---

## 📁 Project Structure

```
multi-agent-research/
├── backend/
│   ├── agents/
│   │   ├── planner.py       # Breaks query into search steps
│   │   ├── researcher.py    # Searches web + saves findings to Pinecone
│   │   ├── critic.py        # Evaluates research + routing logic
│   │   └── writer.py        # Writes the final answer
│   ├── graph.py             # LangGraph pipeline (connects all agents)
│   ├── state.py             # Shared AgentState definition
│   ├── memory.py            # Pinecone read/write helpers
│   └── main.py              # FastAPI server
├── frontend/
│   └── src/
│       └── App.jsx          # React UI
├── start.bat                # One-click launcher (Windows)
├── .env                     # API keys (not committed)
└── requirements.txt
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/multi-agent-research.git
cd multi-agent-research
```

### 2. Set up the Python environment

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
```

### 3. Get your free API keys

| Service | Link | Used for |
|---|---|---|
| **Groq** | [console.groq.com](https://console.groq.com) | LLM inference |
| **Tavily** | [tavily.com](https://tavily.com) | Web search |
| **Pinecone** | [pinecone.io](https://pinecone.io) | Agent memory |

### 4. Create your `.env` file

```env
GROQ_API_KEY=your_groq_key_here
TAVILY_API_KEY=your_tavily_key_here
PINECONE_API_KEY=your_pinecone_key_here
```

### 5. Create a Pinecone index

In your Pinecone dashboard:
- **Name:** `research-memory`
- **Dimensions:** `768`
- **Metric:** `cosine`

### 6. Install frontend dependencies

```bash
cd frontend
npm install
```

### 7. Run the project

**Option A — Double-click `start.bat`** (Windows, recommended)

**Option B — Two terminals:**
```bash
# Terminal 1 — Backend
uvicorn backend.main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open **http://localhost:5173** in your browser 🎉

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/research` | Run the full multi-agent pipeline |
| `GET` | `/health` | Check if server is running |

**Request body:**
```json
{ "query": "What is quantum computing?" }
```

**Response:**
```json
{
  "query": "...",
  "plan": ["step 1", "step 2", "..."],
  "research": "...",
  "final_answer": "...",
  "iterations": 1,
  "verdict": "VERDICT: GOOD"
}
```

---

## 💡 What I Learned

- How to design and orchestrate **multi-agent systems** using LangGraph's `StateGraph`
- How **conditional edges** work to implement feedback loops between agents
- How to integrate **external tools** (web search, vector DB) into agent workflows
- How to connect a **FastAPI backend** to a **React frontend** with proper CORS handling
- How to use **Pinecone** as a long-term memory store — saving agent findings as embeddings and retrieving them semantically in future queries to avoid redundant searches

---

## 🗺️ Roadmap

- [ ] Add RAG support — let agents search uploaded PDF documents
- [ ] Stream agent responses in real-time to the frontend
- [ ] Add conversation history / multi-turn mode
- [ ] Deploy to Railway (backend) + Vercel (frontend)
