import { DefaultUser } from "next-auth";
import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      role: string;
      specialRole: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
        role: string;
        specialRole: boolean;
    }
}