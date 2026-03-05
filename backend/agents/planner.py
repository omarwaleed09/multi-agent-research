import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from backend.state import AgentState

load_dotenv()

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.0,
)


def planner_Agent(state:AgentState) -> dict:
    print("planner thinking...")

    prompt = f"""
    You are a research planner. The user wants to research this topic and find the best answer:

    "{state['query']}"

    Your job is to break this into 3-5 clear search steps.
    Return ONLY a numbered list of search steps, nothing else.

    Example:
    1. Search for basic definition of the topic
    2. Search for real-world applications
    3. Search for recent developments
    """
    response = llm.invoke(prompt)
    lines = response.content.strip().split("\n")
    plan = [line.strip() for line in lines if line.strip() and line[0].isdigit()]
    return {"plan": plan}
