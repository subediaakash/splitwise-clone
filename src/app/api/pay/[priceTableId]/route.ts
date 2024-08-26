import { NextRequest } from 'next/server';
import prisma from "@/db";
import { NextResponse } from 'next/server';

export async function POST(
    req: NextRequest,
    { params }: { params: { priceTableId: string } }
) {
    const priceTableId = parseInt(params.priceTableId);
    const { userId } = await req.json();

    if (isNaN(priceTableId)) {
        return NextResponse.json({ error: 'Invalid price table ID' }, { status: 404 });
    }

    console.log('log3');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const priceTable = await prisma.priceTable.findUnique({
            where: { id: priceTableId },
        });

        if (!priceTable) {
            return NextResponse.json({ error: 'Price table not found' }, { status: 404 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const updatedPriceTable = await prisma.priceTable.update({
            where: { id: priceTableId },
            data: {
                paidBy: {
                    connect: { id: userId }
                }
            },
            include: {
                paidBy: true
            }
        });

        return NextResponse.json(updatedPriceTable);
    } catch (error) {
        console.error('Error updating priceTable:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}