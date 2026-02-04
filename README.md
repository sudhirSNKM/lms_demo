# ACE Lead Management System

A futuristic, glassmorphic functionality web application for managing sales leads with real MongoDB data persistence.

## Project Structure

- `backend/` - Node.js + Express + MongoDB API
- `frontend/` - HTML5 + Vanilla CSS + JS Client

## Prerequisites

1. **MongoDB**: Ensure you have MongoDB installed and running locally on port `27017`.
2. **Node.js**: Ensure Node.js is installed.

## Setup Instructions

### 1. Backend Setup

1. Open a terminal in the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the database (Creates initial Admin and User):
   ```bash
   node seeder.js -i
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   *Server runs on http://localhost:5000*

### 2. Frontend Setup

1. Simply open `frontend/index.html` in your browser.
   *Or use Live Server extension in VS Code for better experience.*

## Credentials

**Admin:**
- Email: `admin@ace.com`
- Password: `password123`

**Sales User:**
- Email: `user@test.com`
- Password: `password123`

## Features

- **Authentication**: JWT-based login with role protection.
- **Dashboard**: Real-time stats fetched from MongoDB.
- **Leads CRUD**: Create, Read, Update, Delete leads permanently.
- **UI**: Modern Dark Glassmorphism design.
