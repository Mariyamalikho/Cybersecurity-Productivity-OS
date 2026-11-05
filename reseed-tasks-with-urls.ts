import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) return;

  // 1. Delete any existing 90 Days of Cyber or 30 Days of Python tasks to avoid duplicates
  await prisma.task.deleteMany({
    where: {
      userId: user.id,
      title: { startsWith: "90 Days of Cyber" }
    }
  });

  await prisma.task.deleteMany({
    where: {
      userId: user.id,
      title: { startsWith: "30 Days of Python" }
    }
  });

  // 2. Seed 90 Days of Cyber & 30 Days of Python starting November 5, 2026
  const tasks = [];
  const startDay = new Date(Date.UTC(2026, 10, 5)); // November 5, 2026

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
    } else if (i <= 90) {
      topic = "Hacking (Hack The Box/TryHackMe)";
      url = "https://www.hackthebox.eu/";
    }

    const category = i <= 28 ? "Phase 1: Foundations" : "Phase 2: Cyber Core";

    tasks.push({
      userId: user.id,
      title: `90 Days of Cyber - Day ${i}: ${topic}`,
      category: category,
      scope: "DAILY",
      status: "PENDING",
      dueDate: dueDate,
      url: url
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
      dueDate: dueDate,
      url: "https://github.com/Asabeneh/30-Days-Of-Python"
    });
  }

  await prisma.task.createMany({
    data: tasks
  });

  // 3. Backfill URLs on existing curriculum/hierarchical/roadmap tasks that are missing URLs
  const existingTasks = await prisma.task.findMany({
    where: { userId: user.id, url: null }
  });

  for (const t of existingTasks) {
    let url: string | null = null;
    const title = t.title;

    if (title.includes("Google IT Automation")) {
      url = "https://www.coursera.org/professional-certificates/google-it-automation";
    } else if (title.includes("Google Cybersecurity")) {
      url = "https://www.coursera.org/professional-certificates/google-cybersecurity";
    } else if (title.includes("IBM / Microsoft SecOps")) {
      url = "https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst";
    } else if (title.includes("Google UX Design")) {
      url = "https://www.coursera.org/professional-certificates/google-ux-design";
    } else if (title.includes("Python for Data Analytics")) {
      url = "https://www.coursera.org/professional-certificates/google-data-analytics";
    } else if (title.includes("Scrimba")) {
      url = "https://scrimba.com/";
    } else if (title.includes("TryHackMe")) {
      url = "https://tryhackme.com/";
    } else if (title.includes("NYU")) {
      url = "https://www.coursera.org/specializations/intro-cyber-security";
    } else if (title.includes("TCP/IP") || title.includes("IP Addressing")) {
      url = "https://www.professormesser.com/network-plus/n10-009/n10-009-video/n10-009-training-course/";
    } else if (title.includes("Linux") || title.includes("File Permissions") || title.includes("Operating Systems")) {
      url = "https://linuxjourney.com/";
    } else if (title.includes("SQL")) {
      url = "https://sqlbolt.com/";
    } else if (title.includes("Intro to C") || title.includes("Pointers")) {
      url = "https://www.learncpp.com/";
    } else if (title.includes("GitHub")) {
      url = "https://github.com/Mariyamalikho/TIL-Cybersecurity";
    } else if (title.includes("Python")) {
      url = "https://www.py4e.com/lessons";
    }

    if (url) {
      await prisma.task.update({
        where: { id: t.id },
        data: { url }
      });
    }
  }

  // 4. Ensure extended cybersecurity resources & DFIR projects exist without duplicates
  await prisma.learningResource.updateMany({
    where: { userId: user.id, title: { contains: "N10-008" } },
    data: {
      title: "Professor Messer: CompTIA Network+ (N10-009)",
      url: "https://www.professormesser.com/network-plus/n10-009/n10-009-video/n10-009-training-course/"
    }
  });

  await prisma.task.updateMany({
    where: { userId: user.id, url: { contains: "n10-008" } },
    data: {
      url: "https://www.professormesser.com/network-plus/n10-009/n10-009-video/n10-009-training-course/"
    }
  });

  const extendedResources = [
    { title: "Professor Messer: CompTIA Network+ (N10-009)", type: "COURSE", url: "https://www.professormesser.com/network-plus/n10-009/n10-009-video/n10-009-training-course/" },
    { title: "Professor Messer: CompTIA Security+ (SY0-701)", type: "COURSE", url: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-training-course/" },
    { title: "Hacksplaining (Vulnerability lessons)", type: "CYBERSECURITY", url: "https://www.hacksplaining.com/lessons" },
    { title: "Hack The Box (Pen-testing Labs)", type: "CYBERSECURITY", url: "https://www.hackthebox.eu/" },
    { title: "picoCTF (Beginner CTF Platform)", type: "CYBERSECURITY", url: "https://www.picoctf.org/" },
    { title: "OverTheWire - Bandit (Linux Practice)", type: "CYBERSECURITY", url: "https://overthewire.org/wargames/bandit/" },
    { title: "Darknet Diaries (Podcast)", type: "CYBERSECURITY", url: "https://darknetdiaries.com/" },
    { title: "The CyberWire Daily (Podcast)", type: "CYBERSECURITY", url: "https://podcasts.apple.com/us/podcast/the-cyberwire-daily/id1071831261" }
  ];

  for (const r of extendedResources) {
    const existing = await prisma.learningResource.findFirst({
      where: { userId: user.id, title: r.title }
    });
    if (!existing) {
      await prisma.learningResource.create({
        data: {
          userId: user.id,
          title: r.title,
          type: r.type,
          url: r.url,
          progress: 0,
          status: "NOT_STARTED"
        }
      });
    } else if (!existing.url) {
      await prisma.learningResource.update({
        where: { id: existing.id },
        data: { url: r.url }
      });
    }
  }

  const forensicsProjects = [
    {
      title: "TIL-Cybersecurity (22-Week Learning Log)",
      description: "Daily learning accountability tracker covering 90 Days of Cyber Security, 30 Days of Python, and DFIR labs.",
      tags: ["Cybersecurity", "Python", "Documentation", "GitHub"],
      status: "IN_PROGRESS",
      githubUrl: "https://github.com/Mariyamalikho/TIL-Cybersecurity"
    },
    {
      title: "DFIR Case Study: NIST Data Leakage",
      description: "Forensic investigation of intellectual property theft using Wireshark, Volatility, and EnCase/Sleuthkit.",
      tags: ["Digital Forensics", "Data Leakage", "Wireshark", "DFIR"],
      status: "PLANNING",
      githubUrl: "https://github.com/frankwxu/digital-forensics-lab"
    },
    {
      title: "DFIR Case Study: P2P Data Leakage",
      description: "Timeline reconstruction and MFT analysis of intellectual property theft involving uTorrent.",
      tags: ["Digital Forensics", "P2P", "MFT Analysis"],
      status: "PLANNING",
      githubUrl: "https://github.com/frankwxu/digital-forensics-lab"
    },
    {
      title: "DFIR Case Study: Illegal Possession of Images",
      description: "Extracting evidence from FTP/HTTP traffic and recovering steganographic data (Rhino Hunt).",
      tags: ["Steganography", "Network Forensics"],
      status: "PLANNING",
      githubUrl: "https://github.com/frankwxu/digital-forensics-lab"
    },
    {
      title: "DFIR Case Study: Memory Forensics (Illegal File Transfer)",
      description: "Reconstructing timeline of unauthorized USB data transfers from server memory.",
      tags: ["Memory Forensics", "Volatility"],
      status: "PLANNING",
      githubUrl: "https://github.com/frankwxu/digital-forensics-lab"
    },
    {
      title: "DFIR Case Study: IoT/Mobile Extraction (Echo Show & Eufy)",
      description: "Applying eMMC chip-off extraction and reverse engineering techniques to retrieve implanted evidence from Amazon Echo Show and Eufy Doorbell systems.",
      tags: ["Hardware Forensics", "IoT", "Chip-off"],
      status: "PLANNING",
      githubUrl: "https://github.com/frankwxu/digital-forensics-lab"
    },
    {
      title: "DFIR Case Study: Mobile Forensics (iOS 13 & Android 10)",
      description: "Systematic investigation of app lifecycles, SQLite databases, and system logs on mobile operating systems.",
      tags: ["Mobile Forensics", "iOS", "Android", "SQLite"],
      status: "PLANNING",
      githubUrl: "https://github.com/frankwxu/digital-forensics-lab"
    },
    {
      title: "Political Insight Analysis Leveraging LLMs",
      description: "Applying large language models (LLMs) to extract political insights and summaries from the Hillary Clinton email dataset.",
      tags: ["AI/ML", "LLM", "Data Mining"],
      status: "PLANNING",
      githubUrl: "https://github.com/frankwxu/digital-forensics-lab"
    }
  ];

  for (const p of forensicsProjects) {
    const existing = await prisma.project.findFirst({
      where: { userId: user.id, title: p.title }
    });
    if (!existing) {
      await prisma.project.create({
        data: {
          userId: user.id,
          title: p.title,
          description: p.description,
          tags: p.tags,
          status: p.status,
          githubUrl: p.githubUrl
        }
      });
    }
  }

  console.log("Successfully re-seeded 90 Days of Cyber, 30 Days of Python, task URLs, and extended resources starting Nov 5, 2026.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
