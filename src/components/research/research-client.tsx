"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, BookOpen, ExternalLink, PenTool, CheckCircle2 } from "lucide-react";
import { createResearchPaper, updateResearchStatus } from "@/app/actions/research";
import { useState, useTransition } from "react";

export function ResearchClient({ papers }: { papers: any[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createResearchPaper(formData);
      setOpen(false);
    });
  };

  const handleUpdateStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "READING" ? "DRAFTING" : 
                       currentStatus === "DRAFTING" ? "PUBLISHED" : "READING";
    
    startTransition(() => {
      updateResearchStatus(id, nextStatus);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 mt-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Academic Research</h1>
          <p className="text-muted-foreground">Organize literature reviews, drafts, and published papers.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add Paper
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Research Paper</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Paper Title</Label>
                <Input id="title" name="title" placeholder="e.g. LLMs in Offensive Security" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abstract">Abstract / Notes</Label>
                <Textarea id="abstract" name="abstract" placeholder="Key takeaways..." className="h-24" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">PDF URL (Optional)</Label>
                <Input id="url" name="url" type="url" placeholder="https://arxiv.org/..." />
              </div>
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Adding..." : "Add Paper"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {papers.length === 0 && (
          <div className="col-span-full p-12 border border-border/40 border-dashed rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground font-medium">No research papers added yet.</p>
            <p className="text-sm text-muted-foreground/70 mt-2">Start organizing your academic journey today.</p>
          </div>
        )}

        {papers.map((paper) => (
          <Card key={paper.id} className="border-border/40 hover:border-border transition-colors group flex flex-col h-full">
            <CardHeader className="pb-3 pt-5 pl-6">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-lg font-semibold leading-tight">{paper.title}</CardTitle>
                {paper.url && (
                  <a href={paper.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors shrink-0">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <CardDescription className="line-clamp-3 mt-2">{paper.abstract}</CardDescription>
            </CardHeader>
            <CardContent className="pl-6 pb-5 flex-1 flex flex-col justify-end mt-4">
              <div className="flex items-center justify-between border-t border-border/40 pt-4">
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md ${
                  paper.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' : 
                  paper.status === 'DRAFTING' ? 'bg-orange-500/10 text-orange-500' : 
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  {paper.status}
                </span>
                
                <button 
                  onClick={() => handleUpdateStatus(paper.id, paper.status)}
                  disabled={isPending}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  {paper.status === 'PUBLISHED' ? (
                    <><CheckCircle2 className="w-4 h-4 text-green-500" /> Published</>
                  ) : paper.status === 'DRAFTING' ? (
                    <><CheckCircle2 className="w-4 h-4" /> Publish (+30 XP)</>
                  ) : (
                    <><PenTool className="w-4 h-4" /> Start Drafting</>
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
