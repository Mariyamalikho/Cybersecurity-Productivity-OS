import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found.");
    return;
  }

  const tasks = [];
  const startDay = new Date(Date.UTC(2026, 7, 1)); // August 1, 2026
  
  // 90 Days of Cyber
  for (let i = 1; i <= 90; i++) {
    const dueDate = new Date(startDay);
    dueDate.setUTCDate(startDay.getUTCDate() + (i - 1));
    dueDate.setUTCHours(12, 0, 0, 0);

    let topic = "";
    if (i <= 7) topic = "Network+ (Professor Messer Playlist)";
    else if (i <= 14) topic = "Security+ (Professor Messer Playlist)";
    else if (i <= 28) topic = "Linux (Linux Journey, NetAcad, LabEx)";
    else if (i <= 42) topic = "Python (Codecademy, Real Python)";
    else if (i <= 56) topic = "Traffic Analysis (Wireshark/Suricata)";
    else if (i <= 63) topic = "Git (Codecademy, Git Branching)";
    else if (i <= 70) topic = "ELK Stack (Logz.io/Elastic)";
    else if (i <= 77) topic = "Cloud Platforms (AWS/GCP/Azure)";
    else if (i <= 84) topic = "Hacking Preparation";
    else if (i <= 90) topic = "Hacking (Hack The Box/TryHackMe)";

    const category = i <= 28 ? "Phase 1: Foundations" : "Phase 2: Cyber Core";

    tasks.push({
      userId: user.id,
      title: `90 Days of Cyber - Day ${i}: ${topic}`,
      category: category,
      scope: "DAILY",
      status: "PENDING",
      dueDate: dueDate
    });
  }

  // 30 Days of Python
  for (let i = 1; i <= 30; i++) {
    const dueDate = new Date(startDay);
    dueDate.setUTCDate(startDay.getUTCDate() + (i - 1));
    dueDate.setUTCHours(14, 0, 0, 0); // Offset hour so they don't clash identically

    tasks.push({
      userId: user.id,
      title: `30 Days of Python - Day ${i}`,
      category: "Phase 1: Python",
      scope: "DAILY",
      status: "PENDING",
      dueDate: dueDate
    });
  }

  await prisma.task.createMany({
    data: tasks
  });

  console.log(`Successfully generated 90 Days of Cyber and 30 Days of Python Tasks starting Aug 1, 2026!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
