import { NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const paidGroups = await prisma.priceTable.findMany({
      where: {
        paidBy: {
          some: {
            email: email,
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        paidBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!paidGroups || paidGroups.length === 0) {
      return NextResponse.json(
        { message: "No paid groups found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ paidGroups }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/paid-groups:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
