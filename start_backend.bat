@echo off
title Healthcare AI - Backend Server
color 0A

echo ============================================================
echo   Healthcare AI Backend - Local Development Server
echo   Live site: https://healthcare-ai-bice.vercel.app/
echo ============================================================
echo.

:: ---- Navigate to backend folder ----
cd /d "%~dp0backend"

:: ---- Check if Python is installed ----
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.10+ from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

echo [OK] Python found:
python --version
echo.

:: ---- Check/Create virtual environment ----
if not exist "venv\" (
    echo [INFO] Creating virtual environment...
    python -m venv venv
    echo [OK] Virtual environment created.
) else (
    echo [OK] Virtual environment already exists.
)
echo.

:: ---- Activate virtual environment ----
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat
echo [OK] Virtual environment activated.
echo.

:: ---- Upgrade pip ----
echo [INFO] Upgrading pip...
python -m pip install --upgrade pip --quiet
echo.

:: ---- Install dependencies ----
echo [INFO] Installing dependencies from requirements.txt...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies. Check requirements.txt and try again.
    pause
    exit /b 1
)
echo.
echo [OK] All dependencies installed.
echo.

:: ---- Check for .env file ----
if not exist ".env" (
    echo [WARNING] No .env file found in backend folder!
    echo.
    echo Creating .env from .env.example...
    copy ".env.example" ".env" >nul
    echo.
    echo ============================================================
    echo  IMPORTANT: Open backend\.env and fill in your API keys:
    echo  - OPENAI_API_KEY=sk-...
    echo  - CHROMA_PERSIST_DIR=./chroma_store
    echo  - EMBEDDING_MODEL=text-embedding-3-small
    echo  - LLM_MODEL=gpt-4o-mini
    echo ============================================================
    echo.
    echo Press any key once you have updated the .env file...
    pause >nul
) else (
    echo [OK] .env file found.
)
echo.

:: ---- Start the FastAPI server ----
echo ============================================================
echo  Starting FastAPI backend on http://localhost:8000
echo  API Docs available at: http://localhost:8000/docs
echo  Health check at:       http://localhost:8000/health
echo.
echo  Press Ctrl+C to stop the server.
echo ============================================================
echo.

uvicorn main:app --host 0.0.0.0 --port 8000 --reload

:: ---- If server exits ----
echo.
echo [INFO] Server stopped.
pause
