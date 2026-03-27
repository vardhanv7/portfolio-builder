"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";

interface NavbarClientProps {
  avatarUrl?: string;
  initials: string;
  fullName?: string;
  isLoggedIn: boolean;
  unreadCount: number;
}

export default function NavbarClient({
  avatarUrl,
  initials,
  fullName,
  isLoggedIn,
  unreadCount,
}: NavbarClientProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Desktop nav ──────────────────────────────────────────────────── */}
      <div className="hidden sm:flex items-center gap-3">
        {isLoggedIn ? (
          <>
            <Link
              href="/builder"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Builder
            </Link>
            <Link
              href="/preview"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Preview
            </Link>
            {/* Messages icon + unread badge */}
            <Link
              href="/messages"
              aria-label={
                unreadCount > 0
                  ? `Messages (${unreadCount} unread)`
                  : "Messages"
              }
              className="relative text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[10px] font-bold text-primary-foreground leading-none">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt={fullName ?? "User"} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <form action={signOut}>
              <Button variant="ghost" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </>
        ) : (
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
        )}
      </div>

      {/* ── Mobile hamburger button ───────────────────────────────────────── */}
      <button
        className="sm:hidden flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* ── Mobile dropdown ──────────────────────────────────────────────── */}
      {open && (
        <div className="sm:hidden absolute top-full left-0 right-0 border-b bg-background z-50 px-4 py-3 flex flex-col gap-1 shadow-sm">
          {isLoggedIn ? (
            <>
              <Link
                href="/builder"
                onClick={() => setOpen(false)}
                className="flex items-center h-9 px-2 text-sm rounded-md hover:bg-muted transition-colors"
              >
                Builder
              </Link>
              <Link
                href="/preview"
                onClick={() => setOpen(false)}
                className="flex items-center h-9 px-2 text-sm rounded-md hover:bg-muted transition-colors"
              >
                Preview
              </Link>
              <Link
                href="/messages"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between h-9 px-2 text-sm rounded-md hover:bg-muted transition-colors"
              >
                <span>Messages</span>
                {unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
              <form action={signOut} className="mt-1">
                <button
                  type="submit"
                  className="flex items-center h-9 w-full px-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center h-9 px-2 text-sm rounded-md hover:bg-muted transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </>
  );
}
