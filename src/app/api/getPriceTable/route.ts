import prisma from "@/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        const tableWithUser = await prisma.priceTable.findMany({
            where: {
                members: {
                    some: {
                        email: email,
                    },
                },
            },
            include: {
                members: true,
            },
        });

        const members = tableWithUser.map((table) => table.members);

        return NextResponse.json(tableWithUser);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}