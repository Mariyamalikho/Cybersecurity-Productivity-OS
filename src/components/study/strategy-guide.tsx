"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Mail, BrainCircuit, Globe, Plane, FileText, Calendar, Compass, ExternalLink } from "lucide-react";

export function StrategyGuide() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Master Strategy Document: Fully Funded MS/PhD Abroad
        </h1>
        <p className="text-muted-foreground text-lg">
          Complete Technical Blueprint, Opportunities Database, Canadian & TA/RA Funding Guide for Mariyam Ali Khokhar.
        </p>
      </div>

      <Tabs defaultValue="2026-apps" className="w-full">
        <TabsList className="flex flex-wrap w-full h-auto p-1 bg-card/50 gap-1">
          <TabsTrigger value="2026-apps" className="flex-1 py-3 flex items-center gap-2 min-w-[140px]">
            <Calendar className="w-4 h-4" /> 2026 Calls
          </TabsTrigger>
          <TabsTrigger value="2027-apps" className="flex-1 py-3 flex items-center gap-2 min-w-[140px]">
            <Compass className="w-4 h-4" /> 2027 Calls
          </TabsTrigger>
          <TabsTrigger value="usa" className="flex-1 py-3 flex items-center gap-2 min-w-[140px]">
            <Plane className="w-4 h-4" /> USA Top 15
          </TabsTrigger>
          <TabsTrigger value="canada" className="flex-1 py-3 flex items-center gap-2 min-w-[140px]">
            <Plane className="w-4 h-4" /> Canada Top 10
          </TabsTrigger>
          <TabsTrigger value="funding" className="flex-1 py-3 flex items-center gap-2 min-w-[140px]">
            <GraduationCap className="w-4 h-4" /> TA/RA & Outreach
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex-1 py-3 flex items-center gap-2 min-w-[140px]">
            <BrainCircuit className="w-4 h-4" /> Profile & CGPA
          </TabsTrigger>
        </TabsList>

        {/* 2026 CALLS TAB */}
        <TabsContent value="2026-apps" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">



            <AppCard 
              title="CyberMACS (Applied Cybersecurity)" 
              location="EU" 
              degree="Master's (EMJM)" 
              coverage="100% FULL (€1,400/mo + Travel)" 
              deadline="Dec 15, 2026" 
              url="https://cybermacs.eu/" 
            />
            <AppCard 
              title="CYBERSURE (Cybersecurity & Assurance)" 
              location="EU" 
              degree="Master's (EMJM)" 
              coverage="100% FULL (€1,400/mo + Travel)" 
              deadline="Dec 31, 2026" 
              url="https://cybersure-master.eu/" 
            />
            <AppCard 
              title="EMILDAI (Law, Data & AI)" 
              location="EU" 
              degree="Master's (EMJM)" 
              coverage="100% FULL (€1,400/mo + Travel)" 
              deadline="Dec 15, 2026" 
              url="https://emildai.eu/" 
            />
            <AppCard 
              title="AAUW International Fellowship" 
              location="USA" 
              degree="Master's / PhD" 
              coverage="$20,000 Grant ($1,800/mo equivalent)" 
              deadline="Nov 15, 2026" 
              url="https://www.aauw.org/" 
            />
            <AppCard 
              title="Northeastern University (Cyber)" 
              location="USA" 
              degree="Direct PhD" 
              coverage="100% FULL ($2,500–$3,000/mo TA/RA)" 
              deadline="Dec 15, 2026" 
              url="https://khoury.northeastern.edu/" 
            />
          </div>
        </TabsContent>

        {/* 2027 CALLS TAB */}
        <TabsContent value="2027-apps" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AppCard 
              title="ANSO Scholarship (USTC / UCAS)" 
              location="China" 
              degree="Master's / PhD" 
              coverage="100% FULL (3,000 RMB/mo + Dorm + Flights)" 
              deadline="Jan 31, 2027" 
              url="http://www.anso.org.cn/" 
            />
            <AppCard 
              title="SDSI (Service Design Strategies)" 
              location="EU" 
              degree="Master's (EMJM)" 
              coverage="100% FULL (€1,400/mo + Travel)" 
              deadline="Feb 20, 2027" 
              url="https://www.sdsi.ma/" 
            />
            <AppCard 
              title="Stipendium Hungaricum (ELTE / BME)" 
              location="Hungary" 
              degree="Master's" 
              coverage="100% FULL (HUF 43,700 + Dorm Free)" 
              deadline="Jan 15, 2027" 
              url="https://stipendiumhungaricum.hu/" 
            />
            <AppCard 
              title="Türkiye Bursları (METU / ITU)" 
              location="Türkiye" 
              degree="Master's" 
              coverage="100% FULL (TL 3,500+ + Dorm Free)" 
              deadline="Feb 20, 2027" 
              url="https://tbbs.turkiyeburslari.gov.tr/" 
            />
            <AppCard 
              title="British Council Women in STEM" 
              location="UK" 
              degree="Master's" 
              coverage="100% FULL (£1,340/mo + NHS + Flights)" 
              deadline="Apr 30, 2027" 
              url="https://www.britishcouncil.org/" 
            />
            <AppCard 
              title="Brunei Darussalam Govt (UBD / UTB)" 
              location="Brunei" 
              degree="Master's" 
              coverage="100% FULL (BND 500/mo + Dorm + Flights)" 
              deadline="Feb 15, 2027" 
              url="https://www.mfa.gov.bn/" 
            />
            <AppCard 
              title="UTP Graduate Assistantship" 
              location="Malaysia" 
              degree="Master's (Research)" 
              coverage="100% FULL (RM 1,600–2,200/mo)" 
              deadline="Jan 31, 2027" 
              url="https://www.utp.edu.my/" 
            />
            <AppCard 
              title="Global Korea Scholarship (GKS)" 
              location="South Korea" 
              degree="Master's" 
              coverage="100% FULL (1,000,000 KRW + Airfare)" 
              deadline="Mar 15, 2027" 
              url="https://www.studyinkorea.go.kr/" 
            />
            <AppCard 
              title="MEXT Embassy Track (UTokyo)" 
              location="Japan" 
              degree="Master's" 
              coverage="100% FULL (144,000 JPY + Airfare)" 
              deadline="May 20, 2027" 
              url="https://www.pk.emb-japan.go.jp/" 
            />
            <AppCard 
              title="Universitas Sebelas Maret (UNS)" 
              location="Indonesia" 
              degree="Master's / PhD" 
              coverage="100% FULL (IDR 1,750,000 + Settlement)" 
              deadline="Sep 30, 2027" 
              url="https://international.uns.ac.id/" 
            />
            <AppCard 
              title="DAAD EPOS Development Courses" 
              location="Germany" 
              degree="Master's" 
              coverage="100% FULL (€934/mo + Travel)" 
              deadline="Oct 15, 2027" 
              url="https://www.daad.de/" 
            />
            <AppCard 
              title="Chevening Scholarship" 
              location="UK" 
              degree="Master's" 
              coverage="100% FULL (£1,300–£1,600/mo + Airfare)" 
              deadline="Nov 03, 2027" 
              url="https://www.chevening.org/" 
            />
          </div>
        </TabsContent>

        {/* USA TOP 15 TAB */}
        <TabsContent value="usa" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AppCard title="Penn State University" location="Pennsylvania" degree="PhD / MS in CS (Cyber)" coverage="$26k-$32k/yr + Tuition" deadline="Dec 15, 2026" url="https://www.eecs.psu.edu/" />
            <AppCard title="Purdue University" location="Indiana" degree="PhD / MS in CS" coverage="$26k-$33k/yr + Tuition" deadline="Dec 15, 2026" url="https://www.cerias.purdue.edu/" />
            <AppCard title="University of Maryland (UMD)" location="Maryland" degree="PhD / MS in CS" coverage="$28k-$35k/yr + Tuition" deadline="Dec 15, 2026" url="https://cyber.umd.edu/" />
            <AppCard title="UMass Amherst" location="Massachusetts" degree="PhD / MS in CS" coverage="$27k-$33k/yr + Tuition" deadline="Dec 15, 2026" url="https://www.cics.umass.edu/" />
            <AppCard title="Arizona State University" location="Arizona" degree="PhD / MS in CS" coverage="$24k-$30k/yr + Tuition" deadline="Dec 15, 2026" url="https://scai.engineering.asu.edu/" />
            <AppCard title="George Mason University" location="Virginia" degree="PhD / MS in IT" coverage="$24k-$29k/yr + Tuition" deadline="Dec 15, 2026" url="https://cec.gmu.edu/" />
            <AppCard title="North Carolina State Uni" location="North Carolina" degree="PhD / MS in CS" coverage="$25k-$31k/yr + Tuition" deadline="Dec 15, 2026" url="https://www.csc.ncsu.edu/" />
            <AppCard title="University of Houston" location="Texas" degree="PhD / MS in CS" coverage="$22k-$27k/yr + Tuition" deadline="Jan 15, 2027" url="https://www.cs.uh.edu/" />
            <AppCard title="Washington State Uni" location="Washington" degree="PhD / MS in CS" coverage="$23k-$28k/yr + Tuition" deadline="Jan 10, 2027" url="https://eecs.wsu.edu/" />
            <AppCard title="Oregon State University" location="Oregon" degree="PhD / MS in CS" coverage="$24k-$29k/yr + Tuition" deadline="Dec 31, 2026" url="https://eecs.oregonstate.edu/" />
            <AppCard title="Florida State University" location="Florida" degree="PhD / MS in CS" coverage="$22k-$26k/yr + Tuition" deadline="Jan 15, 2027" url="https://www.cs.fsu.edu/" />
            <AppCard title="University of Utah" location="Utah" degree="PhD / MS in Computing" coverage="$25k-$31k/yr + Tuition" deadline="Dec 15, 2026" url="https://www.cs.utah.edu/" />
            <AppCard title="Iowa State University" location="Iowa" degree="PhD / MS in Info Assurance" coverage="$23k-$28k/yr + Tuition" deadline="Jan 15, 2027" url="https://www.ece.iastate.edu/" />
            <AppCard title="University of Georgia" location="Georgia" degree="PhD / MS in CS" coverage="$22k-$27k/yr + Tuition" deadline="Jan 01, 2027" url="https://cs.uga.edu/" />
            <AppCard title="University of Minnesota" location="Minnesota" degree="PhD / MS in CS" coverage="$27k-$33k/yr + Tuition" deadline="Dec 15, 2026" url="https://cse.umn.edu/cs" />
          </div>
        </TabsContent>

        {/* CANADA TOP 10 TAB */}
        <TabsContent value="canada" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppCard 
              title="University of Waterloo" 
              location="Waterloo, ON" 
              degree="MMath / PhD in Computer Science" 
              coverage="26,000–34,000 CAD / year (TA+RA)" 
              deadline="Dec 15, 2026" 
              url="https://cs.uwaterloo.ca/" 
            />
            <AppCard 
              title="University of Toronto" 
              location="Toronto, ON" 
              degree="MSc / PhD in Computer Science" 
              coverage="$30,000 CAD / year base + 100% Tuition" 
              deadline="Dec 01, 2026" 
              url="https://web.cs.toronto.edu/" 
            />
            <AppCard 
              title="University of Calgary" 
              location="Calgary, AB" 
              degree="MSc / PhD in CS (Cybersecurity)" 
              coverage="24,000–28,000 CAD / year (GTA+GRA)" 
              deadline="Jan 15, 2027" 
              url="https://science.ucalgary.ca/computerscience" 
            />
            <AppCard 
              title="University of British Columbia (UBC)" 
              location="Vancouver, BC" 
              degree="MSc / PhD in Computer Science" 
              coverage="24,000–29,000 CAD / year" 
              deadline="Dec 15, 2026" 
              url="https://www.cs.ubc.ca/" 
            />
            <AppCard 
              title="Concordia University" 
              location="Montreal, QC" 
              degree="MASc Info Systems Security" 
              coverage="20,000–25,000 CAD / year (GRA)" 
              deadline="Jan 15, 2027" 
              url="https://www.concordia.ca/ginacody/info-systems-eng.html" 
            />
            <AppCard 
              title="University of Ottawa" 
              location="Ottawa, ON" 
              degree="Master of Computer Science (Cyber)" 
              coverage="21,000–26,000 CAD / year (TA/RA)" 
              deadline="Feb 01, 2027" 
              url="https://www.uottawa.ca/faculty-engineering/" 
            />
            <AppCard 
              title="Dalhousie University" 
              location="Halifax, NS" 
              degree="Master of Computer Science (MCS)" 
              coverage="20,000–24,000 CAD / year" 
              deadline="Jan 15, 2027" 
              url="https://www.dal.ca/faculty/computerscience.html" 
            />
          </div>
        </TabsContent>

        {/* FUNDING AND OUTREACH TAB */}
        <TabsContent value="funding" className="mt-6 space-y-6">
          <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">Understanding TA & RA Funding Mechanics</CardTitle>
              <CardDescription>In Canada, North America, and top research institutions globally</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <FileText className="text-blue-500" /> A. Teaching Assistantship (TA / GTA)
                </h3>
                <ul className="list-none space-y-3 text-muted-foreground ml-7 border-l-2 border-border/50 pl-4">
                  <li><strong className="text-foreground">What it is:</strong> You are employed by the university department to assist professors with undergraduate courses.</li>
                  <li><strong className="text-foreground">Responsibilities:</strong> Grading assignments/exams, conducting tutorial sessions, managing lab sessions, and holding office hours (typically 10 to 12 hours per week).</li>
                  <li><strong className="text-foreground">Compensation Package:</strong> Full or Partial Tuition Waiver (or offset grant) + Bi-weekly/Monthly Salary ranging from $1,500 to $2,500 CAD/month ($18,000–$25,000 CAD per year).</li>
                  <li><strong className="text-foreground">How to get it:</strong> Automatically assigned upon admission to thesis-based CS/IT programs, or awarded based on technical skills.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Plane className="text-orange-500" /> B. Research Assistantship (RA / GRA)
                </h3>
                <ul className="list-none space-y-3 text-muted-foreground ml-7 border-l-2 border-border/50 pl-4">
                  <li><strong className="text-foreground">What it is:</strong> You are paid directly from a professor's external research grant (e.g., NSERC, CIHR, SSHRC in Canada) to work on specific research projects in their lab.</li>
                  <li><strong className="text-foreground">Responsibilities:</strong> Conducting experiments, coding security tools, writing literature reviews, analyzing data, and co-authoring conference/journal papers.</li>
                  <li><strong className="text-foreground">Compensation Package:</strong> 100% Tuition Waiver integrated into funding package + Monthly Stipend ranging from $1,800 to $2,800 CAD/month ($20,000–$32,000 CAD per year).</li>
                  <li><strong className="text-foreground">How to get it:</strong> Secured BEFORE formal university application by directly contacting a prospective professor (supervisor) who agrees to sponsor your admission from their grant!</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="border-border/40 bg-card/30 backdrop-blur-sm border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-2xl font-heading">Google Scholar Outreach Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p>Finding professors through standard university websites can sometimes be difficult. Use this Extraction Technique to find active professors with current research grants in your exact field:</p>
                <ol className="list-decimal pl-5 space-y-2 font-medium">
                  <li>Go to Google Scholar (scholar.google.com).</li>
                  <li><strong className="text-foreground">Search Query:</strong> Type exact research keywords: <code>"cybersecurity" AND ("usability" OR "cyber hygiene" OR "threat detection")</code>.</li>
                  <li><strong className="text-foreground">Set Custom Year Range:</strong> Select Since 2024 or 2024–2026. This guarantees you only find professors who are currently active and publishing!</li>
                  <li><strong className="text-foreground">Identify Corresponding Author:</strong> Open top relevant papers. Look at the title page footer for the Corresponding Author (marked with an asterisk * or email address).</li>
                  <li><strong className="text-foreground">Extract Details:</strong> Note down Professor Name, Department, University, Email Address, and Exact Paper Title.</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/30 backdrop-blur-sm border-l-4 border-l-green-500 md:col-span-1 xl:col-span-2">
              <CardHeader>
                <CardTitle className="text-2xl font-heading">100% Free Application Fee Waivers (US State Universities)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p>Application fees at US State Universities typically cost $75 to $100 USD. You can get them waived (100% Free) using these 3 Proven Strategies:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-foreground">Strategy A: Virtual Graduate Open Houses.</strong> Almost all State Universities (Penn State, UMD, UMass, ASU) host Virtual Graduate Information Sessions in September and October. Attendees of these official webinars receive an exclusive Application Fee Waiver Code sent directly to their email.</li>
                  <li><strong className="text-foreground">Strategy B: Email the Graduate Program Coordinator (GPC).</strong> Send a short, polite email to the CS Graduate Coordinator requesting a fee waiver based on international currency exchange constraints and your strong technical profile.</li>
                  <li><strong className="text-foreground">Strategy C: Professor Sponsorship.</strong> When a professor agrees to sponsor your RA position after receiving your cold email, they can instruct the department to issue an advisor fee waiver code.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-heading">Cold Email Template (180 Words)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-background/50 p-4 rounded-xl border border-border/50 font-mono text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  <span className="text-foreground font-bold">Subject:</span> Prospective Direct PhD / MS Student Inquiry (Fall 2027) – Cybersecurity & Usable Security – Mariyam Ali Khokhar
                  <br/><br/>
                  Dear Professor [Professor's Last Name],
                  <br/><br/>
                  I hope this email finds you well. I am writing to express my strong interest in joining your research group at [State University Name] as a [Direct PhD / Thesis MS] student for Fall 2027. I hold a 4-year BS in Information Technology from Shah Abdul Latif University, Pakistan, complemented by two years of operational data compliance experience at FrieslandCampina and an Innovation Internship with UNICEF Sweden.
                  <br/><br/>
                  I recently read your paper, "[Insert Exact Paper Title]" and was particularly intrigued by your approach to [Insert 1 sentence referencing their specific methodology]. My background combines core cybersecurity standards (ISO/IEC 27001 Associate, CyBOK certified) with hands-on human-centered design.
                  <br/><br/>
                  Currently, I am developing an open-source tool, AutoShield Pakistan, which automates cyber hygiene diagnostics for non-technical organizations in developing nations. I believe my technical background in Python security scripting and usable interface design aligns closely with your lab's ongoing research on [Insert Lab Theme].
                  <br/><br/>
                  Are you currently accepting prospective funded [PhD / MS] students for Fall 2027? I have attached my Academic CV and transcript summary for your review.
                  <br/><br/>
                  Thank you for your time and consideration.
                  <br/><br/>
                  Sincerely,
                  <br/>Mariyam Ali Khokhar
                  <br/>BS Information Technology | Shah Abdul Latif University
                  <br/>GitHub: github.com/[YourUsername] | LinkedIn: linkedin.com/in/[YourProfile]
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">Candidate Background Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-foreground">Degree:</strong> Bachelor of Science in Information Technology (BSIT), Shah Abdul Latif University (SALU), Pakistan (4-Year degree = 16 years education / 240 ECTS equivalent).</li>
                <li><strong className="text-foreground">Corporate Experience:</strong> FrieslandCampina (Sukkur) — Trade Apprentice (Dec 2022 – Dec 2024, 2 full years / 2,800+ hours). Responsibilities included packet integrity testing, digital log sheet management, weekly OEE data reporting, and operational quality compliance. (Officially satisfies the 2-year work experience rule for DAAD EPOS and Chevening!)</li>
                <li><strong className="text-foreground">International / Social Impact:</strong> UNICEF (Remote, Stockholm County, Sweden) — Innovation Intern (Nov 2025 – Apr 2026). Digital asset management, internal knowledge accessibility, innovation documentation, cross-functional international team reporting.</li>
                <li><strong className="text-foreground">Creative & Design Experience:</strong> Dastaan (Illustrator cum Graphic Designer, May 2022 – Apr 2023), GAO Tech (Graphic Design Intern, Apr 2022 – Jul 2022), DigiSkills.pk Certifications in Graphic Design & WordPress.</li>
                <li><strong className="text-foreground">Professional Certifications:</strong> ISO/IEC 27001 Associate, CyBOK Version 1.0 CSFPC, Google AI Essentials & Google Prompting Essentials Specialization.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">CGPA & German Grade Calculation Engine</CardTitle>
              <CardDescription>Bavarian Formula for European applications & Verified Transcript Data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="bg-muted/30 p-4 rounded-xl border border-border/40 space-y-4">
                <h3 className="text-lg font-bold text-foreground">Official Verified Transcript Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <ul className="space-y-1">
                      <li><strong className="text-foreground">Degree:</strong> BS (IT) 4-Year Honors | SALU</li>
                      <li><strong className="text-foreground">Total Marks Secured:</strong> 3,947 / 5,100</li>
                      <li><strong className="text-foreground">Cumulative Percentage:</strong> 78.94%</li>
                      <li><strong className="text-foreground">Official Final Grade:</strong> Grade "A"</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-1">
                      <li><strong className="text-foreground">Estimated HEC CGPA:</strong> 3.55 / 4.00</li>
                      <li><strong className="text-foreground">German Grade Equivalent:</strong> 1.67 / 2.26</li>
                      <li><strong className="text-green-500">Academic Standing:</strong> Sehr Gut / Gut</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <h4 className="font-semibold text-foreground mb-2">Key High-Scoring Major Subjects:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <div>• Final Year Project: 180/200 (90%)</div>
                    <div>• Network Security (Practical): 45/50 (90%)</div>
                    <div>• Digital Logic Design (Theory): 87/100 (87%)</div>
                    <div>• Information System: 85/100 (85%)</div>
                    <div>• Human Computer Interaction: 84/100 (84%)</div>
                    <div>• Linear Algebra: 83/100 (83%)</div>
                    <div>• Information Security: 82/100 (82%)</div>
                    <div>• Statistics & Probability: 80/100 (80%)</div>
                  </div>
                </div>
              </div>


            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}

function AppCard({ title, location, degree, coverage, deadline, url }: any) {
  return (
    <Card className="border-border/40 bg-card/30 backdrop-blur-sm hover:-translate-y-1 hover:border-primary/50 transition-all group flex flex-col h-full">
      <CardHeader className="pb-3 flex-1">
        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
          <a href={url} target="_blank" rel="noreferrer" className="flex items-start justify-between gap-2">
            {title}
            <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
          </a>
        </CardTitle>
        <CardDescription className="flex flex-col gap-1 mt-2">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <Globe className="w-3.5 h-3.5" /> {location}
          </span>
          <span className="flex items-center gap-1.5 text-xs">
            <GraduationCap className="w-3.5 h-3.5" /> {degree}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pb-5">
        <div className="text-xs bg-muted/50 p-2 rounded-md font-mono text-muted-foreground border border-border/40 leading-relaxed">
          {coverage}
        </div>
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground border-t border-border/40 pt-3">
          <span>Deadline:</span>
          <span className="text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">{deadline}</span>
        </div>
      </CardContent>
    </Card>
  );
}
