import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import LinkedInProvider from "next-auth/providers/linkedin";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import axios from "axios";
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      // https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
      scope: "read:user",
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      // credentials: {
      //   username: { label: "Username", type: "email", placeholder: "jsmith" },
      //   password: { label: "Password", type: "password" },
      // },
      async authorize(credentials, req) {
        // try {
        //   const user = await axios.post('https://619cadc168ebaa001753cabe.mockapi.io/users',
        //   {
        //     user: {
        //       password: credentials.password,
        //       email: credentials.email
        //     }
        //   },
        //   {
        //     headers: {
        //       accept: '*/*',
        //       'Content-Type': 'application/json'
        //     }
        //   })

        //   if (user) {
        //     return {status: 'success', data: user}
        //   }
        // } catch (e) {
        //   const errorMessage = e.response.data.message
        //   // Redirecting to the login page with error message          in the URL
        //   throw new Error(errorMessage + '&email=' + credentials.email)
        // }

        const res = await axios.post(`http://185.211.58.22:8082/api/v1/Users/Login?mobileOrEmail=${credentials.email}&pass=${credentials.password}&Captcha=9`, {
          // body: JSON.stringify(credentials),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const user = {name:res.data.userId,email:res.data.userName,image:""};

        // const user = { id: '1', name: 'Suat Bayrak', email: 'test@test.com2' };

        if (user) {
          return user;
        } else {
          return null;
        }
      },
      // adapter: MongoDBAdapter(clientPromise),
    }),
  ],

  // database: process.env.DATABASE_URL,
  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.SECRET,
  // callbacks: {
  //   async session(session, token) {
  //     console.log(session)
  //     session.user = token.user;
  //     return session;
  //   },
  //   async jwt(token, user) {
  //     if (user) token.user = user;
  //     return token;
  //   },
  // },
  session: {
    jwt: true,
    // maxAge: 30 * 24 * 60 * 60,
    // updateAge: 24 * 60 * 60,
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `strategy` should be set to 'jwt' if no database is used.
    // Seconds - How long until an idle session expires and is no longer valid.
    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    // secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
    secret: process.env.SECRET,
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },
  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    signIn: "/signin", // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) { return true },
    // async redirect({ url, baseUrl }) { return baseUrl },
  //   async jwt({ token, user}) {
  //     console.log('token::::',token)
  //     console.log('user::::',user)
  //       if (user) {
  //         token.jwt = user.jwt;
  //         token.user = user.user;
  //         token.accessToken = user?.accessToken;
  //       }
  //       return Promise.resolve(token);
  //   },
  //   async session({ session, token }) {
  //     session.jwt = token.jwt;
  //     session.accessToken = token.accessToken ? token.accessToken :
  //     session.user = token.user ? token.user : session.user; 
  //     return Promise.resolve(session);
  //   },
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // You can set the theme to 'light', 'dark' or use 'auto' to default to the
  // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
  theme: {
    colorScheme: "light",
  },
  // Enable debug messages in the console if you are having problems
  debug: true,
});
