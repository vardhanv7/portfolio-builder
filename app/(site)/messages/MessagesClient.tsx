"use client";

import { useState, useTransition } from "react";
import { Mail, MailOpen, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { markMessageRead, markAllRead } from "@/lib/actions/messages";
import type { Message } from "./page";

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MessagesClient({
  messages: initialMessages,
}: {
  messages: Message[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [isPending, startTransition] = useTransition();

  const unreadCount = messages.filter((m) => !m.is_read).length;

  function handleMarkRead(id: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
    );
    startTransition(async () => {
      await markMessageRead(id);
    });
  }

  function handleMarkAllRead() {
    setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
    startTransition(async () => {
      await markAllRead();
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`
              : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={isPending}
          >
            <CheckCheck className="size-4 mr-1.5" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Empty state */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Mail className="size-8 text-muted-foreground" />
          </div>
          <p className="font-medium">No messages yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Share your portfolio to start receiving messages!
          </p>
        </div>
      )}

      {/* Message list */}
      <div className="flex flex-col gap-3">
        {messages.map((msg) => (
          <Card
            key={msg.id}
            onClick={() => !msg.is_read && handleMarkRead(msg.id)}
            className={cn(
              "transition-colors",
              !msg.is_read
                ? "border-l-[3px] border-l-primary cursor-pointer hover:bg-muted/30"
                : "opacity-80"
            )}
          >
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="mt-0.5 shrink-0">
                  {msg.is_read ? (
                    <MailOpen className="size-4 text-muted-foreground" />
                  ) : (
                    <Mail className="size-4 text-primary" />
                  )}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span
                        className={cn(
                          "text-sm",
                          !msg.is_read && "font-semibold"
                        )}
                      >
                        {msg.sender_name}
                      </span>
                      <a
                        href={`mailto:${msg.sender_email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        {msg.sender_email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(msg.created_at)}
                      </span>
                      {!msg.is_read && (
                        <span className="size-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
