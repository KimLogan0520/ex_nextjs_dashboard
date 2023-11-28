import type { NextAuthConfig } from "next-auth";
import {next} from "sucrase/dist/types/parser/tokenizer";

export const authConfig = {
  /**
   * You can use the pages option to specify the route for custom sign-in, sign-out, and error pages. This is not required, but by adding signIn: '/login' into our pages option, the user will be redirected to our custom login page, rather than the NextAuth.js default page.
   */
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if ( isOnDashboard ) {
        if ( isLoggedIn ) return true;
        return false;
      } else if ( isLoggedIn ) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    }
  },
  providers: [],
} satisfies NextAuthConfig;