
import NextAuth, { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { hashValue } from "./helpers";
import { Provider } from "next-auth/providers";

const configureIdentityProvider = () => {
  const providers: Array<Provider> = [];

  const adminEmails = process.env.ADMIN_EMAIL_ADDRESS?.split(",").map(email => email.toLowerCase().trim());

  if (
    process.env.AZURE_AD_CLIENT_ID &&
    process.env.AZURE_AD_CLIENT_SECRET &&
    process.env.AZURE_AD_TENANT_ID
  ) {
    providers.push(
      AzureADProvider({
        clientId: process.env.AZURE_AD_CLIENT_ID!,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
        tenantId: process.env.AZURE_AD_TENANT_ID!,
        authorization: { 
          params: { 
            scope: "openid profile email" 
          } 
        },
        // クロスオリジン対策
        checks: ['pkce', 'state'],
        async profile(profile) {
          const newProfile = {
            ...profile,
            id: profile.sub,
            isAdmin: adminEmails?.includes(profile.preferred_username.toLowerCase())
          }
          return newProfile;
        }
      })
    );
  }

  // 他のプロバイダー設定は省略
  return providers;
};

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [...configureIdentityProvider()],
  
  // セキュリティ強化オプション
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
  
  // セキュリティコールバック
  callbacks: {
    async redirect({ url, baseUrl }) {
      // リダイレクトを安全なドメインのみに制限
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    
    async jwt({token, user, account, profile}) {
      if (account?.provider === 'azure-ad') {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      
      if (user?.isAdmin) {
        token.isAdmin = user.isAdmin;
      }
      
      return token;
    },
    
    async session({session, token}) {
      session.user.isAdmin = token.isAdmin as string;
      
      // トークン情報の追加（オプション）
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      
      return session;
    }
  },
  
  // より厳格なCookie設定
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        path: '/',
        httpOnly: true,
        sameSite: 'lax', // 'none'から'lax'に変更
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  
  // エラーハンドリング
  events: {
    async signIn(message) {
      console.log('Successful sign in', message);
    },
    async signOut(message) {
      console.log('Sign out', message);
    },
    async createUser(message) {
      console.log('User created', message);
    },
  },
  
  // デバッグモード（本番環境では無効に）
  debug: process.env.NODE_ENV === 'development',
};

export const handlers = NextAuth(options);