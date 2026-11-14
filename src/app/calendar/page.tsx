import type { Metadata } from "next";
import { getTasks } from "@/app/actions/tasks";
import { CalendarClient } from "./calendar-client";

export const metadata: Metadata = {
  title: "Academic & Study Calendar — Daily Execution Schedule",
  description:
    "Interactive academic study schedule with week and month views, upcoming deadlines, milestone tracking, and task scheduling.",
  alternates: { canonical: "/calendar" },
};

export default async function CalendarPage() {
  const tasks = await getTasks();
  
  return <CalendarClient tasks={tasks} />;
}
