import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { authService } from "../fbase";
import React, { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  /* border: 1px solid red; */
  margin-bottom: 10px;
  .container {
    display: grid;
    grid-template-columns: 1fr;
    input {
      margin-bottom: 10px;
    }
  }
  .click_space {
    background-color: #fce5cd;
    border-color: #fce5cd;
    border-radius: 0.5rem;
    margin-bottom: 10px;
    &:hover {
      background-color: #f9cb9c;
    }
  }
  span {
    color: #2986cc;
  }
`;

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newAccount) {
        // create new account
        const data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
        console.log(data);
      } else {
        // log in
        const data = await signInWithEmailAndPassword(
          authService,
          email,
          password
        );
        console.log(data);
      }
    } catch (error) {
      setErrorMsg(error.message);
    }
  };
  // create account, sign in 버튼을 반대로 바꿔주는 함수
  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <Wrapper>
      <form onSubmit={onSubmit} className="container">
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          className="authInput"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
          className="authInput"
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
          className="click_space"
        />
        {errorMsg && <span className="authError">{errorMsg}</span>}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "🔁 Log In" : "🔁 Create Account"}
      </span>
    </Wrapper>
  );
};

export default AuthForm;
