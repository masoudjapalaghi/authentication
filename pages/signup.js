import React, { useState } from "react";
import axios from "axios";
const Signup = () => {
  const [mobileOrEmail, setMobileOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const handleRegister = async (event) => {
    event.preventDefault();
    const user = {
      mobileOrEmail:mobileOrEmail,
      password:password,
      repeatPassword:repeatPassword,
      captcha:0,
    };
    console.log(user);
    axios.post('http://185.211.58.22:8082/api/v1/Users/RegisterUser', user)

  };
  return (
    <form onSubmit={(e) => handleRegister(e)}>
      <label htmlFor="loginEmail">Email</label>
      <input type="text" value={mobileOrEmail} onChange={(e) => setMobileOrEmail(e.target.value)} />
      <label htmlFor="inputPassword">Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <label htmlFor="inputPassword">Repeat Password</label>
      <input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
      <button type="submit">Log In</button>
    </form>
  );
};

export default Signup;
