import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { User } from "@prisma/client";

/**
 * The single boundary between "who is signed in" and the rest of the app.
 *
 * Every server action and protected page goes through here rather than calling
 * the auth provider directly, so migrating from NextAuth to Clerk means
 * rewriting this file alone instead of ~15 call sites. When that happens the
 * bodies become `auth()`/`currentUser()` from @clerk/nextjs/server plus a
 * lookup on `User.clerkId`; the signatures below do not change.
 */

/** The signed-in user's DB row, or null. Never redirects, never creates. */
export async function getCurrentUser(): Promise<User | null> {
  const session = await auth().catch(() => null);
  const id = session?.user?.id;
  if (!id) return null;

  return db.user.findUnique({ where: { id } });
}

/**
 * Same, but guarantees a user. Redirects to /login when signed out, so callers
 * get a non-optional User and can drop the `session!.user.id` assertions that
 * currently lean on the account layout having redirected first.
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
