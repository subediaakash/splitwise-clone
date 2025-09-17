import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import {auth} from '@/lib/auth'
import { IExpense } from "@/schema/expense/expense.schema";
import { prisma } from "@/lib/prisma";
import { GroupRole } from "@/generated/prisma";

export const POST = async(req:NextRequest, { params }: { params: { groupId: string } }) =>{
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const groupId = params.groupId
    const body:IExpense = await req.json()

    // we need to check if the user of this group has the permission to create the expense
    const groupMember = await prisma.groupMember.findFirst({
        where: {
            groupId,
            userId: session.user.id,
        }
    })
    if (!groupMember) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if(groupMember.role !== GroupRole.CREATOR){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // lets create the expenseParticipantRecords
    const expenseParticipantRecords = body.participants.map((participant) => ({
        userId: participant,
        share: body.amount / body.participants.length,
    }))

    const expense = await prisma.expense.create({
        data: {
            ...body,
            groupId,
            createdById: session.user.id,
            participants: {
                create: expenseParticipantRecords,
            }
        }

    })
    return NextResponse.json({ expense }, { status: 200 })


}


export const GET = async(req:NextRequest, { params }: { params: { groupId: string } }) =>{
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const groupId = params.groupId
    const expenses = await prisma.expense.findMany({ where: { groupId } })
    return NextResponse.json({ expenses }, { status: 200 })
}

