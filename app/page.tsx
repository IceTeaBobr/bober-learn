import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import TodoApp from "./todo-app";

// Always check the session fresh on each request.
export const dynamic = "force-dynamic";

export default async function Home() {
  // If the visitor is not logged in, send them to the sign-in page.
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  return <TodoApp userEmail={session.user.email ?? ""} />;
}
