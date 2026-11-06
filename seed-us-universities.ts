import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const usUniversities = [
  {
    university: "Penn State University (CSE)",
    country: "USA",
    deadline: new Date("2026-12-15"),
    url: "https://www.eecs.psu.edu/",
    notes: "100% Tuition Waiver + $26k-$32k/yr Stipend. No GRE. Request low-income waiver at Virtual Open House."
  },
  {
    university: "Purdue University (CERIAS)",
    country: "USA",
    deadline: new Date("2026-12-15"),
    url: "https://www.cerias.purdue.edu/",
    notes: "100% Tuition Waiver + $26k-$33k/yr Stipend. Request via email to Graduate Admissions Coordinator."
  },
  {
    university: "University of Maryland (UMD MC2)",
    country: "USA",
    deadline: new Date("2026-12-15"),
    url: "https://cyber.umd.edu/",
    notes: "100% Tuition Waiver + $28k-$35k/yr Stipend. Fee waiver granted for UMD Open House attendees."
  },
  {
    university: "UMass Amherst (CICS)",
    country: "USA",
    deadline: new Date("2026-12-15"),
    url: "https://www.cics.umass.edu/",
    notes: "100% Tuition Waiver + $27k-$33k/yr Stipend. Automatic fee waiver form available on CICS portal."
  },
  {
    university: "Arizona State University (ASU SCAI)",
    country: "USA",
    deadline: new Date("2026-12-15"),
    url: "https://scai.engineering.asu.edu/",
    notes: "100% Tuition Waiver + $24k-$30k/yr Stipend. Email faculty advisor for department application code."
  },
  {
    university: "George Mason University (GMU CEC)",
    country: "USA",
    deadline: new Date("2026-12-15"),
    url: "https://cec.gmu.edu/",
    notes: "100% Tuition Waiver + $24k-$29k/yr Stipend. Email Graduate Director for international fee waivers."
  },
  {
    university: "North Carolina State Uni (NC State CS)",
    country: "USA",
    deadline: new Date("2026-12-15"),
    url: "https://www.csc.ncsu.edu/",
    notes: "100% Tuition Waiver + $25k-$31k/yr Stipend. Dept fee waiver program for low-income applicants."
  },
  {
    university: "University of Houston (UH CS)",
    country: "USA",
    deadline: new Date("2027-01-15"),
    url: "https://www.cs.uh.edu/",
    notes: "100% Tuition Waiver + $22k-$27k/yr Stipend. Request code from CS Graduate Advisor."
  },
  {
    university: "Washington State Uni (WSU EECS)",
    country: "USA",
    deadline: new Date("2027-01-10"),
    url: "https://eecs.wsu.edu/",
    notes: "100% Tuition Waiver + $23k-$28k/yr Stipend. Email EECS graduate coordinator for waiver code."
  },
  {
    university: "Oregon State University (OSU EECS)",
    country: "USA",
    deadline: new Date("2026-12-31"),
    url: "https://eecs.oregonstate.edu/",
    notes: "100% Tuition Waiver + $24k-$29k/yr Stipend. Request financial hardship waiver on application portal."
  },
  {
    university: "Florida State University (FSU CS)",
    country: "USA",
    deadline: new Date("2027-01-15"),
    url: "https://www.cs.fsu.edu/",
    notes: "100% Tuition Waiver + $22k-$26k/yr Stipend. Fee waiver code available for prospective PhDs."
  },
  {
    university: "University of Utah (Computing)",
    country: "USA",
    deadline: new Date("2026-12-15"),
    url: "https://www.cs.utah.edu/",
    notes: "100% Tuition Waiver + $25k-$31k/yr Stipend. School of Computing fee waiver request form."
  },
  {
    university: "Iowa State University (ISU InfoSec)",
    country: "USA",
    deadline: new Date("2027-01-15"),
    url: "https://www.ece.iastate.edu/",
    notes: "100% Tuition Waiver + $23k-$28k/yr Stipend. Email Graduate Admissions Office for international waiver."
  },
  {
    university: "University of Georgia (UGA Computing)",
    country: "USA",
    deadline: new Date("2027-01-01"),
    url: "https://cs.uga.edu/",
    notes: "100% Tuition Waiver + $22k-$27k/yr Stipend. Request fee waiver during virtual open house."
  },
  {
    university: "University of Minnesota (UMN CS)",
    country: "USA",
    deadline: new Date("2026-12-15"),
    url: "https://cse.umn.edu/cs",
    notes: "100% Tuition Waiver + $27k-$33k/yr Stipend. Diversity & financial hardship fee waiver program."
  }
];

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found.");
    return;
  }

  for (const uni of usUniversities) {
    const exists = await prisma.studyAbroadApp.findFirst({
      where: { userId: user.id, university: uni.university }
    });

    if (!exists) {
      await prisma.studyAbroadApp.create({
        data: {
          userId: user.id,
          university: uni.university,
          country: uni.country,
          status: "RESEARCHING",
          deadline: uni.deadline,
          url: uni.url,
          notes: uni.notes
        }
      });
      console.log(`Added: ${uni.university}`);
    } else {
      console.log(`Already exists: ${uni.university}`);
    }
  }

  console.log("Seeding US Universities complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
