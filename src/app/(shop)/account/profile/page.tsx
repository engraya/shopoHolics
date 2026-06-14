import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile — Shopoholics" };

async function updateProfile(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) return;
  const name = formData.get("name") as string;
  await db.user.update({ where: { id: session.user.id }, data: { name } });
  revalidatePath("/account/profile");
}

export default async function ProfilePage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Profile</h1>

      <div className="rounded-lg border border-border bg-card p-6">
        <form action={updateProfile} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Full name
            </label>
            <Input
              id="name"
              name="name"
              defaultValue={session!.user.name ?? ""}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input value={session!.user.email ?? ""} disabled className="text-muted-foreground" readOnly />
            <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
          </div>

          <Button type="submit">Save changes</Button>
        </form>
      </div>
    </div>
  );
}
