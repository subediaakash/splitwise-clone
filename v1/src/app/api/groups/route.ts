import {  NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const GET = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const groups = await prisma.group.findMany({
    where: {
      groupMembers: {
        some: { userId },
      },
    },
    include: {
      groupMembers: {
        include: {
          user: true, 
        },
      },
      expenses: true, 
    },
  });

  return NextResponse.json(groups, { status: 200 });
};
