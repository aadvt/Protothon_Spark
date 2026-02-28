# ⚡ Spark - College Placement SaaS

![Spark Banner](https://img.shields.io/badge/Status-Live-success?style=for-the-badge&logoColor=white) 
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) 
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) 
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Spark** is an elite, modern college placement platform designed to bridge the gap between verified student talent and premier recruiters. Moving beyond traditional, static, and self-proclaimed PDF resumes, Spark utilizes AI-driven skill verification and enforces strict placement cell governance.

Try now 👉 https://protothon-spark.vercel.app/
---

## 🚀 The Three Pillars of Spark

Spark is divided into three distinct, highly-tailored dashboards to serve the entire placement ecosystem.

### 1. 🎓 The Student Experience
The Student Dashboard acts as a dynamic academic portfolio and primary job portal. It allows candidates to move past static PDF resumes by showcasing their real-world code activity.

*   **AI Verification Layer:** Students link their GitHub and LeetCode usernames. Spark's backend AI Engine (Gemini 3 Pro) scans their commits and competitive problem-solving submissions to actively generate quantitative skill metrics (Frontend, Backend, DSA percentages).
*   **Skill Match Radar:** Based on their profile and linked accounts, a dynamic Skill Radar visualizes exactly where the student stands, while also summarizing their Placement Probability compared to the wider batch in real-time.
*   **Job Discovery & "Fit Score":** The portal scans the live database of active recruiter postings and filters matching opportunities. It displays exactly *why* the job is a match and how their skills stack up against the recruiter's rigorous demands.
*   **Upcoming Interviews:** Immediate visibility into technical reviews that recruiters have scheduled with them on the platform.

### 2. 💼 The Recruiter Experience
The Recruiter Dashboard is an algorithmic matching engine that allows companies to cleanly slice through student talent. It provides a structured mechanism to bypass poor resumes and look directly at an applicant's verified code capabilities and CGPA history.

*   **Algorithmic Filtering (Fit Score):** Students are ranked in a high-fidelity "Talent Pool" table via a dynamically calculated "Fit Score." This score evaluates the strict job requirements against the student's actual DSA, Backend, and Frontend percentages, weighted alongside their CGPA (out of 10.0).
*   **View Control & Scheduling:** Recruiters can instantly toggle the table view between "All Candidates" and "Scheduled Only." When they find a strong candidate, a single click opens a native modal to lock in an interview date and time without ever leaving the platform.
*   **Live Skill Dashboards:** The secondary "Candidates" tab allows recruiters to search the wider batch intuitively. Each student card includes verified tags, GPA, and dynamic action buttons to instantly "View Profile" payload or contact them.

### 3. 🛡️ The Admin (Placement Cell) Experience
The Admin Dashboard is the supreme "Control Room" for the entire software ecosystem. It evaluates, surveys, and controls the flow of candidates to matching industries through robust governance logic.

*   **Batch Intelligence & Analytics:** A global "Skill Heatmap" aggregates the raw AI verification data of the entire student batch. Admins can literally see if the whole class is failing in "System Architecture" and proactively fund a workshop before a major drive begins.
*   **Policy Manager:** Instantly toggle college-specific rules across the entire platform via interactive switches (e.g., Enable/Disable "Single Dream Offer", Freeze/Allow Resume Uploading, Toggle the Public Competitive Leaderboard).
*   **The Governance Layer & Exceptions:** Admins can manually grant bypasses for hard-policy restrictions. If a brilliant student missed the 8.0 CGPA cutoff due to a medical emergency, the Admin can click "Grant Exception", bypassing the filter so recruiters can see them.
*   **Audit Log Terminal:** Every single time an Admin triggers an exception or globally re-syncs the master database, the transparent audit ledger logs it with a timestamp, ensuring total accountability of the placement process.

---

## 🛠️ Tech Stack & Architecture

*   **Frontend:** Next.js (React Server Components), Tailwind CSS, Framer Motion, shadcn/ui, Recharts
*   **Backend & Database:** Supabase (PostgreSQL, Authentication), Next.js App Router (API Routes)
*   **AI Engine:** Google Gemini Pro (Codebase & Logic Verification)

---

## 🏃‍♂️ Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aadvt/Protothon_Spark.git
   cd Protothon_Spark
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   GITHUB_PAT=your_github_personal_access_token
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:3000`*
