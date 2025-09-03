import prisma from "@/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { tableId: string } }) {
    try {
        // Convert tableId to an integer
        const tableId = parseInt(params.tableId);

        // Check if the conversion was successful
        if (isNaN(tableId)) {
            return NextResponse.json({ error: 'Invalid table ID' }, { status: 400 });
        }

        // Query the PriceTable by the integer tableId and include members
        const specificTable = await prisma.priceTable.findUnique({
            where: {
                id: tableId
            },
            include: {
                members: true,  // Include members in the response
                paidBy: true    // Optionally include paidBy if needed
            }
        });

        if (!specificTable) {
            return NextResponse.json({ error: 'PriceTable not found' }, { status: 404 });
        }

        return NextResponse.json(specificTable);
    } catch (error) {
        console.error("Error:", error);
        
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
