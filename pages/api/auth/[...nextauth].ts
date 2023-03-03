import NextAuth, { AuthOptions } from "next-auth";
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";

export const authOptions: AuthOptions = {
  debug: true,
  logger: {
    debug(code, metadata) {
      console.info(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    error(code, metadata) {
      console.error(code, metadata);
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
          scope: ["openid", "profile", "offline_access"].join(" "),
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
};
export default NextAuth(authOptions);
