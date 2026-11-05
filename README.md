# Cybersecurity Productivity OS

A full-stack personal operating system built with Next.js 16, TypeScript, Prisma (PostgreSQL), Clerk Authentication, and the Google Gemini API to manage a 22-week cybersecurity, Python scripting, and digital forensics learning sprint.

## Core Modules

- **Command Center Dashboard:** Real-time XP and level progression, 30-day GitHub-style activity heatmap, interactive Pomodoro focus timer, priority daily objectives, and upcoming application deadlines.
- **Task & Curriculum Engine:** Tracks 170+ structured daily, weekly, and monthly tasks across CompTIA Network+ (N10-009), Security+ (SY0-701), 90 Days of Cyber Security, 30 Days of Python, and Coursera specializations with direct resource links.
- **AI Synthesis Quiz & Mastery Exams:** Powered by Google Gemini with automatic multi-model fallback (`gemini-3.8-flash` -> `gemini-3.5-flash-lite` -> `gemini-3.7-flash`). Unlocks a combined 10-question Daily Synthesis Quiz once all daily tasks are completed, plus 50-question Weekly and 100-question Monthly Mastery Exams.
- **Cornell Revision Notes Generator:** Automatically synthesizes completed daily/weekly topics and local `TIL-Cybersecurity` logs into structured two-column Cornell Notes (`Cues / Keywords` | `Notes & Main Ideas` + `Summary`) for active recall.
- **Habit Streak Tracker & Cyber Journal:** Daily habit consistency tracking with streak calculations alongside a mood, energy, and technical reflection journal.
- **Portfolio Projects, DFIR Lab & Research Pipeline:** Kanban-style tracking for security engineering projects (`AutoShield Pakistan`, `ICD Vault`), Digital Forensics & Incident Response (DFIR) case studies, research papers, and global graduate fellowship applications.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Actions, Turbopack)
- **Language:** TypeScript, React 19
- **Database & ORM:** PostgreSQL (Neon / Supabase) + Prisma ORM
- **Authentication:** Clerk (`@clerk/nextjs`)
- **AI Integration:** Google Generative AI SDK (`@google/generative-ai`)
- **Styling & UI:** Tailwind CSS v4, Radix / Base UI primitives, Lucide Icons, Recharts, Framer Motion

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables (`.env.local`):**
   ```env
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
   CLERK_SECRET_KEY="sk_..."
   GEMINI_API_KEY="AIza..."
   ```

3. **Generate Prisma client & push schema:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
