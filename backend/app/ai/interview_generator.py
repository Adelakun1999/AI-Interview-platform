from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI()

def generate_interview_questions(
        resume_text : str ,
        interview_type : str,
        difficulty : str
):
    prompt = f"""
    You are an expert technical interviewer
    Based on this resume:

    {resume_text}
Generate 5 interview questions.

Interview Type:
{interview_type}

Difficulty:
{difficulty}

The questions should:
- be specific to the candidate's background
 - test practical understanding
 - resemble real industry interviews

    Return only the questions.
    """

    completion = client.chat.completions.create(
        model = "gpt-4o",
        messages = [
            {
                "role" : "user",
                "content" : prompt
            }
        ],
        temperature = 0.7,
    )

    return completion.choices[0].message.content


