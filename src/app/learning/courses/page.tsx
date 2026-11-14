import type { Metadata } from "next";
import { LearningClient } from "@/components/learning/learning-client";
import { getLearningResources } from "@/app/actions/learning";

export const metadata: Metadata = {
  title: "Courses & Certifications — Educational Tracks",
  description:
    "Structured technical course tracker covering CompTIA Network+ N10-009, Google IT Automation, and specialized engineering certifications.",
  alternates: { canonical: "/learning/courses" },
};

export default async function CoursesPage() {
  const resources = await getLearningResources("COURSE");

  return (
    <div className="flex flex-col h-full w-full bg-background/50">
      <header className="h-16 flex items-center px-4 sm:px-6 lg:px-8 border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-20 shrink-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span className="text-foreground">Learning</span>
          <span aria-hidden="true">/</span>
          <span className="text-foreground/90 font-semibold">Courses</span>
        </nav>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 min-h-[0px]">
        <LearningClient 
          resources={resources} 
          type="COURSE" 
          title="Courses & Certifications" 
          desc="Track your progress through structured educational content." 
        />
      </div>
    </div>
  );
}
