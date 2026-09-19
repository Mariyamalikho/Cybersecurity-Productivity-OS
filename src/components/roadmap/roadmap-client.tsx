"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Code2, ShieldAlert, FileText, Globe, GitBranch, Terminal, Target } from "lucide-react";

export function RoadmapClient() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Strategic Roadmap</h1>
        <p className="text-muted-foreground">Your 22-Week Intensive Master Plan for Cybersecurity, Python Mastery, and Study Abroad.</p>
      </div>

      <Tabs defaultValue="phase1" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto gap-2 bg-transparent">
          <TabsTrigger value="daily" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary border border-border/40 py-2">Daily Protocol</TabsTrigger>
          <TabsTrigger value="phase1" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary border border-border/40 py-2">Phase 1</TabsTrigger>
          <TabsTrigger value="phase2" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary border border-border/40 py-2">Phase 2</TabsTrigger>
          <TabsTrigger value="phase3" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary border border-border/40 py-2">Phase 3</TabsTrigger>
          <TabsTrigger value="phase4" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary border border-border/40 py-2">Phase 4</TabsTrigger>
          <TabsTrigger value="sprint" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary border border-border/40 py-2">22-Week Sprint</TabsTrigger>
        </TabsList>

        {/* DAILY PROTOCOL */}
        <TabsContent value="daily" className="mt-6 space-y-6">
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Daily Execution Protocol</CardTitle>
              <CardDescription className="mt-1">Non-negotiable daily habits and strategy to hit the 2027 deadline.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Daily Time Block Strategy (4-5 Hours)
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>Deep Work (2 Hours):</strong> Core coursework, Python coding, and building AutoShield/ICD Vault.</span></li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>Hands-On Labs (1.5 Hours):</strong> TryHackMe, CTFs, or Linux terminal practice.</span></li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>Language & Master's Prep (1 Hour):</strong> IELTS practice, essay drafting, or university research.</span></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-2">
                  <Target className="w-5 h-5 text-primary" />
                  Non-Negotiable Daily Reminders
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-muted/30 p-4 rounded-lg border border-border/40">
                    <p className="font-bold text-foreground mb-1">GitHub Consistency</p>
                    <p className="text-muted-foreground text-xs">Push code EVERY SINGLE DAY. Even a small refactor counts. Green squares equal credibility.</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg border border-border/40">
                    <p className="font-bold text-foreground mb-1">Log Cyber Hygiene</p>
                    <p className="text-muted-foreground text-xs">Document your learnings in the Journal. Keep track of what you learned in CTFs.</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg border border-border/40">
                    <p className="font-bold text-foreground mb-1">Build & Type Everything</p>
                    <p className="text-muted-foreground text-xs">Don't just copy-paste Python. Type out the code to build muscle memory. Build more than you watch.</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg border border-border/40">
                    <p className="font-bold text-foreground mb-1">Master's Milestones</p>
                    <p className="text-muted-foreground text-xs">Check university portals weekly. Don't miss Winter 2026/Spring 2027 deadlines.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PHASE 1 */}
        <TabsContent value="phase1" className="mt-6 space-y-6">
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-primary">Phase 1: Mandatory Foundations & Python Basics</CardTitle>
                  <CardDescription className="mt-1">Estimated Duration: November 2026 (Weeks 1–4)</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Clock className="w-3 h-3 mr-1" />
                  1 Month
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-2">
                  <Globe className="w-5 h-5 text-primary" />
                  1. Cyber Foundational Coursework
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>Google IT Automation with Python:</strong> Replaces generic IT Support. Master OS interaction, Git, and troubleshooting via scripts.</span></li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>90 Days of Cyber (Days 1-14):</strong> Network+ & Security+ fundamentals (Professor Messer).</span></li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>90 Days of Cyber (Days 15-28):</strong> Linux Journey, Cisco NetAcad Linux Unhatched, LabEx.</span></li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>Intro to Cyber Security (NYU):</strong> Security fundamentals, threat landscape, cryptography basics.</span></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  2. Integrated Python Phases 1 & 2
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3"><Terminal className="w-5 h-5 text-primary shrink-0" /> <span><strong>Python for Everybody (Basics):</strong> Core syntax, variables, strings, numbers, booleans.</span></li>
                  <li className="flex gap-3"><Terminal className="w-5 h-5 text-primary shrink-0" /> <span><strong>Interactivity & Logic (Scrimba):</strong> Control flow (if/elif/else), loops, and writing reusable functions.</span></li>
                  <li className="flex gap-3"><Terminal className="w-5 h-5 text-primary shrink-0" /> <span><strong>Systems Programming:</strong> C & C++ (foundational security concepts, memory management).</span></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-2">
                  <FileText className="w-5 h-5 text-primary" />
                  3. Human Languages & Profile Setup
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3"><Globe className="w-5 h-5 text-primary shrink-0" /> <span><strong>Languages:</strong> English immersion (IELTS Band 7+ target).</span></li>
                  <li className="flex gap-3"><GitBranch className="w-5 h-5 text-primary shrink-0" /> <span><strong>GitHub:</strong> Set up immediately to commit daily code and document progress.</span></li>
                </ul>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* PHASE 2 */}
        <TabsContent value="phase2" className="mt-6 space-y-6">
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-primary">Phase 2: Cybersecurity Core & Applied Python</CardTitle>
                  <CardDescription className="mt-1">Estimated Duration: December 2026 – January 2027 (Weeks 5–12)</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Clock className="w-3 h-3 mr-1" />
                  2 Months
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-2">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  1. Advanced Certifications
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>IBM Cybersecurity Analyst:</strong> SOC concepts, incident response, SIEM basics, vulnerability management.</span></li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>Microsoft Cybersecurity Analyst:</strong> Security ops, threat detection, enterprise security.</span></li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>Linux Deep Dive:</strong> Command line, system admin, and permissions.</span></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  2. Integrated Python Phase 3 & Labs
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3"><Terminal className="w-5 h-5 text-primary shrink-0" /> <span><strong>Python File I/O & Scripts:</strong> Master opening, reading, and writing to logs. Save all scripts to GitHub.</span></li>
                  <li className="flex gap-3"><Terminal className="w-5 h-5 text-primary shrink-0" /> <span><strong>90 Days of Cyber (Days 29-77):</strong> Python Scripts, Traffic Analysis (Wireshark/Suricata), Git, ELK Stack, Cloud (AWS/GCP/Azure).</span></li>
                  <li className="flex gap-3"><Terminal className="w-5 h-5 text-primary shrink-0" /> <span><strong>CTF Participation:</strong> Hack The Box, TryHackMe, picoCTF and OverTheWire Bandit challenges.</span></li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PHASE 3 */}
        <TabsContent value="phase3" className="mt-6 space-y-6">
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-primary">Phase 3: Portfolio Projects & Platform Strategy</CardTitle>
                  <CardDescription className="mt-1">Estimated Duration: February 2027 (Weeks 13–17)</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Clock className="w-3 h-3 mr-1" />
                  1 Month
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Platform & Python Phase 4 Focus
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3"><GitBranch className="w-5 h-5 text-primary shrink-0" /> <span><strong>GitHub (~70% Effort):</strong> Primary focus. Developer portfolio, open-source tools, Git workflows.</span></li>
                  <li className="flex gap-3"><Code2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>Kaggle / Data Focus (~30% Effort):</strong> Use Pandas to analyze CSVs (logs) and AI applied to cybersecurity.</span></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-2">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  Project 1: AutoShield Pakistan
                </h3>
                <p className="text-sm text-muted-foreground">Modular, open-source cyber hygiene automation tool tailored for developing nations.</p>
                <div className="bg-muted/30 p-4 rounded-lg font-mono text-xs text-muted-foreground border border-border/40">
                  <p className="text-primary font-bold mb-2">Tech Stack: Python, SQLite, Flask, Scapy, YARA.</p>
                  Week 13: Password auditor.<br/>
                  Week 14: Port scanner module.<br/>
                  Week 15: Patch checker module.<br/>
                  Week 16: Automated PDF report generation.
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Project 2: ICD Vault (In Case of Death)
                </h3>
                <p className="text-sm text-muted-foreground">Secure digital inheritance platform releasing documents upon verified inactivity.</p>
                <div className="bg-muted/30 p-4 rounded-lg font-mono text-xs text-muted-foreground border border-border/40">
                  <p className="text-primary font-bold mb-2">Rule: Never automatically release data solely due to an expired timer.</p>
                  <strong>MVP Tech Stack:</strong> Frontend (React/Vite), Backend/Auth (Supabase PostgreSQL), Hosting (Vercel).
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-2">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  Project 3: Digital Forensics & Incident Response (DFIR)
                </h3>
                <p className="text-sm text-muted-foreground">Formal forensic investigations to build a highly technical portfolio for Master's applications.</p>
                <div className="bg-muted/30 p-4 rounded-lg font-mono text-xs text-muted-foreground border border-border/40">
                  <p className="text-primary font-bold mb-2">Write detailed case reports for GitHub:</p>
                  1. NIST Intellectual Property Data Leakage Case.<br/>
                  2. Memory Forensics (Illegal File Transferring).<br/>
                  3. IoT/Mobile Chip-off & Extraction (Eufy, Echo Show).
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* PHASE 4 */}
        <TabsContent value="phase4" className="mt-6 space-y-6">
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-primary">Phase 4: Research, Publication & Master's App</CardTitle>
                  <CardDescription className="mt-1">Estimated Duration: March 2027 (Weeks 18–22)</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Clock className="w-3 h-3 mr-1" />
                  1 Month
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-2">
                  <FileText className="w-5 h-5 text-primary" />
                  1. Research Paper Roadmap & Python Phase 5
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>Target Title:</strong> "The Urgent Need for Cyber Hygiene in Developing Nations: A Case for Automation"</span></li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>Connect the Dots (Python):</strong> Refactor old code and use AI tools to generate ideas and parse logs.</span></li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>Synergy:</strong> Python script data + SQL logging + Chart.js dashboards = Concrete proof.</span></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-2">
                  <Globe className="w-5 h-5 text-primary" />
                  2. Master's Application Timeline
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>Standardized Exams:</strong> Take IELTS (target Band 7.0+).</span></li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>Academic Documents:</strong> Draft SOP, collect Recommendation Letters.</span></li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> <span><strong>Program Applications:</strong> Submit for 2027 intake in Germany, Finland, Estonia.</span></li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SPRINT */}
        <TabsContent value="sprint" className="mt-6 space-y-6">
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Summary of the Accelerated 22-Week Skill Sprint</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border/40 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground border-b border-border/40">
                    <tr>
                      <th className="px-4 py-3 font-medium">Timeframe (2026/27)</th>
                      <th className="px-4 py-3 font-medium">Technical Focus</th>
                      <th className="px-4 py-3 font-medium">Core Deliverable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr className="bg-card/30">
                      <td className="px-4 py-3 font-medium text-foreground">Nov 2026 (Weeks 1-4)</td>
                      <td className="px-4 py-3 text-muted-foreground">Python (Basics/Loops), Google IT Automation, Net+/Sec+</td>
                      <td className="px-4 py-3 text-muted-foreground">Foundations & Simple Scripts</td>
                    </tr>
                    <tr className="bg-card/50">
                      <td className="px-4 py-3 font-medium text-foreground">Dec 2026 – Jan 2027 (Weeks 5-12)</td>
                      <td className="px-4 py-3 text-muted-foreground">C/C++, Traffic Analysis, Python File I/O, ELK</td>
                      <td className="px-4 py-3 text-muted-foreground">Certifications & System Security Basics</td>
                    </tr>
                    <tr className="bg-card/30">
                      <td className="px-4 py-3 font-medium text-foreground">Feb 2027 (Weeks 13-17)</td>
                      <td className="px-4 py-3 text-muted-foreground">Python Flask/Pandas, AutoShield, ICD Vault</td>
                      <td className="px-4 py-3 text-muted-foreground">AutoShield Pakistan & ICD Vault MVP built</td>
                    </tr>
                    <tr className="bg-card/50">
                      <td className="px-4 py-3 font-medium text-foreground">Mar 2027 (Weeks 18-22)</td>
                      <td className="px-4 py-3 text-muted-foreground">Writing, IELTS, App Assembly, Refactoring</td>
                      <td className="px-4 py-3 text-muted-foreground">Master's Applications Submitted & Paper Drafted</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
