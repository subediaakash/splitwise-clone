import prisma from "@/db";

interface CreateGroupInput {
    creatorId: number;
    totalPrice: number;
    memberIds: number[];
    description: string
    amountRemaining: number
}

export async function createGroup({ creatorId, totalPrice, memberIds, description }: CreateGroupInput) {
    try {
        const newGroup = await prisma.priceTable.create({
            data: {
                totalPrice,
                creatorId,
                amountRemaining: totalPrice,
                members: {
                    connect: memberIds.map((id) => ({ id })),
                },
                description,
                fullPaid: false,
            },

        });

        return { success: true, group: newGroup };
    } catch (error) {
        console.error("Error creating group:", error);
        return { success: false, error: error };
    }
}
