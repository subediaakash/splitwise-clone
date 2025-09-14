
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { IGroupSchema } from "@/schema/groups/groups.schema"
import { GroupRole } from "@/generated/prisma"

export const POST = async (req: NextRequest) => {
    try {
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const userId = session.user.id
        const { name, description, memberIds = [] } = await req.json() as IGroupSchema & { memberIds?: string[] }

        if (!name || typeof name !== "string") {
            return NextResponse.json({ error: "'name' is required" }, { status: 400 })
        }

        // Ensure unique member ids and exclude creator (we add creator separately with CREATOR role)
        const uniqueMemberIds = Array.isArray(memberIds)
            ? Array.from(new Set(memberIds.filter((id) => id && id !== userId)))
            : []

        const result = await prisma.$transaction(async (tx) => {
            const group = await tx.group.create({
                data: {
                    name,
                    description: description ?? null,
                },
            })

            // Validate users exist to avoid FK errors
            const existingUsers = uniqueMemberIds.length
                ? await tx.user.findMany({ where: { id: { in: uniqueMemberIds } }, select: { id: true } })
                : []
            const validMemberIds = existingUsers.map((u) => u.id)

            const data = [
                { groupId: group.id, userId, role: GroupRole.CREATOR },
                ...validMemberIds.map((id) => ({ groupId: group.id, userId: id, role: GroupRole.MEMBER })),
            ]

            const { count } = await tx.groupMember.createMany({ data, skipDuplicates: true })

            return { group, membersInserted: count }
        })

        return NextResponse.json({
            group: result.group,
            membersInserted: result.membersInserted,
        }, { status: 201 })
    } catch (error: unknown) {
        console.error("create-group error", error)
        return NextResponse.json({ error: "Failed to create group" }, { status: 500 })
    }
}