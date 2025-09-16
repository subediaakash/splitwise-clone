import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const DELETE  = async (req: NextRequest, { params }: { params: { groupId: string } }) =>{
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // we need to delete all the payments

    const groupId = params.groupId
    const group = await prisma.group.delete({ where: { id: groupId } })
    return NextResponse.json({ group }, { status: 200 })
}

