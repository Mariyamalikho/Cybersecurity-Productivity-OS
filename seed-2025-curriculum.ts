import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found.");
    return;
  }

  // 1. New 2025 Learning Resources
  const newResources = [
    // Web Dev
    { title: "Scrimba (React & JS Interactive)", type: "PROGRAMMING", status: "NOT_STARTED", progress: 0, url: "https://scrimba.com/" },
    { title: "freeCodeCamp (Web Development)", type: "PROGRAMMING", status: "NOT_STARTED", progress: 0, url: "https://www.freecodecamp.org/" },
    { title: "MDN Web Docs (Reference)", type: "PROGRAMMING", status: "NOT_STARTED", progress: 0, url: "https://developer.mozilla.org/" },
    
    // Python
    { title: "Scrimba (Python Interactive)", type: "PROGRAMMING", status: "NOT_STARTED", progress: 0, url: "https://scrimba.com/" },
    { title: "Real Python (Tutorials)", type: "PROGRAMMING", status: "NOT_STARTED", progress: 0, url: "https://realpython.com/" },
    { title: "Python Tutor (Visualization)", type: "PROGRAMMING", status: "NOT_STARTED", progress: 0, url: "https://pythontutor.com/" },
  ];

  for (const r of newResources) {
    // Upsert to prevent duplicates if script is run multiple times
    const exists = await prisma.learningResource.findFirst({
      where: { userId: user.id, title: r.title }
    });
    if (!exists) {
      await prisma.learningResource.create({
        data: {
          userId: user.id,
          title: r.title,
          type: r.type,
          status: r.status,
          progress: r.progress,
          url: r.url
        }
      });
    }
  }

  // 2. New 2025 Priority Tasks (Roadmaps)
  const newTasks = [
    // Web Dev Roadmap
    { title: "Web Phase 1: Foundation (HTML, CSS, Flexbox)", category: "Web Dev 2025", dueDate: new Date("2026-09-30"), scope: "DAILY" },
    { title: "Web Phase 2: Interactivity (JS Basics, DOM)", category: "Web Dev 2025", dueDate: new Date("2026-10-31"), scope: "DAILY" },
    { title: "Web Phase 3: Real Projects (Git, DevTools)", category: "Web Dev 2025", dueDate: new Date("2026-11-30"), scope: "DAILY" },
    { title: "Web Phase 4: Frameworks (React/Vue Components)", category: "Web Dev 2025", dueDate: new Date("2026-12-31"), scope: "DAILY" },
    { title: "Web Phase 5: Expand (Node.js, APIs)", category: "Web Dev 2025", dueDate: new Date("2027-01-31"), scope: "DAILY" },

    // Python Roadmap
    { title: "Python Phase 1: Basics (Variables, Logic)", category: "Python 2025", dueDate: new Date("2026-09-30"), scope: "DAILY" },
    { title: "Python Phase 2: Loops & Functions (Scrimba)", category: "Python 2025", dueDate: new Date("2026-10-31"), scope: "DAILY" },
    { title: "Python Phase 3: Build & Save (File I/O, GitHub)", category: "Python 2025", dueDate: new Date("2026-11-30"), scope: "DAILY" },
    { title: "Python Phase 4: Focus Area (Flask / Pandas)", category: "Python 2025", dueDate: new Date("2026-12-31"), scope: "DAILY" },
    { title: "Python Phase 5: Connect (Refactoring, AI Tools)", category: "Python 2025", dueDate: new Date("2027-01-31"), scope: "DAILY" },
  ];

  for (const t of newTasks) {
    const exists = await prisma.task.findFirst({
      where: { userId: user.id, title: t.title }
    });
    if (!exists) {
      await prisma.task.create({
        data: {
          userId: user.id,
          title: t.title,
          category: t.category,
          dueDate: t.dueDate,
          scope: t.scope,
          status: "PENDING"
        }
      });
    }
  }

  console.log("Successfully appended the 2025 Web Dev and Python roadmaps to your live database!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
