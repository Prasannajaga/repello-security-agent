import re
import tempfile
import shutil
from fastapi import  UploadFile, File
# from langchain.document_loaders import PyPDFLoader , PDFPlumberLoader , PDFMinerLoader
# from app.template.rag import load_rag_template , retrieve_rag_template

async def sanitize_for_llm(reader, page_number, query) -> tuple:
    """
    Sanitizes PDF page content and query text for LLM processing. 

    Args:
    - reader: The PdfReader object
    - page_number (int): The page number to extract
    - query (str): The user query text
    - content_type (str): MIME type of the document (default: application/pdf)
    - max_page_limit (int): Maximum allowed pages in the PDF
    - max_text_length (int): Maximum length of extracted text

    Returns:
    - tuple: (types.Content object, None if sanitization fails)
    """

    # Validate reader
    # if not isinstance(reader, PdfReader):
    #     print("Invalid reader: Must be a PdfReader object.")
    #     return None

    # Validate page_number
    # if not isinstance(page_number, int):
    #     print("Invalid page_number: Must be an integer.")
    #     return None

    total_pages = len(reader.pages) 

    if page_number < 0 or page_number >= total_pages:
        print(f"Page {page_number} is out of range. This PDF has {total_pages} pages.")
        return None
 
    # Sanitize query text
    if not isinstance(query, str):
        print("Invalid query: Must be a string.")
        return None

    sanitized_query = re.sub(r'[\x00-\x1F\x7F-\x9F]', '', query)  # Remove control characters
    sanitized_query = re.sub(r'[\n\r\t]+', ' ', sanitized_query).strip()  # Normalize whitespace

    # Check for suspicious patterns in query
    suspicious_patterns = [r'```', r'<\s*script', r'[\{\}$$  $$;]', r'prompt\s*\(']
    # for pattern in suspicious_patterns:
    #     if re.search(pattern, sanitized_query, re.IGNORECASE):
    #         raise ValueError("Suspicious content detected in query.")

    # Extract and sanitize text from PDF page
    try:
        page = reader.pages[page_number]
        text = page.extract_text() or ""
        print(f"Extracted text from page {page_number}: {text[:100]}...")  # Print first 100 characters for debugging
    except Exception as e:
        print(f"Error extracting text from page {page_number}: {str(e)}")
        return None

    sanitized_text = re.sub(r'[\x00-\x1F\x7F-\x9F]', '', text)
    sanitized_text = re.sub(r'[\n\r\t]+', ' ', sanitized_text).strip() 

    for pattern in suspicious_patterns:
        if re.search(pattern, sanitized_text, re.IGNORECASE):
            raise ValueError("Suspicious content detected in doc text.") 

  
    return sanitized_text , sanitized_query 




async def load_pdf(file: UploadFile = File(...)):
    # Save file to a temporary location
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp:
        shutil.copyfileobj(file.file, temp)
        temp_path = temp.name

    # await load_rag_template(temp_path)
    # response = await retrieve_rag_template(query="What is the content of this PDF?")
    # print(f"Response from RAG: {response}")

    # Load PDF using LangChain's PyPDFLoader
    # loader = PyPDFLoader(temp_path)
    # split_docs = loader.load_and_split()

    # # Prepare response: text per chunk
    # chunks = [{"page": i + 1, "content": doc.page_content.strip()} for i, doc in enumerate(split_docs)]

    # print(f"PYDFLoader {chunks} chunks from PDF.")  

    # loader2 = PDFPlumberLoader(temp_path)
    # split_docs2 = loader2.load_and_split()
    # chunks2  = [{"page": i + 1, "content": doc.page_content.strip()} for i, doc in enumerate(split_docs2)]

    # print(f"PYPLumber {chunks2} chunks from PDF.")  

    # loader3 = PDFMinerLoader(temp_path)
    # split_docs3 = loader3.load_and_split()
    # chunks3  = [{"page": i + 1, "content": doc.page_content.strip()} for i, doc in enumerate(split_docs3)]

    # print(f"PDFMIneLoader {chunks3} chunks from PDF.")  


    return {"chunks": ""}