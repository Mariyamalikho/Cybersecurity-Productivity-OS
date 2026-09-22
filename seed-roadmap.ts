import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found. Please log in first.");
    return;
  }

  // Habits (Daily Reminders)
  const habits = [
    { name: "GitHub Consistency: Push Code", category: "Core Strategy", priority: "High" },
    { name: "Log Cyber Hygiene / Journal", category: "Documentation", priority: "Medium" },
    { name: "IELTS Immersion / English Media", category: "Language", priority: "Medium" },
    { name: "Check Master's Milestones", category: "Study Abroad", priority: "High" },
    { name: "TryHackMe / CTF Lab (1.5 hrs)", category: "Hands-on", priority: "High" },
  ];

  for (const h of habits) {
    await prisma.habit.create({
      data: {
        userId: user.id,
        name: h.name,
        category: h.category,
        priority: h.priority,
      }
    });
  }

  // Tasks (Roadmap Milestones)
  const tasks = [
    { title: "Complete Python for Everybody Basics", category: "Phase 1: Foundations", dueDate: new Date("2026-09-15") },
    { title: "Finish Google IT Support Cert", category: "Phase 1: Foundations", dueDate: new Date("2026-09-30") },
    { title: "Start IBM / Microsoft SecOps Analyst", category: "Phase 2: Cyber Core", dueDate: new Date("2026-10-15") },
    { title: "Complete TryHackMe Defensive Security", category: "Phase 2: Cyber Core", dueDate: new Date("2026-11-15") },
    { title: "Build AutoShield Pakistan Prototype", category: "Phase 3: Projects", dueDate: new Date("2026-12-15") },
    { title: "Build ICD Vault MVP", category: "Phase 3: Projects", dueDate: new Date("2026-12-30") },
    { title: "Draft SOP & Research Paper", category: "Phase 4: Master's", dueDate: new Date("2027-01-15") },
    { title: "Submit University Applications for Fall 2027", category: "Phase 4: Master's", dueDate: new Date("2027-01-31") },
  ];

  for (const t of tasks) {
    await prisma.task.create({
      data: {
        userId: user.id,
        title: t.title,
        category: t.category,
        dueDate: t.dueDate,
      }
    });
  }

  console.log("Successfully seeded roadmap habits and tasks!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
