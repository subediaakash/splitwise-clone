import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/db";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "jsmith@something.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password) {
                    throw new Error("Missing email or password");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                //sdf

                if (user && user.password === credentials.password) {
                    return {
                        id: String(user.id),
                        email: user.email,
                    };
                }

                return null;
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        session: ({ session, token, user }: any) => {
            console.log(session);
            if (session && session.user) {
                session.user.id = token.id;
            }

            return session;
        },
    },
};
