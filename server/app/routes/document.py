# Import necessary libraries
from fastapi import APIRouter, UploadFile, Form, HTTPException , File
from typing import Optional
import pdfplumber
import re 
from langchain_google_genai import GoogleGenerativeAI
from langchain.prompts import PromptTemplate 

# Initialize FastAPI app
router = APIRouter()
llm = GoogleGenerativeAI(model="gemini-pro", google_api_key="AIzaSyCsbQwJwKCjs0WneRejEQ_N6Q5_aHrcivc")
# llm = GoogleGenerativeAI(model="gemini-pro-vision", google_api_key="AIzaSyCsbQwJwKCjs0WneRejEQ_N6Q5_aHrcivc")



@router.get("/check")
def read_root():
    """
    Root endpoint to check if the API is running.
    """
  
    data = llm.invoke("Hello from FastAPI with uv!")
    return {"message": data}

# Function to parse document content based on file type
def parse_document(file: UploadFile) -> str:
    """
    Parses the content of the uploaded file.
    Supports PDF, plain text, and CSV files.
    For image-based PDFs or images, OCR is not implemented (placeholder).
    """
    if file.content_type == 'application/pdf':
        # Extract text from PDF using pdfplumber
        # Note: Image-based PDFs require OCR (e.g., pytesseract), not implemented here
        with pdfplumber.open(file.file) as pdf:
            text = ''
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:  # Ensure text is not None
                    text += extracted + '\n'
            if not text.strip():
                raise ValueError("No text could be extracted from the PDF.")
        return text
    elif file.content_type == 'text/plain':
        # Read plain text file
        return file.file.read().decode('utf-8')
    elif file.content_type == 'text/csv':
        # Read CSV file as text (for simplicity; could be parsed structurally if needed)
        return file.file.read().decode('utf-8')
    else:
        raise ValueError("Unsupported file type. Only PDF, text, and CSV are supported.")

# Function to detect and mask Personally Identifiable Information (PII)
def detect_and_mask_pii(text: str) -> str:
    """
    Detects and masks sensitive information (PII) in the text using regex patterns.
    Masks emails, phone numbers, social security numbers, and account numbers.
    Personal names detection is skipped due to complexity (NER could be used).
    """
    # Define regex patterns for PII
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    phone_pattern = r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b'
    ssn_pattern = r'\b\d{3}-\d{2}-\d{4}\b'
    account_pattern = r'\b\d{10,16}\b'

    # Mask PII in the text
    text = re.sub(email_pattern, '[EMAIL]', text)
    text = re.sub(phone_pattern, '[PHONE]', text)
    text = re.sub(ssn_pattern, '[SSN]', text)
    text = re.sub(account_pattern, '[ACCOUNT]', text)

    return text

# Set up the Language Model (LLM) using Google Generative AI (Gemini API)
# Replace 'YOUR_API_KEY' with your actual Google API key
# In production, use environment variables (e.g., os.environ["GOOGLE_API_KEY"])

# Define a prompt template for the LLM
prompt_template = PromptTemplate(
    input_variables=["document", "query"],
    template="Document content (sensitive information masked):\n{document}\n\nUser query: {query}\n\nAnswer:"
)

# Create an LLM chain
chain = prompt_template | llm

# Function to answer user queries with privacy guard
def answer_query(document_text: str, user_query: str) -> str:
    """
    Answers user queries about the document while respecting privacy.
    Masks PII in the document text and refuses to reveal sensitive information explicitly.
    """
    # Validate query length to prevent abuse (arbitrary limit of 500 characters)
    if len(user_query) > 500:
        raise ValueError("Query too long. Maximum length is 500 characters.")

    # Mask PII in the document text
    masked_text = detect_and_mask_pii(document_text)

    # Check if the query attempts to reveal sensitive information
    forbidden_phrases = ["show full", "unmask", "reveal", "original email", "actual number"]
    if any(phrase in user_query.lower() for phrase in forbidden_phrases):
        return "Cannot reveal sensitive information."

    # Generate answer using the LLM chain with masked document text
    answer = chain.run(document=masked_text, query=user_query)
    # Ensure the answer doesn't inadvertently leak PII by re-masking
    answer = detect_and_mask_pii(answer)
    return answer

# FastAPI POST endpoint to upload document and query
@router.post("/upload")
async def upload_document(file: Optional[UploadFile] = File(None), query: str = Form(...)):
    """
    Endpoint to upload a document and ask a query about its content.
    Returns the answer in JSON format, with sensitive information masked.
    Limits file size to 10MB for practicality.
    """
    # Check file size (limit to 10MB)
    if not file is None:
        print(f"Received file: {file.filename}, type: {file.content_type}") 
        file_size = 0
        for chunk in file.file:
            file_size += len(chunk)
            if file_size > 10 * 1024 * 1024:  
                raise HTTPException(status_code=413, detail="File too large. Maximum size is 10MB.")
        file.file.seek(0)   

    try:
        # Parse the document content
        # document_text = parse_document(file)
        # # Get the answer to the user query
        # answer = answer_query(document_text, query)
        return {"answer": "answer"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

# To run the application:
# 1. Install dependencies: pip install fastapi uvicorn pdfplumber langchain google-generativeai
# 2. Replace "YOUR_API_KEY" with your actual Gemini API key
# 3. Run with: uvicorn main:app --reload