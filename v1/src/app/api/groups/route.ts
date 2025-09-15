import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

export const GET = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rawGroups = await prisma.group.findMany({
        where: {
            groupMembers: {
                some: {
                    userId: session.user.id,
                },
            },
        },
        include: {
            groupMembers: {
                where: { userId: session.user.id },
                select: { role: true },
            },
        },
        orderBy: { createdAt: "desc" },
    })

    // Map DB shape to UI-friendly shape
    const groups = rawGroups.map((g) => {
        const membership = g.groupMembers[0]
        const selfCreated = membership?.role === "CREATOR"
        const status =
            g.settlementStatus === "CLEAR"
                ? "paid"
                : g.settlementStatus === "PARTIALLY_CLEAR"
                ? "partiallyPaid"
                : "unpaid"

        return {
            id: g.id,
            name: g.name,
            createdAt: g.createdAt.toISOString(),
            status,
            selfCreated,
        }
    })

    return NextResponse.json({ groups }, { status: 200 })
}