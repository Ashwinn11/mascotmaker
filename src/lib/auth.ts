import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { findOrCreateUser, type User } from "@/lib/db";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            credits: number;
        };
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google" && user.email) {
                await findOrCreateUser({
                    googleId: account.providerAccountId,
                    email: user.email,
                    name: user.name || null,
                    avatarUrl: user.image || null,
                });
            }
            return true;
        },
        async jwt({ token, account }) {
            if (account?.provider === "google") {
                token.googleId = account.providerAccountId;
            }
            // Refresh user data from DB on every token refresh
            if (token.googleId) {
                const dbUser = await findOrCreateUser({
                    googleId: token.googleId as string,
                    email: token.email!,
                    name: token.name || null,
                    avatarUrl: token.picture || null,
                });
                token.userId = dbUser.id;
                token.credits = dbUser.credits;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.userId) {
                session.user.id = token.userId as string;
                session.user.credits = token.credits as number;
            }
            return session;
        },
    },
    pages: {
        signIn: "/",
    },
});
