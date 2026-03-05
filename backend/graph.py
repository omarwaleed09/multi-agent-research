import os
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from backend.state import AgentState
from backend.agents.planner import planner_agent
from backend.agents.researcher import researcher_agent
from backend.agents.critic import critic_agent, should_continue
from backend.agents.writer import writer_agent

load_dotenv()

def build_graph():
    graph = StateGraph(AgentState)
    graph.add_node("planner",    planner_agent)
    graph.add_node("researcher", researcher_agent)
    graph.add_node("critic",     critic_agent)
    graph.add_node("writer",     writer_agent)

    graph.add_edge("planner" , "researcher")
    graph.add_edge("researcher" , "critic")
    graph.add_edge("writer" , END)

    graph.add_conditional_edges(
        "critic",
        should_continue,
        {
            "writer":     "writer",
            "researcher": "researcher"
        }
    )
    graph.set_entry_point("planner")
    app = graph.compile()
    return app
    

def run_research(query:str)-> dict:
    app = build_graph()

    state = {
        "query" : query,
        "plan": [],
        "research": "",
        "critique": "",
        "final_answer": "",
        "iterations": 0
    }

    final_state = app.invoke(state)
    return final_state
