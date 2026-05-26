from openai import OpenAI
from dotenv import load_dotenv
import os 

load_dotenv()

client = OpenAI()

def evaluate_answer(
        question : str ,
        answer : str
):
    prompt = f"""
You are an expert technical interviewer.

Evaluate this interview answer.

Question:
{question}

Candidate Answer:
{answer}

Return your evaluation STRICTLY in this format:

Score: <number>/10

Strengths:
- point
- point

Weaknesses:
- point
- point

Suggestions:
- point
- point

Final Evaluation:
<summary>

Only return this format.
"""

    completion = client.chat.completions.create(
        model = "gpt-4o",
        messages = [
            {
                "role" : "user",
                "content" : prompt
            }
        ],
        temperature = 0.4,
    )
    return completion.choices[0].message.content