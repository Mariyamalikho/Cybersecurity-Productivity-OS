"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { createHabit } from "@/app/actions/habits";
import { useState, useTransition } from "react";

export function HabitDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      await createHabit(formData);
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
        <Plus className="w-4 h-4" />
        New Habit
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input id="name" name="name" placeholder="e.g. Read 10 Pages" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" placeholder="e.g. Cybersecurity, Health" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Input id="priority" name="priority" placeholder="High, Medium, or Low" />
          </div>
          
          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Saving..." : "Create Habit"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
