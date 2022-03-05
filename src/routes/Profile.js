import { signOut, updateProfile } from "@firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService, dbService, storageService } from "../fbase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { v4 } from "uuid";
import styled from "styled-components";

const Wrapper = styled.div`
  font-family: "Gothic A1", sans-serif;
  overflow: hidden;

  .update_profile {
    /* border: 1px solid red; */
    text-align: center;
    margin-bottom: 10%;
    form {
      display: grid;
      grid-template-columns: 1fr;
    }
    label {
      justify-content: space-between;
    }
    .logout_button {
      font-size: 1.5rem;
      &:hover {
        color: #cc0000;
      }
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
  .fill_item {
    margin-bottom: 10px;
    justify-content: space-between;
    display: flex;
    input {
      width: 15rem;
    }
    button {
      width: 35%;
    }
  }
  .nickname {
    margin-bottom: 10px;
  }
  .random_user_img {
    padding: 5px;
    img {
      border-radius: 50%;
      border: 1px solid #ffaa66;
      margin: 5px;
      padding: 5px;
    }
  }
  .my_post {
    /* border: 1px solid red; */
    margin-top: 10px;
    border-top: 2px dotted grey;
  }
  .my_post_flex {
    display: flex;
    justify-content: space-between;
    padding-top: 5px;
  }
`;

const Profile = ({ refreshUser, userObj }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [newPhotoURL, setNewPhotoURL] = useState(userObj.photoURL);
  const [queryEl, setQueryEl] = useState();
  const [myPost, setMyPost] = useState();

  const onLogOutClick = () => {
    signOut(authService);
    navigate("/");
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      userObj.displayName !== newDisplayName ||
      userObj.photoURL !== newPhotoURL
    ) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
        photoURL: newPhotoURL,
      });
      refreshUser();
    }
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };
  const onFileChange = (e) => {
    // console.log(e);
    const {
      target: { files },
    } = e;
    const theFile = files[0]; // 한개만 선택
    const reader = new FileReader();
    reader.onloadend = async (finishedEvent) => {
      // console.log(finishedEvent);
      const {
        currentTarget: { result },
      } = finishedEvent;
      // 프로필 이미지 업데이트를 위한 코드
      const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
      const response = await uploadString(fileRef, result, "data_url");
      const resultURL = await getDownloadURL(response.ref);

      setNewPhotoURL(resultURL);
    };
    reader.readAsDataURL(theFile);
  };

  const getMyPosts = async () => {
    const postsQuery = await getDocs(
      query(
        collection(dbService, "buycircle"),
        where("creatorId", "==", userObj.uid),
        orderBy("createAt", "desc")
      )
    );
    // 여기 부분도 useState 사용해서 활용
    // console.log(postsQuery.docs, "profile");
    // setMyPost(postsQuery.docs);
    // 데이터만 뽑아서 배열로 넘겨줘야 함(스크롤 이슈)
    let myPostsArr = [];
    postsQuery.docs.map((doc) => {
      // console.log(doc.data());
      return myPostsArr.push(doc.data());
    });
    setMyPost(myPostsArr);
  };
  const getUserInfo = async () => {
    const userQuery = await getDocs(collection(dbService, "buycircle_user"));
    if (userObj) {
      const userInfoObj = {
        userDisplay: userObj.displayName,
        userPhotoURL: userObj.photoURL,
        userUid: userObj.uid,
      };
      // 중복은 저장 안되도록 ...
      let userPhoto = [];
      userQuery.docs.map((doc) => {
        return userPhoto.push(doc.data().userPhotoURL);
      });
      if (!userPhoto.includes(userInfoObj.userPhotoURL)) {
        addDoc(collection(dbService, "buycircle_user"), userInfoObj);
      }
    }
    // console.log(userQuery.docs);
    setQueryEl(userQuery.docs);
  };
  // console.log(userObj, "Profile");

  useEffect(() => {
    getMyPosts();
    getUserInfo();
  }, []);

  return (
    <Wrapper>
      <div className="update_profile">
        <form onSubmit={onSubmit}>
          <input
            onChange={onChange}
            type="text"
            placeholder="Display name"
            value={newDisplayName}
            autoFocus
            className="nickname"
          />
          <label htmlFor="attach-file" className="fill_item">
            <span>Change Photos Here!</span>
            <FontAwesomeIcon icon={faPlus} />
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ opacity: 0 }}
          />
          <input type="submit" value="Update Profile" className="click_space" />
        </form>
        <span onClick={onLogOutClick} className="logout_button">
          Log Out
        </span>
      </div>
      {/* 내가 쓴 글 */}
      {/* <Scroll posts={myPost} userObj={userObj} /> */}
      <div>
        <h1>MY POSTS</h1>
        {myPost?.map((post) => (
          <div className="my_post">
            <div className="my_post_flex">
              <h3>
                {post.price}원 / {post.payment}
              </h3>
              <img
                src={post.attachmentUrl}
                style={{ maxHeight: "50px", maxWidth: "50px" }}
                alt="Image_Here"
              />
            </div>
            <p>
              {post.text.length > 30
                ? post.text.slice(0, 30) + "..."
                : post.text}
            </p>
          </div>
        ))}
      </div>
      <div className="random_user_img">
        <p> EXPLORE RANDOM USERS...</p>

        {/* 다른 유저 프로필사진 */}
        {queryEl?.slice(0, 3).map((doc) => (
          <img
            style={{ display: "inline", width: "100px" }}
            src={doc.data().userPhotoURL}
            alt="Profile_Image_Here"
            // key={doc.userUid}
          />
        ))}
      </div>
    </Wrapper>
  );
};

export default Profile;
