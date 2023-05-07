import NextAuth, { type NextAuthOptions, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma'
// import { env } from '../../../env/server.mjs';
import bcrypt from 'bcryptjs';


export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.specialRole = token.specialRole as boolean;
      }
      return session;
    },
    jwt({ token, user }) {
      
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.specialRole = user.specialRole;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        specialRole: { label: 'Special Role', type: 'text' },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;
        const specialRole = credentials?.specialRole;
        if(specialRole) {
          const user1 = await prisma.user.findUnique({
            where: {
              email: email
            }
          })
          if(user1)
            return { ...user1, password: undefined };
        }
        if (!password) {
          throw new Error(`Please Enter Password`);
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (user && user.password) {
          const isPasswordMatched = await bcrypt.compare(
            password,
            user?.password
          );
          

          if (isPasswordMatched) {
            return { ...user, password: undefined };
          } else {
            throw new Error(`Wrong Password`);
          }
        } else {
          throw new Error(`Email Doesn't Exist`);  
        }
        
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);