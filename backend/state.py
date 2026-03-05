from typing import TypedDict, List

class AgentState(TypedDict):
    query: str            # the user's original question
    plan: List[str]       # planner writes here
    research: str         # researcher writes here
    critique: str         # critic writes here
    final_answer: str     # writer writes here
    iterations: int       # tracks review loops
