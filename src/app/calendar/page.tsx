import { getTasks } from "@/app/actions/tasks";
import { CalendarClient } from "./calendar-client";

export default async function CalendarPage() {
  const tasks = await getTasks();
  
  return <CalendarClient tasks={tasks} />;
}
