"use client";

import { createAuthClient } from "@neondatabase/auth/next";

// Browser-side auth client: authClient.signIn.email / signUp.email / signOut / useSession.
export const authClient = createAuthClient();
