from groq import Groq
from dotenv import load_dotenv
import os 
from openai import OpenAI

load_dotenv()

# client = Groq(
#     api_key= os.getenv("GROQ_API_KEY")
# )

client = OpenAI()


def llm_resume_analysis(resume_text : str):
    prompt = f"""
    You are an expert AI career coach 

    Analyze this resume 

    Return:
    1. Technical strengths
    2. Missing skills
    3. Career recommendations
    4. Interview preparation advice
    5. Overall evaluation 

    Resume:
    {resume_text}
"""
    
    try :
        completion = client.chat.completions.create(
            model = "gpt-4o",
            messages = [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.5
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error during LLM analysis: {str(e)}"
