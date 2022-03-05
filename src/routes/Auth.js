import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "@firebase/auth";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthForm from "../components/AuthForm";
import { authService } from "../fbase";
import React from "react";
import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const Wrapper = styled.div`
  text-align: center;
  .click_space {
    background-color: #fce5cd;
    border-color: #fce5cd;
    border-radius: 0.5rem;
    &:hover {
      background-color: #f9cb9c;
    }
  }
  .social_space {
    display: flex;
    text-align: center;
    justify-content: space-between;
  }
`;

const Auth = () => {
  const onSocialClick = async (e) => {
    // console.log(e.target.name);
    const {
      target: { name },
    } = e;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(authService, provider);
    // console.log(data);
  };

  return (
    <Wrapper>
      <FontAwesomeIcon
        icon={faCommentsDollar}
        size="4x"
        color="#FFAA66"
        style={{ marginBottom: "10px" }}
      />
      <AuthForm />
      <div className="social_space">
        <button name="google" onClick={onSocialClick} className="click_space">
          Continue With Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button name="github" onClick={onSocialClick} className="click_space">
          Continue With Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </Wrapper>
  );
};
export default Auth;
