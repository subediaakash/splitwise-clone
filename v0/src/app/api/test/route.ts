import prisma from "@/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch all price tables where the user is a member but hasn't paid
    const unpaidPriceTables = await prisma.priceTable.findMany({
      where: {
        members: {
          some: {
            id: userId
          }
        },
        paidBy: {
          none: {
            id: userId
          }
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        paidBy: {
          select: {
            id: true,
          }
        }
      }
    });

    // Remove sensitive information and prepare the response
    const safePriceTables = unpaidPriceTables.map(table => ({
      ...table,
      paidBy: undefined, // Remove paidBy list for privacy
      unpaidCount: table.members.length - table.paidBy.length,
      paidCount: table.paidBy.length,
    }));

    return NextResponse.json(safePriceTables);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
