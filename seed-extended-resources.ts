import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found.");
    return;
  }

  // 1. Add Hacking Practice Platforms
  const hackingResources = [
    { title: "Hacksplaining (Vulnerability lessons)", type: "CYBERSECURITY", url: "https://www.hacksplaining.com/lessons", progress: 0, status: "NOT_STARTED" },
    { title: "TryHackMe (Defensive/Offensive Labs)", type: "CYBERSECURITY", url: "https://tryhackme.com/", progress: 0, status: "NOT_STARTED" },
    { title: "Hack The Box (Pen-testing Labs)", type: "CYBERSECURITY", url: "https://www.hackthebox.eu/", progress: 0, status: "NOT_STARTED" },
    { title: "picoCTF (Beginner CTF Platform)", type: "CYBERSECURITY", url: "https://www.picoctf.org/", progress: 0, status: "NOT_STARTED" },
    { title: "OverTheWire - Bandit (Linux Practice)", type: "CYBERSECURITY", url: "https://overthewire.org/wargames/bandit/", progress: 0, status: "NOT_STARTED" }
  ];

  await prisma.learningResource.createMany({
    data: hackingResources.map(r => ({ ...r, userId: user.id }))
  });

  // 2. Add Podcast/Blog
  const mediaResources = [
    { title: "Darknet Diaries (Podcast)", type: "CYBERSECURITY", url: "https://darknetdiaries.com/", progress: 0, status: "NOT_STARTED" },
    { title: "The CyberWire Daily (Podcast)", type: "CYBERSECURITY", url: "https://podcasts.apple.com/us/podcast/the-cyberwire-daily/id1071831261", progress: 0, status: "NOT_STARTED" }
  ];

  await prisma.learningResource.createMany({
    data: mediaResources.map(r => ({ ...r, userId: user.id }))
  });

  // 3. Add Digital Forensics Labs to Projects
  const forensicsProjects = [
    {
      title: "DFIR Case Study: NIST Data Leakage",
      description: "Forensic investigation of intellectual property theft using Wireshark, Volatility, and EnCase/Sleuthkit.",
      tags: ["Digital Forensics", "Data Leakage", "Wireshark", "DFIR"],
      status: "PLANNING"
    },
    {
      title: "DFIR Case Study: P2P Data Leakage",
      description: "Timeline reconstruction and MFT analysis of intellectual property theft involving uTorrent.",
      tags: ["Digital Forensics", "P2P", "MFT Analysis"],
      status: "PLANNING"
    },
    {
      title: "DFIR Case Study: Illegal Possession of Images",
      description: "Extracting evidence from FTP/HTTP traffic and recovering steganographic data (Rhino Hunt).",
      tags: ["Steganography", "Network Forensics"],
      status: "PLANNING"
    },
    {
      title: "DFIR Case Study: Memory Forensics (Illegal File Transfer)",
      description: "Reconstructing timeline of unauthorized USB data transfers from server memory.",
      tags: ["Memory Forensics", "Volatility"],
      status: "PLANNING"
    },
    {
      title: "DFIR Case Study: IoT/Mobile Extraction (Echo Show & Eufy)",
      description: "Applying eMMC chip-off extraction and reverse engineering techniques to retrieve implanted evidence from Amazon Echo Show and Eufy Doorbell systems.",
      tags: ["Hardware Forensics", "IoT", "Chip-off"],
      status: "PLANNING"
    },
    {
      title: "DFIR Case Study: Mobile Forensics (iOS 13 & Android 10)",
      description: "Systematic investigation of app lifecycles, SQLite databases, and system logs on mobile operating systems.",
      tags: ["Mobile Forensics", "iOS", "Android", "SQLite"],
      status: "PLANNING"
    },
    {
      title: "Political Insight Analysis Leveraging LLMs",
      description: "Applying large language models (LLMs) to extract political insights and summaries from the Hillary Clinton email dataset.",
      tags: ["AI/ML", "LLM", "Data Mining"],
      status: "PLANNING"
    }
  ];

  for (const p of forensicsProjects) {
    await prisma.project.create({
      data: {
        userId: user.id,
        title: p.title,
        description: p.description,
        tags: p.tags,
        status: p.status
      }
    });
  }

  console.log("Successfully seeded extended cybersecurity and forensics resources!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
