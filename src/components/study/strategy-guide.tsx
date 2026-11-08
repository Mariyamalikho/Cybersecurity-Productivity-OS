"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, BrainCircuit, Globe, Plane, FileText, Calendar, Compass, ExternalLink, Award } from "lucide-react";

interface OpportunityItem {
  title: string;
  location: string;
  degree: string;
  coverage: string;
  deadline: string;
  url: string;
}

interface LabelTextItem {
  label: string;
  text: string;
}

interface LabelValueItem {
  label: string;
  value: string;
}

export interface StrategyGuideData {
  title: string;
  subtitle: string;
  calls2026: OpportunityItem[];
  calls2027: OpportunityItem[];
  fellowships?: OpportunityItem[];
  usa: OpportunityItem[];
  canada: OpportunityItem[];
  funding: {
    ta: LabelTextItem[];
    ra: LabelTextItem[];
    scholarSteps: string[];
    waiverStrategies: string[];
    coldEmailTemplate: string;
  };
  profile: {
    background: LabelTextItem[];
    transcriptLeft: LabelValueItem[];
    transcriptRight: LabelValueItem[];
    majorSubjects: string[];
  };
}

export function StrategyGuide({ data }: { data?: StrategyGuideData | null }) {
  if (!data) {
    return (
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Master Strategy Guide</CardTitle>
          <CardDescription>
            No strategy configuration found for this account.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          {data.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          {data.subtitle}
        </p>
      </div>

      <Tabs defaultValue="2026-apps" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-nowrap w-full h-auto p-1.5 bg-card/60 backdrop-blur-md gap-1.5 border border-border/50 rounded-xl">
          <TabsTrigger value="2026-apps" className="px-3 py-2.5 flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 shrink-0 text-blue-400" />
            <span>2026 Calls</span>
          </TabsTrigger>
          <TabsTrigger value="2027-apps" className="px-3 py-2.5 flex items-center justify-center gap-2">
            <Compass className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>2027 Calls</span>
          </TabsTrigger>
          {data.fellowships && data.fellowships.length > 0 && (
            <TabsTrigger value="fellowships" className="px-3 py-2.5 flex items-center justify-center gap-2">
              <Award className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Fellowships</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="usa" className="px-3 py-2.5 flex items-center justify-center gap-2">
            <Plane className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>USA Top 15</span>
          </TabsTrigger>
          <TabsTrigger value="canada" className="px-3 py-2.5 flex items-center justify-center gap-2">
            <Plane className="w-4 h-4 shrink-0 text-red-400" />
            <span>Canada Top 10</span>
          </TabsTrigger>
          <TabsTrigger value="funding" className="px-3 py-2.5 flex items-center justify-center gap-2">
            <GraduationCap className="w-4 h-4 shrink-0 text-purple-400" />
            <span>TA/RA Funding</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="px-3 py-2.5 flex items-center justify-center gap-2">
            <BrainCircuit className="w-4 h-4 shrink-0 text-primary" />
            <span>Profile &amp; CGPA</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="2026-apps" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.calls2026?.map((item, idx) => (
              <AppCard key={idx} {...item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="2027-apps" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.calls2027?.map((item, idx) => (
              <AppCard key={idx} {...item} />
            ))}
          </div>
        </TabsContent>

        {data.fellowships && data.fellowships.length > 0 && (
          <TabsContent value="fellowships" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.fellowships.map((item, idx) => (
                <AppCard key={idx} {...item} />
              ))}
            </div>
          </TabsContent>
        )}

        <TabsContent value="usa" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.usa?.map((item, idx) => (
              <AppCard key={idx} {...item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="canada" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.canada?.map((item, idx) => (
              <AppCard key={idx} {...item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="funding" className="mt-6 space-y-6">
          <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">Understanding TA & RA Funding Mechanics</CardTitle>
              <CardDescription>Graduate funding structures and research assistantship overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <FileText className="text-blue-500" /> A. Teaching Assistantship (TA / GTA)
                </h3>
                <ul className="list-none space-y-3 text-muted-foreground ml-7 border-l-2 border-border/50 pl-4">
                  {data.funding?.ta?.map((item, idx) => (
                    <li key={idx}>
                      <strong className="text-foreground">{item.label}:</strong> {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Plane className="text-orange-500" /> B. Research Assistantship (RA / GRA)
                </h3>
                <ul className="list-none space-y-3 text-muted-foreground ml-7 border-l-2 border-border/50 pl-4">
                  {data.funding?.ra?.map((item, idx) => (
                    <li key={idx}>
                      <strong className="text-foreground">{item.label}:</strong> {item.text}
                    </li>
                  ))}
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
                <ol className="list-decimal pl-5 space-y-2 font-medium">
                  {data.funding?.scholarSteps?.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/30 backdrop-blur-sm border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-2xl font-heading">Application Fee Waiver Strategies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <ul className="list-disc pl-5 space-y-2">
                  {data.funding?.waiverStrategies?.map((strategy, idx) => (
                    <li key={idx}>{strategy}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {data.funding?.coldEmailTemplate && (
              <Card className="border-border/40 bg-card/30 backdrop-blur-sm xl:col-span-2">
                <CardHeader>
                  <CardTitle className="text-2xl font-heading">Outreach Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-background/50 p-4 rounded-xl border border-border/50 font-mono text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">
                    {data.funding.coldEmailTemplate}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-heading">Candidate Background Summary</CardTitle>
                  <CardDescription>Academic, Professional, and Research Positioning</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.profile?.background?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-border/50 bg-background/40 hover:border-border transition-colors space-y-1.5"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {item.label}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-heading">CGPA &amp; Grade Conversion Summary</CardTitle>
                  <CardDescription>Verified Transcript &amp; International Grade Equivalency Overview</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Official Transcript Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    {data.profile?.transcriptLeft?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-3.5 rounded-xl border border-border/50 bg-background/40 text-sm"
                      >
                        <span className="text-muted-foreground font-medium">{item.label}</span>
                        <span className="font-heading font-semibold text-foreground sm:text-right">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2.5">
                    {data.profile?.transcriptRight?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-3.5 rounded-xl border border-border/50 bg-background/40 text-sm"
                      >
                        <span className="text-muted-foreground font-medium">{item.label}</span>
                        <span className="font-heading font-semibold text-emerald-400 sm:text-right">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {data.profile?.majorSubjects?.length > 0 && (
                <div className="pt-4 border-t border-border/40 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Key High-Scoring Major Subjects
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {data.profile.majorSubjects.map((subj, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-border/40 bg-background/30 text-xs sm:text-sm font-medium text-foreground"
                      >
                        <Award className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{subj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AppCard({ title, location, degree, coverage, deadline, url }: OpportunityItem) {
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
