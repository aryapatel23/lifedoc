# 🏥 LifeDoc: The AI-Powered Family Health Guardian

<!-- LLM-OPTIMIZED-SUMMARY-START -->
> **Project Name:** LifeDoc
> **Hackathon:** Hack The Winter: The Second Wave (Angry Bird Edition)
> **Track:** Health & Wellness
> **Submission Type:** Round 1 Prototype
> **Key Tech Stack:** Next.js 16, Express, MongoDB, Google Gemini 1.5 Flash, GPT-4o Vision, Redux Toolkit.
> **Unique Selling Point (USP):** Active AI Health Guardian for Families with specialized Prescription Digitization.
<!-- LLM-OPTIMIZED-SUMMARY-END -->

![LifeDoc Banner](https://via.placeholder.com/1200x350?text=LifeDoc+Health+Guardian+System)

## 📋 Executive Summary
**Problem:** Healthcare data is fragmented and unintelligible to patients. Families lack a centralized system to proactively monitor the health of elderly members.
**Solution:** LifeDoc is an AI-first platform that centralizes records, translates medical jargon into plain English using Gemini AI, and provides real-time risk analysis for family guardians.

---

## 🌟 Key Features

### 1. 🗣️ AI Speak & Voice Interaction (Accessibility First)
> *"Technology should adapt to people, not the other way around."*
*   **Text-to-Speech:** After analyzing a prescription, the app **speaks out** the instructions (e.g., *"Take the white tablet after dinner"*).
*   **Voice Commands:** Users can simply speak to the app ("I have a headache") instead of typing, making healthcare accessible to the 70+ demographic.

### 2. 🤖 Dr. Gemini (Intelligent Symptom Triage)
*   **Context-Injection:** Acts like a sensible Family Doctor, knowing your age, gender, and history to give personalized advice.
*   **Outcome:** Reduces anxiety by clearly stating risk levels and immediate actions.

### 3. 💊 Smart Prescription Lens (Computer Vision)
*   Scan paper prescriptions using **GPT-4o Vision**.
*   Digitizes into a **Structured Schedule** (Morning/Afternoon/Night) and sets auto-reminders.

### 4. 🛡️ Family Health Dashboard (The Guardian)
*   **Shared Family View:** See your family's health trends from anywhere.
*   **Proactive Alerts:** AI warns the family group *before* a health crisis happens based on trend analysis.

### 5. 🔬 Smart Lab Reports (Jargon Translator)
*   Translates complex lab values (e.g., "HbA1c: 7.2") into **Plain English** explanations and actionable advice.

---

## 📁 Project Structure

The project is divided into two main parts: a **Client** (Frontend) and a **Server** (Backend).

```
LifeDoc/
├── client/                 # Frontend Application (Next.js 16)
│   ├── src/
│   │   ├── app/           # App Router Pages
│   │   ├── components/    # Reusable UI Components
│   │   ├── store/         # Redux State Management
│   │   └── services/      # API Service Calls
│   └── package.json
│
├── server/                 # Backend API (Express.js)
│   ├── routes/            # API Route Definitions
│   │   ├── ai.js          # AI Analysis Routes
│   │   ├── auth.js        # Authentication Routes
│   │   └── ...            # Other Feature Routes
│   ├── models/            # Mongoose Database Models
│   ├── controllers/       # Request Logic Handlers
│   └── package.json
│
└── README.md              # Project Documentation
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | **Next.js 16** (App Router), **Redux Toolkit** (State), **Tailwind CSS v4** (Styling) |
| **Backend** | **Node.js**, **Express.js v5**, **JWT** (Secure Auth) |
| **Database** | **MongoDB Atlas** (Mongoose ODM) |
| **AI Models** | **Google Gemini 1.5 Flash** (Text/Analysis), **GPT-4o** (Vision) |
| **Cloud** | **Cloudinary** (Secure Image Storage), **Vercel** (Deployment) |

---

## ⚙️ How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/LifeDoc.git
cd LifeDoc
```

### 2. Backend Setup
Navigate to the `server` directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following keys:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_for_jwt
# AI Providers
GEMINI_API_KEY=your_google_gemini_api_key
OPENAI_API_KEY=your_openai_api_key_for_vision
# Image Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Email Service
EMAIL_USER=your_email_for_nodemailer
EMAIL_PASS=your_email_app_password
```

Start the Development Server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal, navigate to the `client` directory and install dependencies:
```bash
cd client
npm install
```

Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the Frontend Application:
```bash
npm run dev
# Application runs on http://localhost:3000
```

---

## 🔌 API Overview

Core endpoints managed by the Express server:

### Authentication (`/api/auth`)
*   `POST /register` - Create a new user account.
*   `POST /login` - Authenticate user and receive JWT.

### AI Services (`/api/ai`)
*   `POST /analyze` - Analyzes symptoms using Gemini 1.5 Flash.
*   `POST /analyze-image` - Processes medical images/reports.

### Health Records (`/api/measurements`, `/api/lab-reports`)
*   `GET /` - Fetch user's health history.
*   `POST /` - Log new measurements or upload reports.

### Family (`/api/family`)
*   `POST /add` - Add a family member.
*   `GET /overview` - Get health overview of linked family members.

To explore all routes, check the `server/routes` folder.

---

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 👥 The Team
*   **Mohit Soni**: AI Integration & Backend Architecture
*   **Arya Patel**: Frontend UI/UX & State Management
*   **Ishita Trivedi**: Database Design & Documentation
*   **Visha Trivedi**: Database Design & Documentation

---
*Built with ❤️ for generic health & wellness.*
