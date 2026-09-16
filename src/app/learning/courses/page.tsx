import { LearningClient } from "@/components/learning/learning-client";
import { getLearningResources } from "@/app/actions/learning";

export default async function CoursesPage() {
  const resources = await getLearningResources("COURSE");

  return (
    <div className="flex flex-col h-full w-full bg-background/50">
      <header className="h-16 flex items-center px-8 border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span className="text-foreground">Cyber Journey</span>
          <span>/</span>
          <span>Learning</span>
          <span>/</span>
          <span>Courses</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 min-h-[0px]">
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
