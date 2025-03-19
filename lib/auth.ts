import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { USER_ROLE } from "./types/users-types";

export type SessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: USER_ROLE;
};

export type Session = {
  user: SessionUser;
};

// This function would normally interact with your auth provider (e.g., Supabase)
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const sessionData = JSON.parse(atob(sessionCookie.value));
    return sessionData;
  } catch (error) {
    console.error("Failed to parse session:", error);
    return null;
  }
}

// Middleware to protect routes
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

// Middleware to protect admin routes
export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== USER_ROLE.ADMIN) {
    redirect("/dashboard");
  }

  return session;
}
