// src/app/api/getUser/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/db';

export async function POST(request: Request) {
    const { email } = await request.json();

    try {
        console.log(email);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user) {
            return NextResponse.json({ id: user.id });
        } else {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}
