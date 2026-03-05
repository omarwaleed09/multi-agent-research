import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from tavily import TavilyClient
from backend.state import AgentState
from backend.memory import search_memory , save_to_memory

load_dotenv()

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.0,
)

tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def researcher_Agent(state:AgentState) -> dict:
    print("researcher searching...")

    all_findings=[]

    for step in state["plan"]:
        memory_results = search_memory(step, k=2)
        filtered = [doc for doc in memory_results if doc.metadata.get("step") == step]
        if filtered:
            all_findings.append(f"[From Memory] {filtered[0].page_content}")
            continue

        try:
            search_results = tavily_client.search(
                query=step,
                search_depth="advanced",
                max_results=3,
            )

            raw_content =""
            for r in search_results["results"]:
                raw_content += f"\nSource: {r['url']}\n{r['content']}\n"

            summary_prompt = f"""
            You are a research assistant. Summarize the following search results 
into clear, factual paragraphs. Keep only the most important information.

Search query: {step}

Search results:
{raw_content}

Write a concise summary (3-5 sentences):
"""


            summary = llm.invoke(summary_prompt)
            finding = summary.content.strip()

            
            save_to_memory(
                text=finding,
                metadata={"query": state["query"], "step": step}
            )

            all_findings.append(finding)
            print(f"Done: {finding[:60]}...")

        except Exception as e:
            print(f"Search failed for '{step}': {e}")
            all_findings.append(f"Could not find information for: {step}")


    full_research = "\n\n".join(all_findings)
    print(f"\nResearch complete! {len(all_findings)} findings collected.")

    return {
        "research": full_research,
        "iterations": state.get("iterations", 0) + 1
    }
