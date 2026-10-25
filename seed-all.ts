import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found.");
    return;
  }

  // Clear existing items to prevent duplicates
  await prisma.learningResource.deleteMany({ where: { userId: user.id } });
  await prisma.project.deleteMany({ where: { userId: user.id } });
  await prisma.researchPaper.deleteMany({ where: { userId: user.id } });
  await prisma.studyAbroadApp.deleteMany({ where: { userId: user.id } });

  // 1. Learning Resources (Courses)
  const courses = [
    { title: "Python for Everybody Specialization", type: "COURSE", status: "NOT_STARTED", progress: 0, url: "https://www.coursera.org/specializations/python" },
    { title: "Google IT Automation with Python", type: "COURSE", status: "NOT_STARTED", progress: 0, url: "https://www.coursera.org/professional-certificates/google-it-automation" },
    { title: "Google UX Design (UX Research)", type: "COURSE", status: "NOT_STARTED", progress: 0, url: "https://www.coursera.org/professional-certificates/google-ux-design" },
    { title: "The Bits and Bytes of Computer Networking", type: "COURSE", status: "NOT_STARTED", progress: 0, url: "https://www.coursera.org/learn/computer-networking" },
  ];

  // 2. Learning Resources (Programming)
  const programming = [
    { title: "Python Network Scripting (Sockets & APIs)", type: "PROGRAMMING", status: "NOT_STARTED", progress: 0, url: "https://www.coursera.org/" },
    { title: "Python for Data Analytics", type: "PROGRAMMING", status: "NOT_STARTED", progress: 0, url: "https://www.coursera.org/professional-certificates/google-data-analytics" },
    { title: "C & C++ (Systems Programming & Memory)", type: "PROGRAMMING", status: "NOT_STARTED", progress: 0, url: "https://www.coursera.org/" },
    { title: "Python Automation (Scapy, Requests, YARA)", type: "PROGRAMMING", status: "NOT_STARTED", progress: 0, url: "https://www.coursera.org/" },
    
    // New 2025 Resources
    { title: "Scrimba (React & JS Interactive)", type: "PROGRAMMING", status: "NOT_STARTED", progress: 0, url: "https://scrimba.com/" },
    { title: "freeCodeCamp (Web Development)", type: "PROGRAMMING", status: "NOT_STARTED", progress: 0, url: "https://www.freecodecamp.org/" },
    { title: "MDN Web Docs (Reference)", type: "PROGRAMMING", status: "NOT_STARTED", progress: 0, url: "https://developer.mozilla.org/" },
    { title: "Scrimba (Python Interactive)", type: "PROGRAMMING", status: "NOT_STARTED", progress: 0, url: "https://scrimba.com/" },
    { title: "Real Python (Tutorials)", type: "PROGRAMMING", status: "NOT_STARTED", progress: 0, url: "https://realpython.com/" },
    { title: "Python Tutor (Visualization)", type: "PROGRAMMING", status: "NOT_STARTED", progress: 0, url: "https://pythontutor.com/" },
  ];

  // 3. Learning Resources (Cybersecurity)
  const cyber = [
    { title: "Google Cybersecurity", type: "CYBERSECURITY", status: "NOT_STARTED", progress: 0, url: "https://www.coursera.org/professional-certificates/google-cybersecurity" },
    { title: "Intro to Cyber Security Specialization (NYU)", type: "CYBERSECURITY", status: "NOT_STARTED", progress: 0, url: "https://www.coursera.org/specializations/intro-cyber-security" },
    { title: "IBM Cybersecurity Analyst Professional", type: "CYBERSECURITY", status: "NOT_STARTED", progress: 0, url: "https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst" },
    { title: "Linux Deep Dive (Command Line & Admin)", type: "CYBERSECURITY", status: "NOT_STARTED", progress: 0, url: "https://www.coursera.org/" },
    { title: "TryHackMe: Defensive Security Labs", type: "CYBERSECURITY", status: "NOT_STARTED", progress: 0, url: "https://tryhackme.com/" },
  ];

  await prisma.learningResource.createMany({
    data: [...courses, ...programming, ...cyber].map(c => ({
      userId: user.id,
      title: c.title,
      type: c.type,
      status: c.status,
      progress: c.progress,
      url: c.url
    }))
  });

  // 4. Projects (kept as is)
  const projects = [
    {
      title: "AutoShield Pakistan",
      description: "Modular cyber hygiene automation tool tailored for developing nations. Detects weak passwords, exposed ports, and risky extensions.",
      tags: ["Python", "SQLite", "Flask", "Scapy"],
      status: "IN_PROGRESS"
    },
    {
      title: "ICD Vault (In Case of Death)",
      description: "Secure digital inheritance platform releasing documents upon verified inactivity with zero-knowledge architecture.",
      tags: ["React", "Supabase", "PostgreSQL", "Security"],
      status: "PLANNING"
    },
    {
      title: "Malware Log Analyzer",
      description: "AI-driven log analysis tool for identifying malicious payload execution.",
      tags: ["Python", "Machine Learning"],
      status: "PLANNING"
    },
    {
      title: "AI Spam Detector",
      description: "Machine learning model to classify and filter social engineering attacks.",
      tags: ["Python", "Kaggle", "AI"],
      status: "PLANNING"
    }
  ];

  for (const p of projects) {
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

  // 5. Research
  await prisma.researchPaper.create({
    data: {
      userId: user.id,
      title: "The Urgent Need for Cyber Hygiene in Developing Nations: A Case for Automation",
      abstract: "Building the AutoShield Pakistan tool to collect practical performance data on cyber hygiene automation in developing sectors, providing empirical evidence for systemic policy implementation.",
      tags: ["Cyber Hygiene", "Automation", "Developing Nations"],
      status: "DRAFTING"
    }
  });

  // 6. Study Abroad Apps - COMPLETELY UPDATED WITH THE MASTER STRATEGY DOCUMENT!
  const uniApps = [
    // Top 10 Canadian
    { university: "University of Waterloo (MMath / PhD in CS)", country: "Canada", status: "RESEARCHING", deadline: new Date("2026-12-15"), url: "https://cs.uwaterloo.ca/" },
    { university: "University of Toronto (MSc / PhD in CS)", country: "Canada", status: "RESEARCHING", deadline: new Date("2026-12-01"), url: "https://web.cs.toronto.edu/" },
    { university: "University of Calgary (MSc / PhD in CS Cybersecurity)", country: "Canada", status: "RESEARCHING", deadline: new Date("2027-01-15"), url: "https://science.ucalgary.ca/computerscience" },
    { university: "University of British Columbia (MSc / PhD in CS)", country: "Canada", status: "RESEARCHING", deadline: new Date("2026-12-15"), url: "https://www.cs.ubc.ca/" },
    { university: "Concordia University (MASc Info Systems Security)", country: "Canada", status: "RESEARCHING", deadline: new Date("2027-01-15"), url: "https://www.concordia.ca/ginacody/info-systems-eng.html" },
    { university: "University of Ottawa (MCS Computer Science)", country: "Canada", status: "RESEARCHING", deadline: new Date("2027-02-01"), url: "https://www.uottawa.ca/faculty-engineering/" },
    { university: "Dalhousie University (MCS Computer Science)", country: "Canada", status: "RESEARCHING", deadline: new Date("2027-01-15"), url: "https://www.dal.ca/faculty/computerscience.html" },
    
    // 2026 Opportunities
    { university: "DAAD EPOS Development Courses", country: "Germany", status: "RESEARCHING", deadline: new Date("2026-10-15"), url: "https://www.daad.de/" },
    { university: "Universitas Sebelas Maret (UNS)", country: "Indonesia", status: "RESEARCHING", deadline: new Date("2026-09-30"), url: "https://international.uns.ac.id/" },
    { university: "UK Universities (Chevening Scholarship)", country: "UK", status: "RESEARCHING", deadline: new Date("2026-11-03"), url: "https://www.chevening.org/" },
    { university: "CyberMACS (Applied Cybersecurity)", country: "EU", status: "RESEARCHING", deadline: new Date("2026-12-15"), url: "https://cybermacs.eu/" },
    { university: "CYBERSURE (Cybersecurity & Assurance)", country: "EU", status: "RESEARCHING", deadline: new Date("2026-12-31"), url: "https://cybersure-master.eu/" },
    { university: "EMILDAI (Law, Data & AI)", country: "EU", status: "RESEARCHING", deadline: new Date("2026-12-15"), url: "https://emildai.eu/" },
    { university: "AAUW International Fellowship", country: "USA", status: "RESEARCHING", deadline: new Date("2026-11-15"), url: "https://www.aauw.org/" },
    { university: "Northeastern University (PhD Fellowship)", country: "USA", status: "RESEARCHING", deadline: new Date("2026-12-15"), url: "https://khoury.northeastern.edu/" },

    // 2027 Opportunities
    { university: "USTC / UCAS (ANSO Scholarship)", country: "China", status: "RESEARCHING", deadline: new Date("2027-01-31"), url: "http://www.anso.org.cn/" },
    { university: "SDSI (Service Design Strategies)", country: "EU", status: "RESEARCHING", deadline: new Date("2027-02-20"), url: "https://www.sdsi.ma/" },
    { university: "ELTE / BME (Stipendium Hungaricum)", country: "Hungary", status: "RESEARCHING", deadline: new Date("2027-01-15"), url: "https://stipendiumhungaricum.hu/" },
    { university: "METU / ITU / Hacettepe (Türkiye Bursları)", country: "Türkiye", status: "RESEARCHING", deadline: new Date("2027-02-20"), url: "https://tbbs.turkiyeburslari.gov.tr/" },
    { university: "British Council Women in STEM", country: "UK", status: "RESEARCHING", deadline: new Date("2027-04-30"), url: "https://www.britishcouncil.org/" },
    { university: "UBD / UTB (Brunei Govt Scholarship)", country: "Brunei", status: "RESEARCHING", deadline: new Date("2027-02-15"), url: "https://www.mfa.gov.bn/" },
    { university: "UTP Graduate Assistantship", country: "Malaysia", status: "RESEARCHING", deadline: new Date("2027-01-31"), url: "https://www.utp.edu.my/" },
    { university: "KAIST / SNU (GKS)", country: "South Korea", status: "RESEARCHING", deadline: new Date("2027-03-15"), url: "https://www.studyinkorea.go.kr/" },
    { university: "UTokyo / Tokyo Tech (MEXT)", country: "Japan", status: "RESEARCHING", deadline: new Date("2027-05-20"), url: "https://www.pk.emb-japan.go.jp/" }
  ];

  for (const app of uniApps) {
    await prisma.studyAbroadApp.create({
      data: {
        userId: user.id,
        university: app.university,
        country: app.country,
        status: app.status,
        deadline: app.deadline,
        url: app.url
      }
    });
  }

  console.log("Successfully seeded the entire application with personalized Roadmap & Study Abroad data!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
