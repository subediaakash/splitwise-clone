import prisma from "@/db";

export async function getUsers() {
    const users = await prisma.user.findMany({})
    return users
}