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
    jwt({ token, user, account, profile }) {
      if (user) {
        // If we have a Google provider, use the email without @gmail.com as the stable identifier
        if (account?.provider === 'google' && user.email) {
          // Strip the @gmail.com part from the email address
          const emailWithoutDomain = user.email.replace(/@gmail\.com$/i, '');
          
          // Sanitize the email username: convert to lowercase and replace special characters
          const sanitizedId = emailWithoutDomain
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, '_')  // Replace non-alphanumeric chars except underscore and hyphen
            .replace(/_+/g, '_')           // Replace multiple underscores with a single one
            .replace(/^_+|_+$/g, '');     // Remove leading and trailing underscores
          
          // Use the sanitized email username as the stable identifier
          token.id = sanitizedId;
        } else {
          // For other providers or if email is not available, use the existing ID
          token.id = user.id;
        }
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
