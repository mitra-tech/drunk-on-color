import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import { compareSync } from "bcrypt-ts-edge";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
// import { cookies } from "next/headers";

export const config: NextAuthConfig = {
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
      // credentials are the data coming from our form
      async authorize(credentials) {
        if (!credentials) return null;
        //Find user in database
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });
        // check if user exists and if the password matches
        if (user && user.password) {
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
        // check if user exists and if the password does not matche
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // sub is a subject that is the user id
      // here we assign the token user id to the session user id
      session.user.id = token.sub;
      // now based on the changes we made in the token callback (below) we update the session as well with role and name
      session.user.role = token.role;
      session.user.name = token.name;
      // If there in an update set the user name (because user can update their name (not id and email) and we want to update the session if it is updated in the db)

      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },

    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to the token
      if (user) {
        token.id = user.id;
        // if there is a user we add the user role to the token as a role (admin/user,..)
        token.role = user.role;
        // If the user has no name then use the email
        if (user.name === "NO_NAME") {
          // e.g. if we have admin@example.com we want to split it by '@' into an array to get the name from the array
          token.name = user.email!.split("@")[0];

          // we want to update the database to reflect the token name (update the user in the db)
          await prisma.user.update({
            where: { id: user.id },
            // whatever name is in the token now we want it to be in the database
            data: { name: token.name },
          });
        }
        // We want to check to see it the trigger is sign-in or sign-up
        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          // If there is a sessionCartId cookie, we want to get that from database
          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: {
                sessionCartId,
              },
            });
            // If there is a sessionCart, we want to override any existing user cart
            if (sessionCart) {
              await prisma.cart.deleteMany({
                where: {
                  userId: user.id,
                },
              });
              // Assign a new cart
              await prisma.cart.update({
                where: {
                  id: sessionCart.id,
                },
                data: {
                  userId: user.id,
                },
              });
            }
          }
        }
      }
      return token;
    },

    // we want to create a cookie for every user to connect them to their cart weather they are logged in or not as soon as they come to our website
    async authorized({ request, auth }: any) {
      // we want to add protected routes to the auth object (create an array of regex expressions or patterns of paths we want to protect)
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];
      //Get the path name from the request URL object
      const { pathname } = request.nextUrl;

      // Check if user is not authenticated and accessing a protected path
      if (!auth && protectedPaths.some((path) => path.test(pathname)))
        // then returns false and redirects to the sign-in page
        return false;

      // Check for session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        //  If no sessionCartId, then genereate a session cart id cookie
        const sessionCartId = crypto.randomUUID();

        // Clone request headers
        const newRequestHeaders = new Headers(request.headers);

        // Create new response and add the new headers
        const respone = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        // Set newly generated sessiopnCartId in the response cookies (generate the cookie and add it to the response)
        respone.cookies.set("sessionCartId", sessionCartId);
        return respone;
      } else {
        return true;
      }
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
