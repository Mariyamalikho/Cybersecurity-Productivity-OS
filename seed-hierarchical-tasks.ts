import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found.");
    return;
  }

  // 1. Delete ALL existing tasks
  await prisma.task.deleteMany({
    where: { userId: user.id }
  });

  const septemberTasks = [];
  
  // 2. Insert Monthly Task
  septemberTasks.push({
    userId: user.id,
    title: "Phase 1: Mandatory Foundations & Fundamentals",
    category: "Phase 1",
    scope: "MONTHLY",
    dueDate: new Date(2026, 8, 30, 23, 59, 59), // Sept 30
    status: "PENDING"
  });

  // 3. Insert Weekly Tasks
  const weeklyGoals = [
    { day: 7, title: "Week 1: Python Basics & Defensive Foundations" },
    { day: 14, title: "Week 2: Advanced Python & Automation Scripting" },
    { day: 21, title: "Week 3: Google IT Support & Networking Fundamentals" },
    { day: 28, title: "Week 4: Intro to Cyber Security & C/C++ Memory Management" }
  ];

  for (const week of weeklyGoals) {
    septemberTasks.push({
      userId: user.id,
      title: week.title,
      category: "Phase 1",
      scope: "WEEKLY",
      dueDate: new Date(2026, 8, week.day, 23, 59, 59),
      status: "PENDING"
    });
  }

  // 4. Insert 30 Daily Tasks (Beginner -> Intermediate -> Pro)
  const schedule = [
    // BEGINNER (Week 1 & 2)
    { day: 1, title: "Beginner: Python Variables, Expressions, and Statements", cat: "Python" },
    { day: 2, title: "Beginner: Python Conditional Code & Functions", cat: "Python" },
    { day: 3, title: "Beginner: Python Loops & Iteration", cat: "Python" },
    { day: 4, title: "Beginner: Intro to TryHackMe (Linux Fundamentals 1)", cat: "Cyber" },
    { day: 5, title: "Beginner: TryHackMe (Network Fundamentals)", cat: "Networking" },
    { day: 6, title: "Beginner: Python Cyber Scripting (Build a Port Scanner)", cat: "Python" },
    { day: 7, title: "Review: Push Python Port Scanner to GitHub", cat: "Portfolio" },

    { day: 8, title: "Beginner: Python Strings & Files", cat: "Python" },
    { day: 9, title: "Beginner: Python Lists, Dictionaries, and Tuples", cat: "Python" },
    { day: 10, title: "Beginner: TryHackMe (Intro to Defensive Security)", cat: "Cyber" },
    { day: 11, title: "Beginner: Python Cyber Scripting (Log Parsing & Automation)", cat: "Python" },
    { day: 12, title: "Beginner: Intro to SQL (SELECT, INSERT, UPDATE, JOIN)", cat: "SQL" },
    { day: 13, title: "Beginner: Google IT Support - Understanding Operating Systems", cat: "IT" },
    { day: 14, title: "Review: TryHackMe Module Completion & Notes Sync", cat: "Portfolio" },

    // INTERMEDIATE (Week 3)
    { day: 15, title: "Intermediate: Python Regular Expressions (Regex)", cat: "Python" },
    { day: 16, title: "Intermediate: Python Networked Programs (Sockets)", cat: "Python" },
    { day: 17, title: "Intermediate: Python Web Services (XML, JSON, APIs)", cat: "Python" },
    { day: 18, title: "Intermediate: Basic SQLite integration with Python", cat: "SQL" },
    { day: 19, title: "Intermediate: Linux Command Line Basics", cat: "IT" },
    { day: 20, title: "Intermediate: File Permissions & Package Management", cat: "IT" },
    { day: 21, title: "Review: Push SQLite + Python demo to GitHub", cat: "Portfolio" },

    // PRO (Week 4 & End)
    { day: 22, title: "Pro: TCP/IP Model & OSI Model basics", cat: "Networking" },
    { day: 23, title: "Pro: IP Addressing, Subnets, and Routing", cat: "Networking" },
    { day: 24, title: "Pro: Threat Landscape & Attack Vectors (NYU)", cat: "Cyber" },
    { day: 25, title: "Pro: Cryptography Basics - Symmetric vs Asymmetric (NYU)", cat: "Cyber" },
    { day: 26, title: "Pro: Risk Management Concepts (NYU)", cat: "Cyber" },
    { day: 27, title: "Pro: Intro to C & memory management concepts", cat: "C/C++" },
    { day: 28, title: "Pro: Pointers and basic data structures in C", cat: "C/C++" },

    // Wrap-up
    { day: 29, title: "Integration: Automating Nmap scans with Python", cat: "Python" },
    { day: 30, title: "Final Review: Compile all scripts, notes, and architectures", cat: "Review" },
  ];

  for (const item of schedule) {
    septemberTasks.push({
      userId: user.id,
      title: item.title,
      category: item.cat,
      scope: "DAILY",
      dueDate: new Date(2026, 8, item.day, 10, 0, 0),
      status: "PENDING"
    });
  }

  await prisma.task.createMany({
    data: septemberTasks
  });

  console.log(`Successfully seeded ${septemberTasks.length} hierarchical tasks (Monthly, Weekly, Daily) for September 2026!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
