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

const Profile = ({ refreshUser, userObj }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [newPhotoURL, setNewPhotoURL] = useState(userObj.photoURL);
  const [query, setQuery] = useState();

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
  };

  // console.log(userObj, "Profile");

  useEffect(() => {
    getMyPosts();

    (async () => {
      if (userObj) {
        const userInfoObj = {
          userDisplay: userObj.displayName,
          userPhotoURL: userObj.photoURL,
          userUid: userObj.uid,
        };
        // if (userObj.uid)
        addDoc(collection(dbService, "userInfo"), userInfoObj);
      }
      const userQuery = await getDocs(collection(dbService, "userInfo"));
      // console.log(userQuery.docs);
      setQuery(userQuery.docs);
    })();
  }, []);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          autoFocus
        />
        <label htmlFor="attach-file">
          <span>ChangePhotos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          // style={{ opacity: 0 }}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <span onClick={onLogOutClick}>Log Out</span>
      <div>
        {/* 다른 유저 프로필사진 */}
        {query?.slice(0, 3).map((doc) => (
          <img
            style={{ display: "inline", width: "100px" }}
            src={doc.data().userPhotoURL}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
