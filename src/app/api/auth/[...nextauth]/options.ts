import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel, { User } from "@/models/user.models";
import { connectDB } from "@/lib/connectDB";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          await connectDB();
          console.log("credentials are : ", credentials);
          const user: User | null = await UserModel.findOne({
            email: credentials.identifier,
          });
          console.log("user is : ", user);
          if (!user) {
            throw new Error("User not found");
          }

          if (!user.isVerified) {
            throw new Error("User is not verified");
          }

          if (!bcrypt.compareSync(credentials.password, user.password)) {
            throw new Error("Invalid Password");
          }

          return user;
        } catch (error: any) {
          throw new Error(error.message || "Unknown error");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
