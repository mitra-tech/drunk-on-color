import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import { compareSync } from "bcrypt-ts-edge";
import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        // check if user exists and if the password matches
        if (user && user.password === credentials.password) {
          // credentials.password is the password comes form the form (user puts in)
          //  user.password: the password in the database that we fetched above
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );
          // If password is match then return the user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // check if user exists and if the password matches
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // Set the user ID from the token
      session.user.id = token.sub;
      // If there in an update set the username (because user can update their name and we want to update the session if it is updated in the db)
      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
