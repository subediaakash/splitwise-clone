import prisma from "@/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { tableId: string } }) {
    try {
        const tableId = parseInt(params.tableId);
        const { userId } = await request.json();

        if (isNaN(tableId)) {
            return NextResponse.json({ error: 'Invalid table ID' }, { status: 400 });
        }
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const tableWithUser = await prisma.priceTable.findFirst({
            where: {
                id: tableId,
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
                members: true,
                paidBy: true,
            },
        });

        if (!tableWithUser) {
            return NextResponse.json({ error: 'Table not found or user has already paid' }, { status: 404 });
        }

        return NextResponse.json(tableWithUser);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}