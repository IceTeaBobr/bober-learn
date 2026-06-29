import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import SettingsClient from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  return (
    <SettingsClient
      userName={session.user.name ?? ""}
      userEmail={session.user.email ?? ""}
    />
  );
}
