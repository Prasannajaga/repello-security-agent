from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter 
from langchain_community.vectorstores import Chroma 
from langchain_google_genai import ChatGoogleGenerativeAI 
from langchain.chains import RetrievalQA
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.prompts import PromptTemplate
from fastapi import UploadFile
import tempfile
import shutil   
import os
from dotenv import load_dotenv

 
load_dotenv()


os.environ["GOOGLE_API_KEY"] =  str(os.getenv("GENAI_GOOGLE_API_KEY"))
 
 

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    task_type="RETRIEVAL_DOCUMENT"
)

async def load_rag_template(file: UploadFile):
    """
    Load the RAG template for processing PDF documents and user queries.
    This function initializes the necessary components for document loading,
    text splitting, and embedding generation.
    """  
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp:
        shutil.copyfileobj(file.file, temp)
        temp_path = temp.name

    # Load and split PDF
    loader = PyPDFLoader(temp_path)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = splitter.split_documents(documents)

    vectordb = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory="D:\chromaDb"
    )

    vectordb.persist() 
    print("RAG template loaded and ChromaDB initialized.")

    # Initialize Gemini embedding



async def retrieve_rag_template(query: str):
    # Reload vectordb

    vectordb = Chroma(
        persist_directory="D:\chromaDb",
        embedding_function=embeddings
    )

    retriever = vectordb.as_retriever(search_kwargs={"k": 3})

    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.7 
    )

    prompt_template = """
    You are a helpful assistant. Use the following context to answer the user's question accurately.
    If the context does not contain enough information, rely on your general knowledge but indicate that the information is not from the provided context.

    Context:
    {context}

    Question: {question}

    Answer:
    """
    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["context", "question"]
    )

    # Step 7: Create the RAG chain
    rag_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        chain_type_kwargs={"prompt": prompt}
    )
 
    result = rag_chain.run(query)
    print("Query:", query)
    print("Answer:", result)

    # Optional: Persist the ChromaDB database
    vectordb.persist()
 
    return result