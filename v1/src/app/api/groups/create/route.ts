
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
        const creatorEmail = session.user.email?.toLowerCase() ?? null
        const { name, description, memberEmails = [] } = await req.json() as IGroupSchema & { memberEmails?: string[] }

        if (!name || typeof name !== "string") {
            return NextResponse.json({ error: "'name' is required" }, { status: 400 })
        }

        // Normalize and de-duplicate emails, and exclude creator's email
        const uniqueMemberEmails = Array.isArray(memberEmails)
            ? Array.from(new Set(
                memberEmails
                    .filter((e) => typeof e === "string")
                    .map((e) => e.trim().toLowerCase())
                    .filter((e) => e && e !== creatorEmail)
              ))
            : []

        const existingUsers = uniqueMemberEmails.length
            ? await prisma.user.findMany({
                where: { email: { in: uniqueMemberEmails } },
                select: { id: true, email: true },
            })
            : []

        const foundEmailSet = new Set(existingUsers.map((u) => u.email.toLowerCase()))
        const missingEmails = uniqueMemberEmails.filter((e) => !foundEmailSet.has(e))
        if (missingEmails.length > 0) {
            return NextResponse.json({
                error: "The following email(s) don't belong to our app. Please invite them to sign up.",
                missingEmails,
            }, { status: 400 })
        }

        const result = await prisma.$transaction(async (tx) => {
            const group = await tx.group.create({
                data: {
                    name,
                    description: description ?? null,
                },
            })

            const data = [
                { groupId: group.id, userId, role: GroupRole.CREATOR },
                ...existingUsers.map((u) => ({ groupId: group.id, userId: u.id, role: GroupRole.MEMBER })),
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


