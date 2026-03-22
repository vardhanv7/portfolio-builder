"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-6xl font-bold text-muted-foreground/30">!</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground text-sm">
        {error.message ?? "An unexpected error occurred."}
      </p>
      <Button onClick={reset} className="mt-8">
        Try again
      </Button>
    </div>
  );
}
