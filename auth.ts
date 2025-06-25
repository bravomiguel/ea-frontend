import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      // If the user is trying to access the sign-in page, allow it
      if (nextUrl.pathname === '/auth/signin') {
        // If already logged in, redirect to home
        if (isLoggedIn) {
          return Response.redirect(new URL('/', nextUrl));
        }
        return true;
      }
      
      // If the user is not logged in, redirect to sign-in page
      if (!isLoggedIn) {
        const signInUrl = new URL('/auth/signin', nextUrl);
        signInUrl.searchParams.set('callbackUrl', nextUrl.pathname);
        return Response.redirect(signInUrl);
      }
      
      // If the user is logged in, allow access to all pages
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
