"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-full w-full p-8 bg-background/50">
      <Card className="max-w-md w-full border-border/40 bg-card/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl font-heading">Temporary Connection Issue</CardTitle>
          <CardDescription>
            The database connection timed out or reset while loading this view.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error?.message && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border/40 font-mono text-xs text-muted-foreground break-words">
              {error.message}
            </div>
          )}
          <Button onClick={() => reset()} className="w-full gap-2">
            <RefreshCw className="w-4 h-4" /> Retry Loading Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
