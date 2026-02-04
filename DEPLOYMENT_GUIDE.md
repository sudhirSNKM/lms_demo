# Why Vercel Deployment Fails (Mixed Content Error)

You are seeing a "Mixed Content Error" or "Connection Refused" on Vercel because of how this project is architected.

## The Architecture
- **Frontend (UI)**: Hosted on Vercel (Cloud). Connection is **HTTPS** (Secure).
- **Backend (API)**: Running on your Laptop. Connection is **HTTP** (Insecure).
- **Database**: Running on your Laptop (JSON file).

## The Problem
Web Browsers (Chrome, Edge, etc.) strictly **BLOCK** a secure website (HTTPS) from talking to an insecure local server (HTTP). This is a non-negotiable security feature of the internet.

## The Solution: Run Locally
Since you requested a project with **Real Data** but generated it **locally**, the application is designed to run on your machine.

1. **Keep the Backend Running**:
   ```bash
   cd backend
   npm run dev
   ```
2. **Open the Frontend Locally**:
   - Go to `frontend/index.html` on your computer.
   - Right-click and choose **"Open with Live Server"** (if using VS Code) OR simply double-click the file.
   - The app will connect instantly and log you in.

## How to Fix for Cloud (Advanced)
If you require the Vercel link to work for others, you must move the Backend to the Cloud too.

1. **Database**: Create a free MongoDB Atlas account.
2. **Backend**: 
   - Push the `backend` folder to a separate GitHub repo.
   - Deploy it to **Render.com** or **Railway.app**.
3. **Connect**:
   - Get the URL from Render (e.g., `https://my-ace-api.onrender.com`).
   - Update `frontend/js/api.js`:
     ```javascript
     const API_URL = 'https://my-ace-api.onrender.com/api';
     ```
   - Update `frontend/js/app.js` (Auto-login URL).
