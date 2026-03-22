"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="text-6xl font-bold text-muted-foreground/30">404</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        This portfolio doesn&apos;t exist or hasn&apos;t been published yet.
      </p>
      <Link href="/" className={buttonVariants({ variant: "outline" }) + " mt-8"}>
        Go home
      </Link>
    </div>
  );
}
