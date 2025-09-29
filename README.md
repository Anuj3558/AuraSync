# 🤖 AI-Powered Interview Assistant

An *AI-powered interview assistant* that automates candidate evaluation by parsing resumes, collecting missing fields, conducting timed interviews, scoring answers, and generating AI-driven summaries for recruiters.  

The platform provides two views:  
- *Interviewee Tab* → Resume upload, missing info collection, timed interview Q&A, AI scoring & summary.  
- *Interviewer Tab* → Dashboard with candidate list, search/sort, detailed profiles & AI summaries.  

---

## 🚀 Features

- 📄 Resume upload (PDF/DOCX) & parsing  
- 🧑‍💻 Chatbot-driven missing field collection  
- ⏱ Timed interview questions (20s, 60s, 120s)  
- 🤖 AI-powered question generation & scoring  
- 📝 AI-generated candidate summary  
- 📊 Interviewer dashboard with search/sort  
- 🔄 State persistence across refresh & reopen  
- 💻 Responsive design for desktop & mobile  

---

## 📌 Problem Statement

Recruiters face challenges with *manual interviews*:
- Time-consuming  
- Subjective & inconsistent  
- Difficult to scale  

*AI provides*:
- Fair evaluation  
- Automated Q&A and scoring  
- Scalable solution  

---

## 🏗 System Workflow

![System Workflow Diagram]([https://via.placeholder.com/800x400?text=System+Workflow+Diagram](https://github.com/Anuj3558/AuraSync/blob/main/Candidate%20Interview%20and%20Recruiter%20Dashboard%20System%20-%20visual%20selection%20(1).png))

*Flow*:  
Resume Upload → Missing Info → Timed Q&A → AI Scoring → AI Summary → Dashboard  

---

## 🏛 Architecture

![System Architecture Diagram](https://via.placeholder.com/800x400?text=System+Architecture+Diagram)

- *Frontend*: React + Vite  
- *UI*: TailwindCSS + Shadcn/UI + Ant Design  
- *State Management*: Redux Toolkit + redux-persist  
- *Persistence*: IndexedDB + LocalStorage  
- *AI Integration*: OpenAI API (Q&A, scoring, summaries)  
- *Resume Parsing*: pdf.js, mammoth.js  

---

## 🛠 Tech Stack

- *Frontend* → React (Vite)  
- *State Management* → Redux Toolkit + redux-persist  
- *UI* → TailwindCSS, Shadcn/UI, Ant Design  
- *AI APIs* → OpenAI (question generation, scoring, summaries)  
- *Resume Parsing* → pdf.js, mammoth.js  
- *Persistence* → IndexedDB, LocalStorage  

---

## 🔎 Detailed Features

### 1️⃣ Resume Upload & Extraction
- Supports .pdf & .docx  
- Extracts name, email, phone  
- Handles invalid/unsupported files  

### 2️⃣ Missing Fields Handling
- Chatbot collects missing details (e.g., email, phone)  

### 3️⃣ Interview Flow
- AI generates *3 difficulty-based questions* (easy → medium → hard)  
- Timers per question → 20s, 60s, 120s  
- Auto-submit on timeout  
- AI evaluates answers and assigns scores  
- Final AI-generated candidate summary  

![Interview Sequence Diagram](https://via.placeholder.com/800x400?text=Interview+Sequence+Diagram)

### 4️⃣ Interviewee Tab (Chat)
- Chat UI with bot-style question delivery  
- Timer integrated in chat bubble  
- Progress bar for tracking questions  

### 5️⃣ Interviewer Tab (Dashboard)
- Candidate list with *name, score, summary*  
- Profile view → detailed Q&A + AI evaluation  
- Search & sort by score, date, name  

### 6️⃣ Data Persistence 
- Restores session on refresh/reopen  
- Displays “Welcome Back” modal  

---


