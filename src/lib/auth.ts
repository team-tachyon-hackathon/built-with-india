// lib/auth.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DefaultSession } from "next-auth";
import { useSession as useNextAuthSession } from "next-auth/react";

// Enhanced session type
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    provider?: string;
    user: {
      id: string;
    } & DefaultSession["user"];
  }
  
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    provider?: string;
    providerAccountId?: string;
    profile?: any;
  }
}

// Server-side: Get session data for server components
export async function getServerAuthSession() {
  return await getServerSession(authOptions);
}

// Server-side: Check if user is authenticated in a server action or API route
export async function requireAuth() {
  const session = await getServerAuthSession();
  
  if (!session) {
    throw new Error("Unauthorized: Authentication required");
  }
  
  return session;
}

// Server-side: Get provider-specific access token
export async function getProviderToken() {
  const session = await getServerAuthSession();
  return session?.accessToken;
}

// Client-side: Custom hook with loading and required states
export function useAuth({ required = false } = {}) {
  const { data: session, status } = useNextAuthSession();
  const loading = status === "loading";
  const authenticated = !!session;
  
  // Add custom properties to make auth easier to work with
  return {
    session,
    loading,
    authenticated,
    user: session?.user,
    providerName: session?.provider,
    accessToken: session?.accessToken,
  };
}

// Client-side: Hook to get the provider name
export function useAuthProvider() {
  const { data: session } = useNextAuthSession();
  return session?.provider || null;
}

// Types for provider-specific data
export type Provider = "github" | "gitlab" | "bitbucket";

// Helper to check if a user is authenticated with a specific provider
export function isAuthenticatedWith(session: any, provider: Provider) {
  return session?.provider === provider;
}