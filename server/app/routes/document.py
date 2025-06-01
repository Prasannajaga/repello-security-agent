# Import necessary libraries
from fastapi import APIRouter, UploadFile, Form, HTTPException , File
from typing import Optional  
from google import genai
from app.template.promptTemplate import get_required_config
# from app.template.rag import load_rag_template , retrieve_rag_template
import logging  
from dotenv import load_dotenv
import os

load_dotenv()

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("app/server.log"),
        logging.StreamHandler()  
    ]
) 
 

router = APIRouter()  
client = genai.Client(api_key=str(os.getenv("GENAI_GOOGLE_API_KEY")))   

@router.get("/check")
def read_root(): 
    return {"message": "Hello from FastAPI with uv!"}
 
# Function to answer user queries with privacy guard
async def answer_query(file: UploadFile, query: str) -> str:
    """
    Answers user queries about the document while respecting privacy.
    Masks PII in the document text and refuses to reveal sensitive information explicitly.
    """     
    try:
        contents, generate_content_config, model = await get_required_config(file=file, query=query) 
        print(f"Contents prepared for model: {contents}")  
    except Exception as e:  
        logger.error(f"Error in get_required_config: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while processing your request. Please try again later."
        )
 

    response = client.models.generate_content(
        model = model,
        contents = contents,
        config = generate_content_config,
    )

    try:
        return response.text.strip()
    except Exception as e:
        logger.error(f"Error generating content: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Something went wrong while processing your request. Please try again later."
        )



def check_nsfw_content(user_query: str) -> bool:
    """
    Checks if the user_query contains any NSFW content.
    Returns True if NSFW content is found, otherwise False.
    """
    # Placeholder for actual NSFW detection logic

    try:
        with open(r"D:\hackathon\repello-security-agent\server\app\template\nsfw_content.txt", 'r') as file:
            nsfw_keywords = [line.strip().lower() for line in file if line.strip()]
    except FileNotFoundError:
        return False  # If file not found, assume no NSFW content

    user_query_words = user_query.lower().split()
    for keyword in nsfw_keywords:
        if keyword in user_query_words:
            return True
        
    return False
 
@router.post("/upload")
async def upload_document(file: Optional[UploadFile] = File(None), query: str = Form(...)):
    """
    Endpoint to upload a document and ask a query about its content.
    Returns the answer in JSON format, with sensitive information masked.
    Limits file size to 10MB for practicality.
    """
    # # text = await load_rag_template(file=file)
    # response = await retrieve_rag_template(query=query)
    # print(f"Loaded PDF text: {response}...")  # Print first 100 characters for debugging
    # return {"answer": response} 

    is_nsfw = check_nsfw_content(query)
    if is_nsfw:
        logger.warning(f"NSFW content detected in query: {query}")
        raise HTTPException(
            status_code=400,
            detail="Oops! 🚫 Your query seems to contain NSFW content. Please rephrase your question to keep it safe and respectful! 🙏✨"
        )

    if file != None: 
        logger.info(f"Received file: {file.filename}, type: {file.content_type}")
        if file.content_type not in ["text/plain", "application/pdf"]:
            logger.error(f"Unsupported file type: {file.content_type}")
            raise HTTPException(
                status_code=415,
                detail="Oops! 🚫 This file type is not supported. Please upload a PDF, plain text so we can work some magic! ✨"
            )

        # Check file size (limit to 10MB)
        file_size = 0
        for chunk in file.file:
            file_size += len(chunk)
            if file_size > 10 * 1024 * 1024:  
                logger.error(f"File too large: {file.filename} ({file_size} bytes)")
                raise HTTPException(
                    status_code=413,
                    detail="Whoa! 🚀 This file is too big for our magic tricks. Please upload something under 10MB so we can work our wizardry! 🧙‍♂️✨"
                )
        file.file.seek(0)   

    try:  
        if file != None: 
            answer = await answer_query(file, query)
        else:
            answer = await answer_query(None, query)

        return {"answer": answer}
    except ValueError as e:
        logger.error(f"ValueError: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e)) 

