import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const DELETE = async (req: NextRequest, { params }: { params: { groupId: string } }) =>{
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json().catch(() => ({} as { userIds?: string[] }))
    const userIds: string[] = Array.isArray(body.userIds) ? body.userIds : []
    if (userIds.length === 0) {
        return NextResponse.json({ error: "No user ids provided" }, { status: 400 })
    }

    const groupId = params.groupId
    if (!groupId) {
        return NextResponse.json({ error: "Group id is required" }, { status: 400 })
    }

    const group = await prisma.group.findUnique({ where: { id: groupId } })
    if (!group) {
        return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    const requester = await prisma.groupMember.findFirst({
        where: { groupId, userId: session.user.id },
        select: { role: true },
    })
    if (!requester) {
        return NextResponse.json({ error: "You are not a member of this group" }, { status: 403 })
    }
    if (requester.role !== "CREATOR") {
        return NextResponse.json({ error: "Only the group creator can remove members" }, { status: 403 })
    }

    const members = await prisma.groupMember.findMany({
        where: { groupId, userId: { in: userIds } },
        select: { userId: true, role: true },
    })

    // Do not delete the creator even if included
    const userIdsToDelete = members.filter(m => m.role !== "CREATOR").map(m => m.userId)
    if (userIdsToDelete.length === 0) {
        return NextResponse.json({ error: "No members to delete" }, { status: 400 })
    }

    const deleted = await prisma.groupMember.deleteMany({ where: { groupId, userId: { in: userIdsToDelete } } })
    return NextResponse.json({ deletedCount: deleted.count, skippedCreator: members.some(m => m.role === "CREATOR") }, { status: 200 })
}