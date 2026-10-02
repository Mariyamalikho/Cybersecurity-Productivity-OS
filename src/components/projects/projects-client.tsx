"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FolderGit2, ExternalLink, Activity, CheckCircle2 } from "lucide-react";
import { createProject, updateProjectStatus } from "@/app/actions/projects";
import { useState, useTransition } from "react";

export function ProjectsClient({ projects }: { projects: any[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createProject(formData);
      setOpen(false);
    });
  };

  const handleUpdateStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PLANNING" ? "IN_PROGRESS" : 
                       currentStatus === "IN_PROGRESS" ? "COMPLETED" : "PLANNING";
    
    startTransition(() => {
      updateProjectStatus(id, nextStatus);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 mt-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Portfolio & Projects</h1>
          <p className="text-muted-foreground">Manage your real-world applications and security writeups.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            New Project
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Launch New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" name="title" placeholder="e.g. Next.js SaaS Boilerplate" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="What does this project do?" required className="h-20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input id="githubUrl" name="githubUrl" type="url" placeholder="https://github.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demoUrl">Live Demo URL</Label>
                  <Input id="demoUrl" name="demoUrl" type="url" placeholder="https://..." />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 && (
          <div className="col-span-full p-12 border border-border/40 border-dashed rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground font-medium">No projects in your portfolio yet.</p>
            <p className="text-sm text-muted-foreground/70 mt-2">Click "New Project" to start building your empire.</p>
          </div>
        )}

        {projects.map((project) => (
          <Card key={project.id} className="border-border/40 hover:border-border transition-colors group flex flex-col h-full">
            <CardHeader className="pb-3 pt-5 pl-6">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-lg font-semibold leading-tight">{project.title}</CardTitle>
                <div className="flex gap-2 shrink-0">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <FolderGit2 className="w-4 h-4" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
              <CardDescription className="line-clamp-2 mt-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="pl-6 pb-5 flex-1 flex flex-col justify-end mt-4">
              <div className="flex items-center justify-between border-t border-border/40 pt-4">
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md ${
                  project.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 
                  project.status === 'IN_PROGRESS' ? 'bg-primary/10 text-primary' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  {project.status.replace("_", " ")}
                </span>
                
                <button 
                  onClick={() => handleUpdateStatus(project.id, project.status)}
                  disabled={isPending}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  {project.status === 'COMPLETED' ? (
                    <><CheckCircle2 className="w-4 h-4 text-green-500" /> Finished</>
                  ) : project.status === 'IN_PROGRESS' ? (
                    <><CheckCircle2 className="w-4 h-4" /> Mark Complete</>
                  ) : (
                    <><Activity className="w-4 h-4" /> Start Build</>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
