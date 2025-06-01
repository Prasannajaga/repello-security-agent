# **Option 3: Document Analyzer with Privacy Guard**

 ⚠️**Disclaimer**: This repository may contain content or examples that are Not Safe For Work (NSFW) and are intended solely for testing and development purposes. Please review all code, documentation, and related resources thoroughly before using them in any professional or public environments.

This project was developed as part of an assignment for **RepelloAI**, focusing on building a **privacy-first, secure AI agent** capable of intelligent document processing with strong safeguards against unsafe or malicious inputs. 

## **Objective**
- **Scans documents** (including PDFs with embedded or scanned images)
- **Extracts text accurately**
- **Masks sensitive information** (such as emails, phone numbers, and addresses)
- **Prevents NSFW content** from being processed or returned
- **Protects against prompt injection attacks** or manipulative input patterns
 

## **Table of Contents**
- [**Option 3: Document Analyzer with Privacy Guard**](#option-3-document-analyzer-with-privacy-guard)
  - [**Objective**](#objective)
  - [**Table of Contents**](#table-of-contents)
  - [**Demo Video**](#demo-video)
  - [**Key Features**](#key-features)
  - [**Tech Stack**](#tech-stack)
  - [**Prerequisites**](#prerequisites)
  - [**Installation**](#installation)
    - [**Clone the Repository**](#clone-the-repository)
    - [**Frontend Setup (React Vite)**](#frontend-setup-react-vite)
    - [**Backend Setup (FastAPI)**](#backend-setup-fastapi)
  - [**Running the Application**](#running-the-application)
    - [**Running the Frontend**](#running-the-frontend)
    - [**Running the Backend**](#running-the-backend)
  - [**Environment Variables**](#environment-variables)
    - [**Backend**](#backend)
    - [**Frontend**](#frontend)
    - [**Project Structure**](#project-structure)
  - [**Troubleshooting**](#troubleshooting)
  - [**Challenges Faced**](#challenges-faced)
  - [**Final Thoughts**](#final-thoughts)


---

## **Demo Video**

🎬 **Watch the test case demo**:  

> [nsfw-content](https://drive.google.com/file/d/1BEpE2udFQSvfuF2murS5qZveN4bf-Tkf/view?usp=drive_link)
> 
> [nudity-content](https://drive.google.com/file/d/1cGoXCxNNeoQvnmnDzFa0nQpC19mVr0r7/view?usp=drive_link)
>
> [blood-content](https://drive.google.com/file/d/1v5f0HJOejt_TFRPPCFYEjKKVZi9qUXgp/view?usp=drive_link)
>
> [text-summarize](https://drive.google.com/file/d/1a_2ioB_Pz86BFsrFMojUJ5dwJ8tFMVxI/view?usp=drive_link) 
> 
> [image-text-pdf-summarize](https://drive.google.com/file/d/1Dp3YIV_5mIjx5C4832wPuuaPeMGytHyu/view?usp=drive_link) 
> 
> [prompt-injection-pdf](https://drive.google.com/file/d/1ihiZMir4CsK4RAKikvl1XFLhlKmNVyxL/view?usp=drive_link) 
> 
> [force-llm-to-break-instructions](https://drive.google.com/file/d/1AdPmdvaiTNeGWSRaVtQm7BEdZdcJcuad/view?usp=drive_link) 
> 
> [force-llm-to-break-instructions-2](https://drive.google.com/file/d/1P1qyHkl-znNjbdSVe6xf5vlnbVGRk5X8/view?usp=drive_link) 

---

## **Key Features**

- **Intelligent PDF Parsing (with Image Support):**  
  Supports parsing of both text-based and image-based PDFs. Images inside PDFs are converted to byte streams and passed to the LLM, enabling it to analyze visual content without needing traditional OCR.

- **Document Upload via Chat Interface:**  
  Users can paste or upload documents directly through a chat interface, allowing interactive and natural document analysis.

- **Confidential Data Masking (PII Redaction):**  
  Sensitive information such as emails, phone numbers, and addresses is automatically masked using `***` before being passed to the LLM, ensuring privacy-first document handling.

- **NSFW Content Filtering:**  
  Enforced using `safeSettings` and additional filters to prevent the generation or processing of NSFW or harmful content. Built for high-compliance environments.

- **Prompt Injection Protection:**  
  Secure system instructions and sanitation layers are used to defend against prompt injection attacks and malicious input manipulation.

- **Detailed Logging & Monitoring:**  
  Real-time logs are viewable from the side navigation menu, giving insights into system behavior, operations, and errors.

- **HTTP Error Handling:**  
  Implements descriptive and user-friendly error messages for various HTTP status codes, improving the debugging and support experience.

- **File Size Support (Up to 10MB):**  
  Currently optimized for files up to **10MB**. Plans for future enhancement to support larger file sizes are under consideration.

## **Tech Stack**
- **Frontend**:
  - **React**: JavaScript library for building user interfaces.
  - **Vite**: Next-generation frontend tooling for fast development and optimized builds.
  - **TypeScript**: Adds static types to JavaScript for improved code reliability.
  - **Tailwind CSS** (optional, if used): Utility-first CSS framework for styling.
  - **MarkdDown** to render the markdown text returned by gemini.
- **Backend**:
  - **FastAPI**: High-performance Python framework for building APIs with async support.
  - **Uvicorn**: ASGI server for running FastAPI applications.
  - **Python**: Version 3.10+ for backend logic and API development.
  - **uv**: Fast Python package and dependency manager.
  - **PyPDF2**: for parsing pdf efficiently
- **AI Tools**:
  - **Google Genai SDK**: used googleGenai sdk for handling content and file efficiently with safe mesaures.
  - **ChatGpt, Grok, Copilot & gemini**: build with help of this models

## **Prerequisites**

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v16 or higher) - [Download Node.js](https://nodejs.org/)
- **Python** (v3.10 or higher) - [Download Python](https://www.python.org/downloads/)
- **Git** - [Download Git](https://git-scm.com/downloads/)
- **uv** (fast Python package manager)
- **npm** (for managing frontend dependencies)
- A code editor like [VS Code](https://code.visualstudio.com/)

## **Installation**

Follow these steps to set up the project on your local machine.

### **Clone the Repository**

1. Open a terminal and clone the repository:
   ```bash
   git clone https://github.com/Prasannajaga/repello-security-agent
   cd repello-security-agent
   ```

### **Frontend Setup (React Vite)**

1. Navigate to the frontend directory (assuming it's in a folder named `client`):
   ```bash
   cd client
   ```

2. Install the required Node.js dependencies:
   Using npm:
   ```bash
   npm install
   ```
   Or using yarn:
   ```bash
   yarn install
   ```

3. Ensure Vite is installed as a dependency (it’s typically included in a Vite-based React project).

### **Backend Setup (FastAPI)**

1. Navigate to the backend directory (assuming it's in a folder named `server`):
   ```bash
   cd server
   ```

2. Create a virtual environment to isolate dependencies:
   ```bash
   uv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install the required Python dependencies:
   ```bash
   uv sync
   ```
   *Note*: Ensure you have a `pyproject.toml` file in the `server` directory. If not, install FastAPI and Uvicorn manually:
   ```bash
   uv init
   uv add fastapi uvicorn
   ```
 


## **Running the Application**

   ### **Running the Frontend**

   1. From the `client` directory, start the Vite development server:
      Using npm:
      ```bash
      npm run dev
      ```
      - make sure to run on default `http://localhost:5173`.
   
      Or using yarn:
      ```bash
      yarn dev
      ```

   2. The client will be available at `http://localhost:5173` by default. You can verify it’s running by visiting:
      - `http://localhost:5173/chat` for the Client Interaction
      -  Ensure the frontend is configured to communicate with the backend (e.g., API requests to `http://localhost:8000`). Check your frontend code for the correct API base URL, typically set in an environment variable or a configuration file.
   
      *Note*: If you're changing the port ensure you've given cors acess to your port

   ### **Running the Backend**

   1. From the `backend` directory, with the virtual environment activated, start the FastAPI server using Uvicorn:
      ```bash
      uvicorn main:app --reload
      ```
      - `main` is the name of your main Python file (e.g., `main.py`) containing the FastAPI app instance.
      - `--reload` enables auto-reload for development, so changes are reflected without restarting the server.

   2. The backend will be available at `http://localhost:8000` by default. You can verify it’s running by visiting:
      - `http://localhost:8000/docs` for the FastAPI interactive API documentation (Swagger UI).
      - `http://localhost:8000/redoc` for the ReDoc documentation.

   
## **Environment Variables**

To configure the application, you may need to set environment variables.

### **Backend**
Create a `.env` file in the `server` directory with the following (modify as needed):
``` 
GENAI_GOOGLE_API_KEY="your-api-key" 
```

### **Frontend**
Create a `.env` file in the `client` directory:
```
VITE_PORT=5173
```
*Note*: Vite requires environment variables to be prefixed with `VITE_` to be exposed to the frontend. Access them in your React code as `import.meta.env.VITE_API_URL`.

### **Project Structure**
```bash
   Directory structure:
└── prasannajaga-repello-security-agent/
    ├── README.md
    ├── client/
    │   ├── README.md 
    │   ├── public/
    │   └── src/
    │       ├── App.css
    │       ├── App.tsx
    │       ├── index.css
    │       ├── main.tsx 
    │       ├── assets/
    │       ├── pages/
    │       │   ├── indicator.tsx
    │       │   ├── logs.tsx
    │       │   ├── MainContent.tsx
    │       │   ├── mdFormatter.tsx
    │       │   ├── messageBubble.tsx
    │       │   ├── SideBar.tsx
    │       │   └── SiteBarItem.tsx
    │       ├── service/
    │       │   └── ApiService.ts
    │       ├── states/
    │       │   └── scroll.tsx
    │       └── store/
    │           └── chat.ts
    └── server/
        ├── README.md
        ├── pyproject.toml 
        ├── app/
        │   ├── main.py
        │   ├── __pycache__/
        │   └── routes/
        │       ├── document.py
        │       └── __pycache__/ 

```

## **Troubleshooting**

- **Backend not starting**: Ensure the virtual environment is activated and all dependencies are installed. Check for errors in the terminal output.
- **Frontend not connecting to backend**: Verify the API URL in your frontend code matches the backend’s address (`http://localhost:8000`). Check for CORS issues; ensure your FastAPI app allows requests from the frontend origin (e.g., `http://localhost:5173`).
  - Add CORS middleware in `main.py` if needed:
    ```python
    from fastapi.middleware.cors import CORSMiddleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    ```
- **Port conflicts**: If ports `8000` or `5173` are in use, change the ports in the backend (`uvicorn main:app --port 8001`) or frontend (`vite.config.js` or CLI option).
 

## **Challenges Faced**

- **Initial Detour with Option 1 – AI Research Assistant (High Weightage):**  
  Spent around **4 hours** trying to implement a research assistant using tools like **Google Cloud Search**, **SERP API**, and **Whoogle Search**. Unfortunately, most solutions were either paid or had restrictive limitations. While this path didn’t lead to a working outcome, it gave me valuable insights into how AI agents crawl, fetch, and synthesize information from the web.

- **Pivot to Option 3 – Document Analyzer with Privacy Guard:**  
  Switched gears to Option 3, and got the initial setup running within an hour. This track felt more manageable and aligned with the evaluation goals.

- **Learning & Implementing OCR from Scratch:**  
  OCR was a completely new domain. I spent time understanding different approaches, consulting documentation, and brainstorming ideas using **Grok** and **ChatGPT**. Eventually, a GitHub contributor pointed me to a practical solution that worked smoothly and fit the use case well.

- **Tried Multiple OCR Approaches:**  
  Experimented with tools like **pytesseract**, `PDFMinerLoader`, and `UnstructuredLoader` from **LangChain**. These required deep tweaking and are still under evaluation for better accuracy and performance.

- **Retrieval-Augmented Generation (RAG) Exploration:**  
  Started building a RAG pipeline using `GoogleGenAiEmbeddings` and `GooglePalmEmbeddings` with **ChromaDB** as the vector store. This is a work-in-progress as I continue fine-tuning embedding performance and retrieval relevance.

- **Thanks, Gemini!**  
  Huge shoutout to **Google Gemini 1.5 Flash** and **2.0 Flash** for being the horsepower behind much of the agent's reasoning. At one point, both decided to take an unexpected 20-minute break right in the middle of testing. AI burnout? Maybe. Still, major props to Google for offering these powerful models for free.


## **Final Thoughts**

Thanks to RepelloAI for giving me this opportunity — it truly pushed me beyond the comfort zone. This project tested my ability to think fast, build faster, and stay focused under pressure. From wrangling APIs to building a privacy-first document agent with masking and image-based PDF handling — every part of this build was a learning milestone.

I'm genuinely proud of where my skills stand today.

**P.S.** If you're checking this before EOD (not just at 6 PM 😉), there's a good chance that **RAG (Retrieval-Augmented Generation)** has already been implemented in the agent to better handle document flow and context retrieval. Stay tuned! it's only getting smarter! 

