import { signOut, updateProfile } from "@firebase/auth";
import {
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
  };

  useEffect(() => {
    getMyPosts();
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
          style={{ opacity: 0 }}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <span onClick={onLogOutClick}>Log Out</span>
    </div>
  );
};

export default Profile;
