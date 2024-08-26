import prisma from "@/db";

export async function getUserIdByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });
    return user
}
