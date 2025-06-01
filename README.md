# Security Agent

 ⚠️**Disclaimer**: This repository may contain content or examples that are Not Safe For Work (NSFW) and are intended solely for testing and development purposes. Please review all code, documentation, and related resources thoroughly before using them in any professional, production, or public environments.

Repello Security Agent is an open-source tool designed to provide real-time security monitoring and threat mitigation for AI applications. It continuously scans AI inputs/outputs to detect vulnerabilities (e.g., prompt injections or jailbreak attempts) and enforce security policies. By providing continuous monitoring and mitigation, it helps keep GenAI applications secure in real time.

## Table of Contents
- [Security Agent](#security-agent)
  - [Table of Contents](#table-of-contents)
  - [Key Features](#key-features)
  - [Tech Stack](#tech-stack)
  - [Challenges](#challenges)
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
  - [Troubleshooting](#troubleshooting)

## Key Features
- **Interactive Chat Interface**: A responsive React-based frontend for real-time user interaction via a chat interface at `http://localhost:5173/chat`.
- **High-Performance Backend**: FastAPI provides a lightweight, asynchronous API with automatic Swagger UI and ReDoc documentation for easy endpoint testing.
- **Isolated Dependency Management**: Uses `uv` for efficient Python dependency management and virtual environments to ensure clean, reproducible setups.
- **CORS Support**: Configurable Cross-Origin Resource Sharing (CORS) for secure communication between the frontend and backend.
- **Modular Project Structure**: Organized directory structure with separate `client` and `server` folders for clear separation of concerns.
- **Hot Reloading**: Vite’s fast development server and FastAPI’s `--reload` option enable real-time updates during development.

## Tech Stack
- **Frontend**:
  - **React**: JavaScript library for building user interfaces.
  - **Vite**: Next-generation frontend tooling for fast development and optimized builds.
  - **TypeScript**: Adds static types to JavaScript for improved code reliability.
  - **Tailwind CSS** (optional, if used): Utility-first CSS framework for styling.
- **Backend**:
  - **FastAPI**: High-performance Python framework for building APIs with async support.
  - **Uvicorn**: ASGI server for running FastAPI applications.
  - **Python**: Version 3.10+ for backend logic and API development.
  - **uv**: Fast Python package and dependency manager.
- **Tools**:
  - **Git**: Version control for managing the codebase.
  - **npm/yarn**: Package managers for frontend dependencies.
  - **VS Code**: Recommended code editor for development.

## Challenges
- **CORS Configuration**: Ensuring proper CORS setup to allow frontend-backend communication, especially when running on different ports (e.g., `5173` for frontend, `8000` for backend).
- **Dependency Conflicts**: Managing Python dependencies with `uv` and ensuring compatibility with `pyproject.toml` configurations.
- **Port Conflicts**: Handling cases where default ports (`5173` or `8000`) are already in use, requiring manual port reassignment.
- **Environment Variable Management**: Correctly configuring and accessing environment variables in both frontend (with `VITE_` prefix) and backend.
- **TypeScript Integration**: Ensuring TypeScript types align with API responses from FastAPI for seamless frontend-backend integration.


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
GOOGLE_API_KEY="your-api-key" 
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

## Troubleshooting

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
 