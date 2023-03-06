import NextAuth, { AuthOptions } from "next-auth";
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";

const AUTH_URL = process.env.NEXTAUTH_URL ?? "";
const useSecureCookies = AUTH_URL.startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = new URL(AUTH_URL).hostname;

process.stdout.write(
  `Config options: ${JSON.stringify({
    AUTH_URL,
    useSecureCookies,
    cookiePrefix,
    hostName,
  })}`
);

export const authOptions: AuthOptions = {
  debug: true,
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  // Configure one or more authentication providers
  providers: [
    AzureADB2CProvider({
      tenantId: process.env.AZURE_AD_B2C_TENANT_NAME!,
      clientId: process.env.AZURE_AD_B2C_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET!,
      primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW!,
      authorization: {
        params: {
          scope: [
            "openid",
            "profile",
            "offline_access",
            `https://${process.env.AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/backend/api.read`,
          ].join(" "),
          prompt: "login",
        },
      },
      profile: (profile) => ({
        id: profile.oid,
        name: profile.name,
        email: profile.emails[0],
        image: null,
      }),
    }),
    // ...add more providers here
  ],
  cookies: {
    sessionToken: {
      name: "__Secure-next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: ".azure-test.dev.stijlbre.uk",
        secure: true,
      },
    },
  },
};
export default NextAuth(authOptions);
