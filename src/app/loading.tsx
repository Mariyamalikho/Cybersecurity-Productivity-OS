import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-background/50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 animate-pulse" />
          <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-spin" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Decrypting data...</p>
      </div>
    </div>
  );
}
