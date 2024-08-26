import { NextResponse } from 'next/server';
import prisma from '@/db';

export async function GET() {
    try {
        const users = await prisma.user.findMany({});
        console.log("this api is begin called");

        return NextResponse.json(users);
    } catch (err) {
        return NextResponse.json({ msg: "Error occurred while fetching the users" }, { status: 404 });
    }
}
