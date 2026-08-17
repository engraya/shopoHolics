import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const anyUser = await db.user.findFirst();
    const userId = anyUser?.id ?? "none";

    const [orderCount, addressCount] = await Promise.all([
      db.order.count({ where: { userId } }),
      db.address.count({ where: { userId } }),
    ]);

    const recentOrders = await db.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { items: true },
    });

    return NextResponse.json({
      ok: true,
      userId,
      orderCount,
      addressCount,
      recent: recentOrders.length,
    });
  } catch (e) {
    const err = e as Error;
    return NextResponse.json(
      {
        ok: false,
        name: err?.constructor?.name,
        message: err?.message ?? String(e),
        stack: err?.stack,
      },
      { status: 500 }
    );
  }
}
