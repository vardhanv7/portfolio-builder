import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MessagesClient from "./MessagesClient";

export const dynamic = "force-dynamic";

export interface Message {
  id: string;
  portfolio_owner_id: string;
  sender_name: string;
  sender_email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/messages");

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("portfolio_owner_id", user.id)
    .order("created_at", { ascending: false });

  return <MessagesClient messages={(messages as Message[]) ?? []} />;
}
