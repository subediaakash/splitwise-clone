import { prisma } from "@/lib/prisma";
import { NextResponse} from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const GET = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const raw = await prisma.payment.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            groupId: true,
            totalAmount: true,
            currency: true,
            status: true,
            createdAt: true,
            group: { select: { name: true } },
        },
    })

    const transactions = raw.map(t => ({
        id: t.id,
        groupId: t.groupId,
        groupName: t.group?.name ?? "",
        totalAmount: t.totalAmount,
        currency: t.currency,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
    }))

    return NextResponse.json({ transactions }, { status: 200 })
}

