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
        return NextResponse.json({ error: 'Invalid price table ID' }, { status: 400 });
    }

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const priceTable = await prisma.priceTable.findUnique({
            where: { id: priceTableId },
            include: { members: true, paidBy: true }
        });

        if (!priceTable) {
            return NextResponse.json({ error: 'Price table not found' }, { status: 404 });
        }

        if (priceTable.paidBy.some(user => user.id === userId)) {
            return NextResponse.json({ error: 'User has already paid' }, { status: 400 });
        }

        const totalMembers = priceTable.members.length;
        const eachIndividualAmount = Math.floor(priceTable.totalPrice / totalMembers);
        const remainingAmount = priceTable.totalPrice - (eachIndividualAmount * (priceTable.paidBy.length + 1));

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
                },
                amountRemaining: remainingAmount,
                fullPaid: remainingAmount === 0
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