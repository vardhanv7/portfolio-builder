import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const fullName = user?.user_metadata?.full_name as string | undefined;
  const initials = fullName
    ? fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  let unreadCount = 0;
  if (user) {
    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("portfolio_owner_id", user.id)
      .eq("is_read", false);
    unreadCount = count ?? 0;
  }

  return (
    <header className="border-b bg-background relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            Portfolio Builder
          </Link>

          <NavbarClient
            avatarUrl={avatarUrl}
            initials={initials}
            fullName={fullName}
            isLoggedIn={!!user}
            unreadCount={unreadCount}
          />
        </div>
      </div>
    </header>
  );
}
