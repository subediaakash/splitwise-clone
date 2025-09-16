import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const DELETE  = async (req: NextRequest, { params }: { params: { groupId: string } }) =>{
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }


    const groupId = params.groupId
    const softDeletedGroup = await prisma.group.update({ where: { id: groupId }, data: { isDeleted: true, deletedAt: new Date() } })
    return NextResponse.json({ group :softDeletedGroup}, { status: 200 })
}

export const PATCH = async (req: NextRequest, { params }: { params: { groupId: string } }) =>{
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const groupId = params.groupId
    if (!groupId) {
        return NextResponse.json({ error: "groupId is required" }, { status: 400 })
    }

    const body = await req.json().catch(() => ({} as Record<string, unknown>))

    const updateData: Record<string, unknown> = {}
    if (typeof body["name"] === "string" && (body["name"] as string).trim()) {
        updateData.name = (body["name"] as string).trim()
    }
    if (Object.prototype.hasOwnProperty.call(body, "description")) {
        const desc = body["description"]
        updateData.description = typeof desc === "string" ? desc : null
    }
    if (typeof body["image"] === "string") {
        updateData.image = body["image"]
    }
    if (typeof body["currency"] === "string") {
        updateData.currency = body["currency"]
    }
    if (typeof body["settlementStatus"] === "string") {
        updateData.settlementStatus = body["settlementStatus"]
    }

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const callerMembership = await prisma.groupMember.findFirst({
        where: { groupId, userId: session.user.id },
        select: { role: true },
    })
    if (!callerMembership) {
        return NextResponse.json({ error: "You are not a member of this group" }, { status: 403 })
    }
    if (callerMembership.role !== "CREATOR") {
        return NextResponse.json({ error: "Only the group creator can update the group" }, { status: 403 })
    }

    try {
        const updated = await prisma.group.update({ where: { id: groupId }, data: updateData })
        return NextResponse.json({ group: updated }, { status: 200 })
    } catch (error: unknown) {
        return NextResponse.json({ error: "Group not found or update failed",errorMessage : error }, { status: 400 })
    }
}