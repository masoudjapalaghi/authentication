import { useSession, getSession, getProviders, signIn, getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function SignIn({ providers, csrfToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginStarted, setIsLoginStarted] = useState(false);
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (router.query.error) {
      setLoginError(router.query.error);
      setEmail(router.query.email);
    }
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoginStarted(true);
    signIn("credentials", {
      email,
      password,
      callbackUrl: `${window.location.origin}/`,
    });
  };
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>Sign in with {provider.name}</button>
        </div>
      ))}
      <br />
      {/* <form method="post" action="/api/auth/callback/credentials">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label>
          Username
          <input name="username" type="text" />
        </label>
        <label>
          Password
          <input name="password" type="password" />
        </label>
        <button type="submit">Sign in</button>
      </form> */}
      <form onSubmit={(e) => handleLogin(e)} >
        <label htmlFor="loginEmail">Email</label>
        <input id="loginEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)}  />
        <span >{loginError}</span>
        <label htmlFor="inputPassword">Password</label>
        <input id="inputPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={isLoginStarted} >
          Log In
        </button>
      </form>
    </>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = await getSession({ req });
  if (session && res) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  console.log(`req:${req}& res:${res}`, context);
  const providers = await getProviders(context);
  const csrfToken = await getCsrfToken(context);
  return {
    props: { providers, csrfToken },
  };
}
