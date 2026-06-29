import { auth } from "@/lib/auth/server";

// Handles all /api/auth/* requests (sign in, sign up, session, sign out)
// by proxying them to Neon Auth.
export const { GET, POST } = auth.handler();
