// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GitLabProvider from "next-auth/providers/gitlab";
import { NextAuthOptions } from "next-auth";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";

// Create a custom Bitbucket provider using the generic OAuth provider
function BitbucketProvider(options: OAuthUserConfig<Record<string, any>>): OAuthConfig<Record<string, any>> {
  return {
    id: "bitbucket",
    name: "Bitbucket",
    type: "oauth",
    authorization: {
      url: "https://bitbucket.org/site/oauth2/authorize",
      params: { scope: "account email" }
    },
    token: "https://bitbucket.org/site/oauth2/access_token",
    userinfo: {
      url: "https://api.bitbucket.org/2.0/user",
      async request(context) {
        const { tokens } = context;
        const accessToken = tokens.access_token;
        
        if (!accessToken) throw new Error("No access token available");
        
        const profile = await fetch("https://api.bitbucket.org/2.0/user", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then(res => res.json());
        
        // Get the user's email
        const emails = await fetch("https://api.bitbucket.org/2.0/user/emails", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then(res => res.json());
        
        // Find the primary email
        const primaryEmail = emails.values.find((email: any) => email.is_primary)?.email || emails.values[0]?.email;
        
        return {
          id: profile.uuid,
          name: profile.display_name,
          email: primaryEmail,
          image: profile.links?.avatar?.href,
        };
      },
    },
    profile(profile: any) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.image,
      };
    },
    style: {
      bg: "#205081",
      text: "#fff",
      logo: "https://cdn.simpleicons.org/bitbucket/0052CC",
    },
    options,
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      // You can request additional scopes here
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
    }),
    GitLabProvider({
      clientId: process.env.GITLAB_ID!,
      clientSecret: process.env.GITLAB_SECRET!,
      authorization: {
        url: `${process.env.GITLAB_BASE_URL || 'https://gitlab.com'}/oauth/authorize`,
        params: {
          scope: 'read_user profile email',
        },
      },
    }),
    BitbucketProvider({
      clientId: process.env.BITBUCKET_ID!,
      clientSecret: process.env.BITBUCKET_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : undefined,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          // Add provider-specific profile details
          profile: profile,
        };
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && typeof token.accessTokenExpires === 'number' && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to refresh it
      // This would need implementation specific to each provider's refresh token flow
      // For example, GitHub doesn't use refresh tokens by default
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Send properties to the client
      if (session.user) {
        session.user.id = token.sub as string;
        session.accessToken = token.accessToken as string;
        session.provider = token.provider as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in
  },
  session: {
    strategy: "jwt", // Use JWT for stateless sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };