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
      
      // Public paths that don't require authentication
      const publicPaths = [
        '/auth/signin',
        '/auth/error',
      ];
      
      // Check if the current path is public
      const isPublicPath = publicPaths.some(path => 
        nextUrl.pathname === path || nextUrl.pathname.startsWith(`${path}/`)
      );
      
      // If the path is public, allow access regardless of auth status
      if (isPublicPath) {
        return true;
      }
      
      // For all other paths, require authentication
      return isLoggedIn;
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
