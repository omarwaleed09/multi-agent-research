import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from backend.state import AgentState

load_dotenv()

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.0,
)

def critic_agent(state:AgentState)->dict:
    prompt = f"""
You are a strict research critic. Your job is to evaluate if the research 
is good enough to answer the user's question.

Original Question : {state["query"]}

Research findings :
{state['research']}

Evaluate the research based on these criteria:
1. Does it actually answer the original question?
2. Is there enough detail and explanation?
3. Are there any obvious gaps or missing information?

Respond in EXACTLY this format:
VERDICT: GOOD or BAD
REASON: (one sentence explaining your verdict)
MISSING: (if BAD, what specific information is still needed. If GOOD, write "nothing")
"""

    response = llm.invoke(prompt)
    critique = response.content.strip()
    print(f"Critique:\n{critique}")

    verdict_line = critique.split("\n")[0].upper()
    is_good = "GOOD" in verdict_line

    if is_good:
        print("Critic says: Research is GOOD — moving to Writer")
    else:
        print("Critic says: Research is BAD — needs more work")

    return {"critique": critique}


def should_continue(state:AgentState)->str:
    critique = state.get("critique" , "")
    iterations = state.get("iterations" , 0)

    if iterations >= 3:
        return "writer"

    first_line = critique.split("\n")[0].upper()
    if "GOOD" in first_line :
        return "writer"
    else:
        return "researcher"
