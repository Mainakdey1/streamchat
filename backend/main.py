from fastapi import FastAPI
from stream_chat import StreamChat
import openai
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)


STREAM_API_KEY = "bknpx6eut9sj"
STREAM_API_SECRET = "3es4893mzf6m64mjj59pmzznhvta895ur297dpuet3g449aky22q9fhunweh2xua"

OPENAI_API_KEY = ""

chat_client = StreamChat(api_key=STREAM_API_KEY, api_secret=STREAM_API_SECRET)
openai.api_key = OPENAI_API_KEY

app = FastAPI()


@app.get("/token")
def generate_token(user_id: str):
    token = chat_client.create_token(user_id)
    return {"token": token}


@app.post("/ai-response")
async def ai_response(message: dict):
    user_message = message.get("text", "")

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": user_message}],
    )
    
    return {"reply": response["choices"][0]["message"]["content"]}


@app.post("/webhook")
async def stream_webhook(event: dict):
    if event["type"] == "message.new" and event["user"]["id"] != "ai-bot":
        user_message = event["message"]["text"]

        ai_reply = await ai_response({"text": user_message})


        chat_client.channel("messaging", "ai-bot").send_message({
            "text": ai_reply["reply"],
            "user_id": "ai-bot"
        })

    return {"status": "ok"}
