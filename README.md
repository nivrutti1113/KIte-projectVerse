# KITE ProjectVerse — STEM Hands-On Innovation Platform
> **"Learn on KITE LMS. Build on ProjectVerse. Showcase your skills."**

KITE ProjectVerse is a production-grade, practical project-building platform developed by KITE Robotics for Indian STEM students in Classes 3–12. It bridges classroom theory with real physical builds in autonomous robotics, embedded electronics, IoT, Python data analytics, and artificial intelligence.

---

## 🌟 Key Features

### 1. Project Discovery & Library
- **Categorized STEM Catalog:** Robotics, Electronics, Arduino & Microcontrollers, Coding & Python, Artificial Intelligence, and Internet of Things.
- **NEP 2020 & ATL Ready:** Mapped to Indian school grade bands, CBSE, ICSE, and Atal Tinkering Lab mandates.
- **Full Build Metadata:** Estimated build hours, cost in INR, component lists, safety protocols, and troubleshooting guides.

### 2. Student Workspace Studio
- **Step-by-step Assembly Guidance:** Interactive instructions with circuit notes and component checklists.
- **Embedded Browser Code Editor:** Full syntax highlighting for Python, Arduino C++, and JavaScript. Auto-save, revision history, download code file (`.py`, `.ino`, `.js`), and safe client simulation.
- **AI STEM Mentor:** Integrated Google Gemini server-side route handler with rate-limiting, minor-safe prompt engineering, and offline intelligent fallback engine for circuit and code diagnostics.

### 3. Submission & 6-Point Mentor Rubric Review
- **End-to-End Evaluation Workflow:** Students submit project explanations, code snapshots, reflections, and video demonstration links.
- **Teacher Rubric Matrix:** Mentors grade builds across 6 criteria:
  1. Working Functionality & Evidence (0-5)
  2. Concept Understanding (0-5)
  3. Code/Build Quality (0-5)
  4. Creativity & Problem Solving (0-5)
  5. Explanation & Documentation (0-5)
  6. Safety & Responsible Implementation (0-5)
- **Automatic Badge Engine:** Approving a submission awards verified digital badges (e.g. *Robotics Pioneer*, *Code Commander*, *Green Innovator*).

### 4. Child-Safe Digital Maker Portfolios
- **DPDP Act (2023) Aligned:** Private-by-default for minors. Real student names, school names, and contact details are masked unless explicitly opted into.
- **Shareable Showcase:** Highlights verified completed builds, scores, badges, and engineering skills.

### 5. Multi-Tenant School & Teacher Portal
- **Class Group Management:** Generate student join codes (`ROBOT8A`, `AILAB9B`).
- **Capstone Assignments:** Post project assignments with deadlines and points.
- **Atal Tinkering Lab Reports:** One-click CSV export of cumulative build hours and domain distribution for school audits.

### 6. Administration & Governance
- **Central Project Catalog Admin:** Create, edit, publish, or delete official projects.
- **Partner School Management:** Manage CBSE/ICSE institutional tenant accounts.
- **Audit Logging:** Immutable administrative audit logs for compliance.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 with KITE STEM dark mode palette
- **Icons:** Lucide React
- **Validation:** Zod schemas
- **Database & Auth:** Supabase PostgreSQL with complete Row Level Security (RLS) migrations
- **Testing:** Vitest automated unit & integration testing
- **Payments:** Razorpay checkout integration with server-side signature verification

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js v20+ or v22+
- npm v10+

### 2. Installation
```bash
git clone <repo-url>
cd "Kit Projectverse"
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(The application is equipped with an intelligent fallback repository and test sandboxes so every single route, button, submission, grading rubric, and AI mentor feature runs out of the box even before cloud credentials are added!)*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Automated Tests
```bash
npm test
```

### 6. Run Production Build
```bash
npm run build
```

---

## 🎭 One-Click Demo Personas
You can switch roles anytime using the top bar role switcher or on the `/login` page:
- **🎓 Student Maker:** `student@kite.test` (Aarav Sharma, Class 8)
- **👩‍🏫 Teacher / Mentor:** `teacher@kite.test` (Priya Raman, Lead Robotics Educator)
- **🏫 School Admin:** `schooladmin@kite.test` (Vikram Seth, Principal)
- **⚡ KITE Admin:** `admin@kite.test` (Central Curriculum & Platform Administrator)

---

## 🗄️ Database Migrations (Supabase)

The production PostgreSQL database migration and seed scripts are located in:
- `supabase/migrations/20261021000000_kite_projectverse_init.sql` (24 relational tables + indexes + Row Level Security policies)
- `supabase/seed.sql` (Starter badges, plans, and partner schools)

To apply to your live Supabase project:
```bash
supabase db push
# or run the SQL script directly in the Supabase Dashboard SQL Editor
```

---

## 📄 License & Child Safety
Developed by KITE Robotics Education Private Limited. All rights reserved.
Complies with India's Digital Personal Data Protection (DPDP) Act, 2023.
