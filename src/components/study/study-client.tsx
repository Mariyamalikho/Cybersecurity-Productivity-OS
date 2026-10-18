"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Globe, Calendar, PlaneTakeoff, XCircle, CheckCircle2 } from "lucide-react";
import { createStudyAbroadApp, updateStudyAbroadStatus } from "@/app/actions/study";
import { useState, useTransition } from "react";
import { format } from "date-fns";

export function StudyClient({ apps }: { apps: any[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createStudyAbroadApp(formData);
      setOpen(false);
    });
  };

  const handleUpdateStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "RESEARCHING" ? "APPLIED" : 
                       currentStatus === "APPLIED" ? "ACCEPTED" : "RESEARCHING";
    
    startTransition(() => {
      updateStudyAbroadStatus(id, nextStatus);
    });
  };

  const handleReject = (id: string) => {
    startTransition(() => {
      updateStudyAbroadStatus(id, "REJECTED");
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 mt-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Study Abroad Pipeline</h1>
          <p className="text-muted-foreground">Track your university applications and global journey.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/study-abroad/guide" className="flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors shadow-sm border border-border/40">
            <Globe className="w-4 h-4 text-blue-500" />
            Master Strategy Guide
          </a>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Add Application
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Application</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="university">University Name</Label>
                <Input id="university" name="university" placeholder="e.g. Technical University of Munich" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" placeholder="e.g. Germany" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input id="deadline" name="deadline" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes / Requirements</Label>
                <Textarea id="notes" name="notes" placeholder="IELTS 7.0, Statement of Purpose needed..." className="h-20" />
              </div>
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Adding..." : "Add Application"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.length === 0 && (
          <div className="col-span-full p-12 border border-border/40 border-dashed rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground font-medium">No applications tracked yet.</p>
            <p className="text-sm text-muted-foreground/70 mt-2">Start mapping your global journey today.</p>
          </div>
        )}

        {apps.map((app) => (
          <Card key={app.id} className={`border-border/40 transition-colors group flex flex-col h-full ${app.status === 'REJECTED' ? 'opacity-60 grayscale' : 'hover:border-border'}`}>
            <CardHeader className="pb-3 pt-5 pl-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  {app.url ? (
                    <a href={app.url} target="_blank" rel="noreferrer" className="hover:underline decoration-primary">
                      <CardTitle className="text-lg font-semibold leading-tight">{app.university}</CardTitle>
                    </a>
                  ) : (
                    <CardTitle className="text-lg font-semibold leading-tight">{app.university}</CardTitle>
                  )}
                  <p className="text-xs font-medium text-muted-foreground mt-1 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {app.country}
                  </p>
                </div>
              </div>
              {app.notes && (
                <CardDescription className="line-clamp-2 mt-3 text-xs border border-border/40 bg-muted/20 p-2 rounded-md">
                  {app.notes}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pl-6 pb-5 flex-1 flex flex-col justify-end mt-4">
              
              {app.deadline && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                  <Calendar className="w-3.5 h-3.5" />
                  Due: {format(new Date(app.deadline), "MMM do, yyyy")}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-border/40 pt-4">
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md ${
                  app.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-500' : 
                  app.status === 'APPLIED' ? 'bg-orange-500/10 text-orange-500' : 
                  app.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' : 
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  {app.status}
                </span>
                
                {app.status !== 'ACCEPTED' && app.status !== 'REJECTED' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleReject(app.id)}
                      disabled={isPending}
                      className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                      title="Mark Rejected"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(app.id, app.status)}
                      disabled={isPending}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      {app.status === 'RESEARCHING' ? 'Mark Applied' : 'Mark Accepted (+50 XP)'}
                    </button>
                  </div>
                )}
                {app.status === 'ACCEPTED' && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-green-500">
                    <PlaneTakeoff className="w-4 h-4" /> Destination Set
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
