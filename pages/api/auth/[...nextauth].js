import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import LinkedInProvider from "next-auth/providers/linkedin";
import axios from "axios";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  // adapter: MongoDBAdapter(clientPromise),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      // https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_ID,
      clientSecret: process.env.LINKEDIN_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",

      async authorize(credentials, req) {
        const res = await axios.post(`http://185.211.58.22:8082/api/v1/Users/Login?mobileOrEmail=${credentials.email}&pass=${credentials.password}&Captcha=9`, {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        });
        const user = { name: res.data.userId, email: res.data.userName, image: "", access_token: res.data.access_token };
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      // console.log("user:::",user)
      // console.log("token:::",token)
      if (user?.accessToken) {
        // token.jwt = user.jwt;
        token.access_token = user.access_token;
        // token.user = user.user;
        token.accessToken = user.accessToken;
      }
      return Promise.resolve(token);
    },
    async session({ session, token, user }) {
      // session.jwt = token.jwt;
      session.access_token = token.access_token;
      // session.accessToken = token.accessToken ? token.accessToken : (session.user = token.user ? token.user : session.user);
      return Promise.resolve(session);
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log("user:",user)
      console.log("account:",account)
      console.log("profile:",profile)
      console.log("email:",email)
      console.log("credentials:",credentials)
      const isAllowedToSignIn = true
      if (isAllowedToSignIn) {
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    }
  },
  secret: process.env.SECRET,

  session: {
    jwt: true,
  },

  jwt: {
    // encryption:true,
    secret: process.env.SECRET,
  },

  pages: {
    signIn: "/signin", // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  events: {},

  theme: {
    colorScheme: "light",
  },

  debug: true,
});
