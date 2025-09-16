import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper: resolve userId by email (null if not found)
async function findUserIdByEmail(email: string): Promise<string | null> {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    return user?.id ?? null;
}

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const GET = async (_req: Request, { params }: { params: { groupId: string; email: string } }) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groupId = decodeURIComponent(params.groupId ?? "").trim();
    if (!groupId) {
        return NextResponse.json({ error: "groupId is required" }, { status: 400 });
    }

    const email = decodeURIComponent(params.email ?? "").trim().toLowerCase();
    if (!email || !isValidEmail(email)) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true, image: true, createdAt: true },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
        user: { ...user, createdAt: user.createdAt.toISOString() },
    }, { status: 200 });
};

export const POST = async (req: Request, { params }: { params: { groupId: string; email: string } }) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groupId = decodeURIComponent(params.groupId ?? "").trim();
    if (!groupId) {
        return NextResponse.json({ error: "groupId is required" }, { status: 400 });
    }

    const email = decodeURIComponent(params.email ?? "").trim().toLowerCase();
    if (!email || !isValidEmail(email)) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const targetUserId = await findUserIdByEmail(email);
    if (!targetUserId) {
        return NextResponse.json({
            error: "User not found in our database",
            inviteRequired: true,
            email,
            message: "The user with this email is not registered. Invite them to sign up to add to the group.",
        }, { status: 404 });
    }

    // Ensure caller is the group creator
    const callerMembership = await prisma.groupMember.findFirst({
        where: { groupId, userId: session.user.id },
        select: { role: true },
    });
    if (!callerMembership) {
        return NextResponse.json({ error: "You are not a member of this group" }, { status: 403 });
    }
    if (callerMembership.role !== "CREATOR") {
        return NextResponse.json({ error: "Only the group creator can add members" }, { status: 403 });
    }

    // Prevent duplicates
    const existing = await prisma.groupMember.findFirst({
        where: { groupId, userId: targetUserId },
        select: { id: true },
    });
    if (existing) {
        return NextResponse.json({ error: "User is already a member of this group" }, { status: 409 });
    }

    const membership = await prisma.groupMember.create({
        data: { groupId, userId: targetUserId },
        select: { id: true, groupId: true, userId: true, role: true, joinedAt: true },
    });

    return NextResponse.json({
        membership: { ...membership, joinedAt: membership.joinedAt.toISOString() },
    }, { status: 201 });
};

export const DELETE = async (_req: Request, { params }: { params: { groupId: string; email: string } }) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groupId = decodeURIComponent(params.groupId ?? "").trim();
    if (!groupId) {
        return NextResponse.json({ error: "groupId is required" }, { status: 400 });
    }

    const email = decodeURIComponent(params.email ?? "").trim().toLowerCase();
    if (!email || !isValidEmail(email)) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const targetUserId = await findUserIdByEmail(email);
    if (!targetUserId) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check caller's role in the group
    const callerMembership = await prisma.groupMember.findFirst({
        where: { groupId, userId: session.user.id },
        select: { role: true },
    });
    if (!callerMembership) {
        return NextResponse.json({ error: "You are not a member of this group" }, { status: 403 });
    }
    if (callerMembership.role !== "CREATOR") {
        return NextResponse.json({ error: "Only the group creator can remove members" }, { status: 403 });
    }

    // Prevent removing creator; ensure membership exists
    const targetMembership = await prisma.groupMember.findFirst({
        where: { groupId, userId: targetUserId },
        select: { role: true },
    });
    if (!targetMembership) {
        return NextResponse.json({ error: "User is not a member of this group" }, { status: 404 });
    }
    if (targetMembership.role === "CREATOR") {
        return NextResponse.json({ error: "Cannot remove the group creator" }, { status: 409 });
    }

    const result = await prisma.groupMember.deleteMany({ where: { groupId, userId: targetUserId } });
    if (result.count === 0) {
        return NextResponse.json({ error: "Membership not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User removed from group" }, { status: 200 });
};
