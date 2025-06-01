from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.document import router as document_router



app = FastAPI()


app.include_router(document_router, prefix="/document") 

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI with uv!"}


@app.get("/logs")
def read_logs(): 
    with open("app/server.log", "r") as log_file:
        logs = log_file.readlines()
    
    return {"logs": logs}

origins = [
    "http://localhost:5174",   
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] for all
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Authorization, Content-Type, etc.
) 
 