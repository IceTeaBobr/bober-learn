import { createNeonAuth } from "@neondatabase/auth/next/server";

// Server-side Neon Auth instance.
// Provides: auth.handler(), auth.getSession(), auth.signIn/signUp/signOut, auth.middleware().
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
