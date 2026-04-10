# 🥗 NutriTrack

A full-stack nutrition tracking web app built with MERN stack + Python Flask.

## Features
- 📸 Log meals with photos
- 🔍 Search foods and get nutrition data
- 📊 Dashboard with calorie and macro charts
- 🩸 Deficiency tracker (Iron, Omega-3, Vitamin D, etc.)
- 💡 Personalised food suggestions based on deficiencies
- 🥦 Veg / Eggetarian / Non-veg diet support
- 💧 Water intake tracker

## Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB
- **ML Service:** Python + Flask + USDA API
- **Database:** MongoDB (local)

## Setup Instructions

### 1. Clone the repo
git clone https://github.com/pansuriyapallavi9-arch/NutriTrack.git
cd nutritrack

### 2. Server setup
cd server
npm install
Create .env file with:
PORT=5000
MONGO_URI=mongodb://localhost:27017/nutritrack
JWT_SECRET=nutritrack_super_secret_key_2024

### 3. Client setup
cd client
npm install

### 4. ML Service setup
cd ml-service
python -m venv venv
venv\Scripts\activate
pip install flask flask-cors requests python-dotenv pandas
Create .env file with your USDA API key

### 5. Run the app
Terminal 1: cd server && npm run dev
Terminal 2: cd client && npm run dev
Terminal 3: cd ml-service && venv\Scripts\activate && python app.py
