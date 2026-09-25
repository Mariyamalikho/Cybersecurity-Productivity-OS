import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found. Please sign in once before running the seed script.");
    return;
  }

  // 1. Seed Core Daily Habits
  const habits = [
    { name: "GitHub Consistency: Push Code", category: "Core Strategy", priority: "High" },
    { name: "Log Cyber Hygiene / Journal", category: "Documentation", priority: "Medium" },
    { name: "TryHackMe / CTF Lab (1.5 hrs)", category: "Hands-on", priority: "High" },
  ];

  for (const h of habits) {
    const exists = await prisma.habit.findFirst({ where: { userId: user.id, name: h.name } });
    if (!exists) {
      await prisma.habit.create({
        data: { userId: user.id, name: h.name, category: h.category, priority: h.priority }
      });
    }
  }

  // 2. Seed 90 Days of Cyber & 30 Days of Python Tasks with Resource URLs
  const startDay = new Date(Date.UTC(2026, 10, 5));
  const tasks = [];

  for (let i = 1; i <= 90; i++) {
    const dueDate = new Date(startDay);
    dueDate.setUTCDate(startDay.getUTCDate() + (i - 1));
    dueDate.setUTCHours(12, 0, 0, 0);

    let topic = "";
    let url = "";

    if (i <= 7) {
      topic = "Network+ N10-009 (Professor Messer Playlist)";
      url = "https://www.professormesser.com/network-plus/n10-009/n10-009-video/n10-009-training-course/";
    } else if (i <= 14) {
      topic = "Security+ SY0-701 (Professor Messer Playlist)";
      url = "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-training-course/";
    } else if (i <= 28) {
      topic = "Linux (Linux Journey, NetAcad, LabEx)";
      url = "https://linuxjourney.com/";
    } else if (i <= 42) {
      topic = "Python (Codecademy, Real Python)";
      url = "https://www.py4e.com/lessons";
    } else if (i <= 56) {
      topic = "Traffic Analysis (Wireshark/Suricata)";
      url = "https://www.malware-traffic-analysis.net/";
    } else if (i <= 63) {
      topic = "Git (Codecademy, Git Branching)";
      url = "https://learngitbranching.js.org/";
    } else if (i <= 70) {
      topic = "ELK Stack (Logz.io/Elastic)";
      url = "https://tryhackme.com/module/elastic";
    } else if (i <= 77) {
      topic = "Cloud Platforms (AWS/GCP/Azure)";
      url = "https://aws.amazon.com/training/";
    } else if (i <= 84) {
      topic = "Hacking Preparation";
      url = "https://www.hacksplaining.com/lessons";
    } else {
      topic = "Hacking (Hack The Box/TryHackMe)";
      url = "https://www.hackthebox.eu/";
    }

    tasks.push({
      userId: user.id,
      title: `90 Days of Cyber - Day ${i}: ${topic}`,
      category: i <= 28 ? "Phase 1: Foundations" : "Phase 2: Cyber Core",
      scope: "DAILY",
      status: "PENDING",
      dueDate,
      url
    });
  }

  for (let i = 1; i <= 30; i++) {
    const dueDate = new Date(startDay);
    dueDate.setUTCDate(startDay.getUTCDate() + (i - 1));
    dueDate.setUTCHours(14, 0, 0, 0);

    tasks.push({
      userId: user.id,
      title: `30 Days of Python - Day ${i}`,
      category: "Phase 1: Python",
      scope: "DAILY",
      status: "PENDING",
      dueDate,
      url: "https://github.com/Asabeneh/30-Days-Of-Python"
    });
  }

  await prisma.task.createMany({ data: tasks });
  console.log("Database seeded successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
