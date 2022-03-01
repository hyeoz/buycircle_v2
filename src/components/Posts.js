import { addDoc, collection } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "../fbase";
import React, { useState } from "react";
import { v4 } from "uuid";
import TagBox from "./Tags";

const PostFactory = ({ userObj }) => {
  const [post, setPost] = useState("");
  const [price, setPrice] = useState();
  const [payment, setPayment] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (e) => {
    if (post === "") {
      return;
    }
    e.preventDefault();
    let attachmentUrl = ""; // if 문 밖에서도 사용하기 위해
    if (attachment !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
      const response = await uploadString(fileRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
      // console.log("-----");
    }
    const postObj = {
      text: post,
      price: price,
      payment: payment,
      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "buycircle"), postObj);
    setPost("");
    setAttachment("");
  };
  const onPostChange = (e) => {
    const {
      target: { value },
    } = e;
    setPost(value);
  };
  const onPriceChange = (e) => {
    const {
      target: { value },
    } = e;
    setPrice(value);
  };
  const onPaymentChange = (e) => {
    const {
      target: { value },
    } = e;
    setPayment(value);
  };
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0]; // 한개만 선택
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      // console.log(finishedEvent);
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    }; // 2. 여기서 파일 로드가 끝나면 처리
    reader.readAsDataURL(theFile); // 1. 여기서 파일을 받고
  };
  const onClearAttachment = () => {
    setAttachment("");
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input
          type="text"
          placeholder="What do you buy?"
          maxLength={128}
          value={post}
          onChange={onPostChange}
        />
        <input
          type="number"
          placeholder="How much is that?"
          onChange={onPriceChange}
          value={price}
        />
        <input
          type="text"
          placeholder="How do you pay for that?"
          onChange={onPaymentChange}
          value={payment}
        />
        <input type="submit" value="&rarr;" />
      </div>
      {/* <TagBox /> */}
      <label htmlFor="attach-file">
        <span>AddPhotos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ opacity: 0 }}
      />
      {attachment && (
        <div>
          <img
            src={attachment}
            style={{ backgroundImage: attachment }}
            alt="image_here"
          />
          <div onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
      <input type="submit" value="Upload Image" />
    </form>
  );
};

export default PostFactory;
