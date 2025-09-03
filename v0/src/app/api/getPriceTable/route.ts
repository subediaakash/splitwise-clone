import prisma from "@/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    const unpaidPriceTables = await prisma.priceTable.findMany({
      where: {
        members: {
          some: {
            email:email
          }
        },
        paidBy: {
          none: {
            email: email
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

    const safePriceTables = unpaidPriceTables.map(table => ({
      ...table,
      paidBy: undefined, 
      unpaidCount: table.members.length - table.paidBy.length,
      paidCount: table.paidBy.length,
    }));

    return NextResponse.json(safePriceTables);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
