# LifeDoc - "Hack The Winter" Submission Packet

> **Team:** [Your Team Name]
> **Track:** Health & Wellness (Active Guardian)
> **Deployed URL:** [https://lifedoc.vercel.app](https://your-deployment-link.com)
> **Demo Video:** [YouTube Link Here](https://youtube.com)

---

## 🎯 Why This Project Wins? (Judging Criteria)
*   **Innovation:** We moved beyond simple text chat. We use **Computer Vision** to digitize handwritten prescriptions and **Context-Injection** for personalized AI advice.
*   **Impact:** Solves real problems for the **Elderly (70+)** and **Rural** populations (Audio output, Plain English reports).
*   **Feasibility:** Fully functional Round 1 prototype with a realistic, phased roadmap for Round 2.

---

## 📚 Technical Documentation Hub
We have prepared detailed documentation to respect the judges' time:

1.  **[System Architecture & Data Flows](docs/TECHNICAL_FLOWS.md)** (Updated with ERD & Rx Pipeline)
    *   *See how we handle Image Stream Processing & Secure Auth.*
2.  **[Round 2: "The Slingshot" Roadmap](docs/ROUND2_PLAN.md)**
    *   *Our 8-point strategy including Emergency SOS & Blockchain.*
3.  **[Main Project README](README.md)**
    *   *Full installation guide and feature breakdown.*

---

## 🚀 How to Test the Prototype (Round 1)

### 1. **Login System**
*   **Email:** `demo@lifedoc.com` (or sign up with any email)
*   **OTP:** Use specific OTP `123456` (if running locally in dev mode) or check console.

### 2. **Test the "Prescription Lens"**
*   Go to **Dashboard > New Prescription**.
*   Upload a sample prescription image.
*   *Watch it extract medicine names automatically!*

### 3. **Test "Dr. Gemini"**
*   Go to **Consultation**.
*   Type: *"I have a splitting headache and see flashing lights."*
*   *Observe the "High Urgency" warning.*

---

## 🛠️ Tech Stack Highlights
*   **Frontend:** Next.js 16 (App Router), Tailwind CSS v4
*   **Backend:** Express.js v5, Node.js
*   **Database:** MongoDB Atlas (Mongoose v9)
*   **AI Engine:** Google Gemini 1.5 Flash + GPT-4o Vision

---
*Submitted for Hack The Winter 2025*
