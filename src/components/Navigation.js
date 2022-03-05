import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const Wrapper = styled.div`
  font-family: "Gothic A1", sans-serif;
  margin: 0;
  margin-bottom: 2rem;

  a {
    text-decoration: none;
    :visited {
      color: #ffaa66;
    }
  }
  img {
    border-radius: 25px;
  }
  ul {
    display: flex;
    justify-content: center;
    margin-top: 50px;
  }
  li {
    list-style: none;
  }
  Link {
    margin-right: 10px;
  }
  .profile_name {
    font-size: 1rem;
    color: black;
  }
`;

const Navigation = ({ userObj }) => {
  return (
    <Wrapper>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <FontAwesomeIcon
                icon={faCommentsDollar}
                size="4x"
                color="#FFAA66"
              />
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              style={{
                marginLeft: 10,
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
              }}
            >
              <img
                src={userObj.photoURL}
                width="50px"
                height="50px"
                alt="Profile_Image_Here"
                style={{ margin: "0 auto" }}
              />
              <span className="profile_name">
                {userObj.displayName ? userObj.displayName : "Profile"}
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </Wrapper>
  );
};

export default Navigation;
