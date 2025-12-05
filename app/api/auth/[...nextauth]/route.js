import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";

const users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'adminpass',
    name: 'admin',
    role: 'admin',
  },
  {
    id: '2',
    email: 'author@example.com',
    password: 'authorpass',
    name: 'author',
    role: 'author',
  },
  {
    id: '3',
    email: 'consumer@example.com',
    password: 'consumerpass',
    name: 'consumer',
    role: 'consumer',
  },
];

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = users.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.name = token.name;
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
