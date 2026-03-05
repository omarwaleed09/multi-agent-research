import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from backend.state import AgentState

load_dotenv()

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.3,
)


def writer_agent(state:AgentState)->dict:
    prompt = f"""
You are an expert research writer. Your job is to write a clear, 
well-structured answer based on research findings.

Original question: "{state['query']}"

Research findings:
{state['research']}

Critic's feedback:
{state['critique']}

Instructions:
- Write a complete, well-structured answer
- Use simple language that anyone can understand
- Organize with clear paragraphs
- Start with a direct answer to the question
- Then explain with details and examples
- End with a brief conclusion

Write the final answer now:
"""
    response = llm.invoke(prompt)
    final_answer = response.content.strip()

    return {"final_answer": final_answer}
