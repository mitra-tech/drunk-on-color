import { DefaultSession } from "next-auth";

// with this setup we just extending the user object to include a role
declare module "next-auth" {
  export interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }
}
