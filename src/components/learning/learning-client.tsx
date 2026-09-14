"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, ExternalLink, PlayCircle, CheckCircle2 } from "lucide-react";
import { createLearningResource, updateResourceProgress } from "@/app/actions/learning";
import { useState, useTransition } from "react";

type Resource = {
  id: string;
  title: string;
  type: string;
  status: string;
  progress: number;
  url: string | null;
};

export function LearningClient({ resources, type, title, desc }: { resources: Resource[], type: string, title: string, desc: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createLearningResource(formData, type);
      setOpen(false);
    });
  };

  const handleUpdateProgress = (id: string, currentProgress: number) => {
    const newProgress = currentProgress >= 100 ? 0 : currentProgress + 25;
    startTransition(() => {
      updateResourceProgress(id, newProgress, type);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 mt-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">{title}</h1>
          <p className="text-muted-foreground">{desc}</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add Resource
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add {title} Resource</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="e.g. TryHackMe: Intro to Networking" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL (Optional)</Label>
                <Input id="url" name="url" type="url" placeholder="https://..." />
              </div>
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Adding..." : "Add Resource"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.length === 0 && (
          <div className="col-span-full p-12 border border-border/40 border-dashed rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground font-medium">No resources tracked yet.</p>
            <p className="text-sm text-muted-foreground/70 mt-2">Click "Add Resource" to get started.</p>
          </div>
        )}

        {resources.map((resource) => (
          <Card key={resource.id} className="border-border/40 hover:border-border transition-colors group">
            <CardHeader className="pb-3 pt-5 pl-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold leading-tight pr-4">{resource.title}</CardTitle>
                {resource.url && (
                  <a href={resource.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </CardHeader>
            <CardContent className="pl-6 pb-5">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span>Progress</span>
                    <span>{resource.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ease-out ${resource.progress === 100 ? 'bg-green-500' : 'bg-primary'}`} 
                      style={{ width: `${resource.progress}%` }} 
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md ${
                    resource.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 
                    resource.status === 'IN_PROGRESS' ? 'bg-primary/10 text-primary' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {resource.status.replace("_", " ")}
                  </span>
                  
                  <button 
                    onClick={() => handleUpdateProgress(resource.id, resource.progress)}
                    disabled={isPending}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    {resource.progress === 100 ? (
                      <><CheckCircle2 className="w-4 h-4 text-green-500" /> Completed</>
                    ) : (
                      <><PlayCircle className="w-4 h-4" /> Advance +25%</>
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
