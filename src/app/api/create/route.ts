
import { NextRequest, NextResponse } from 'next/server';
import { createGroup } from '@/actions/createGroup';

export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        const { creatorId, totalPrice, memberIds, description } = await req.json();

        if (typeof creatorId !== 'number' || typeof totalPrice !== 'number' || !Array.isArray(memberIds)) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        try {
            const result = await createGroup({
                creatorId,
                totalPrice,
                memberIds,
                description
            });

            if (result.success) {
                return NextResponse.json(result, { status: 200 });
            } else {
                return NextResponse.json({ error: result.error }, { status: 400 });
            }
        } catch (error) {
            console.error('Error during group creation:', error);
            return NextResponse.json({ error: 'An error occurred during group creation.' }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
    }
}
