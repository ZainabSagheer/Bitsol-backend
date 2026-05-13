import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalLeads, newLeads, activeClients, totalUsers, recentLeads] = await Promise.all([
    prisma.cRMLead.count(),
    prisma.cRMLead.count({ where: { status: "NEW" } }),
    prisma.cRMLead.count({ where: { status: "ACTIVE" } }),
    prisma.user.count(),
    prisma.cRMLead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return NextResponse.json({
    totalLeads,
    newLeads,
    activeClients,
    totalUsers,
    recentLeads,
  });
}
