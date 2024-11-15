import { PrismaAdapter } from "@next-auth/prisma-adapter";
import axios from "axios";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { db } from "~/server/db";

const AuthProviders = [
  GithubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!!,
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!!,
  }),
  CredentialsProvider({
    name: "SMS",
    credentials: {
      requestId: { label: "Message id", type: "text" },
      code: { label: "Verification code", type: "text" },
    },
    async authorize(credentials: any) {
      const {
        requestId,
        phoneNumber,
        code,
      }: { requestId: string; phoneNumber: string; code: string } = credentials;
      try {
        const result = await verifySmsCode(requestId, code);
        if (result?.success) {
          const user = await db.user.findUnique({ where: { phoneNumber } });
          if (user) {
            return { ...user, isNewUser: false };
          } else {
            const newUser = await db.user.create({ data: { phoneNumber } });
            return { ...newUser, isNewUser: true };
          }
        } else {
          throw new Error("验证码不正确");
        }
      } catch (error) {
        throw error;
      }
    },
  }),
];

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string | undefined | null;
      image: string | undefined | null;
      phoneNumber: string | undefined | null;
      role: number | undefined | null;
      isNewUser?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    name: string | undefined | null;
    image: string | undefined | null;
    phoneNumber: string | undefined | null;
    role: number | undefined | null;
    isNewUser?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.phoneNumber = token.phoneNumber as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.role = token.role as number;
        session.user.id = token.id as string;
        session.user.isNewUser = token.isNewUser as boolean;
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.isNewUser = user.isNewUser;
        token.phoneNumber = user.phoneNumber;
        token.name = user.name;
        token.image = user.image;
        token.role = user.role;
        token.id = user.id;
      }

      return token;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl + "/api/auth/signout")) {
        return baseUrl;
      }

      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 60, // 2 months
  },
  adapter: PrismaAdapter(db),
  providers: AuthProviders,
};

const verifySmsCode = async (requestId: string, code: string) => {
  const options = {
    method: "POST",
    timeout: 10000,
    url: `https://api.sms.jpush.cn/v1/codes/${requestId}/valid`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${process.env.JIGUANG_SMS_API_KEY}`,
    },
    data: { code },
  };
  try {
    const response = await axios(options);
    const { is_valid: isValid, error } = response.data;
    return { success: isValid === true || error.code === 50012 };
  } catch (error) {
    return { success: false };
  }
};

export const getServerAuthSession = () => getServerSession(authOptions);
