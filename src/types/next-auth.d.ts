import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            isAdmin: string
        } & DefaultSession["user"]
        accessToken?: string  // ここで accessToken を任意のプロパティとして追加
    }

    interface User {
        isAdmin: string
    }
}