import { addDoc, collection } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "../fbase";
import React, { useState } from "react";
import { v4 } from "uuid";
import styled from "styled-components";

const Wrapper = styled.div`
  font-family: "Gothic A1", sans-serif;
  /* border-bottom: 3px dotted #ffaa66; */

  p {
    margin: 0;
  }
  .fill_space {
    display: grid;
    grid-template-columns: 1fr;
    margin-bottom: 10px;
    &:last-child {
      border-bottom: 5px double #fce5cd;
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
  .click_space {
    background-color: #fce5cd;
    border-color: #fce5cd;
    border-radius: 0.5rem;
    &:hover {
      background-color: #f9cb9c;
    }
  }
`;

const PostFactory = ({ userObj }) => {
  const [post, setPost] = useState("");
  const [price, setPrice] = useState(0);
  const [payment, setPayment] = useState("");
  const [attachment, setAttachment] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);

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
  const onSubmit = async (e) => {
    e.preventDefault();

    if (post === "") {
      return;
    }
    let attachmentUrl = ""; // if 문 밖에서도 사용하기 위해
    // let resizedImg = "";
    if (attachment !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
      const response = await uploadString(fileRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
      // console.log(fileRef, response.ref, attachmentUrl, userObj.uid);
    }
    const postObj = {
      text: post,
      price: price,
      payment: payment,
      tags: tags,
      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl: attachmentUrl,
    };
    // console.log(resizedImg);
    await addDoc(collection(dbService, "buycircle"), postObj);
    setPost("");
    setPrice(0);
    setPayment("");
    setAttachment("");
    setTags([]);
  };
  // 태그기능구현..
  const onTagChange = (e) => {
    const {
      target: { value },
    } = e;
    setTag(value);
  };
  const onSubmitTag = (e) => {
    e.preventDefault();
    const newTag = tags.concat(tag);
    setTags(newTag);
    setTag("");
  };
  const onTagClick = (e) => {
    const clickedTag = e.target.innerText.slice(1);
    // console.log(clickedTag);
    const filteredTags = tags.filter((t) => t !== clickedTag);
    setTags(filteredTags);
  };

  return (
    <Wrapper>
      <div>
        <form onSubmit={onSubmit}>
          <div className="fill_space">
            <div className="fill_item">
              <p>Share What You Buy!</p>
              <input
                type="text"
                placeholder="What do you buy?"
                maxLength={128}
                value={post}
                onChange={onPostChange}
              />
            </div>
            <div className="fill_item">
              <p>It Costs</p>
              <input
                type="number"
                placeholder="How much is that?"
                onChange={onPriceChange}
                value={price}
              />
            </div>
            <div className="fill_item">
              <p>Paying By</p>
              <input
                type="text"
                placeholder="How do you pay for that?"
                onChange={onPaymentChange}
                value={payment}
                style={{ display: "flex" }}
              />
            </div>
            <input type="submit" value="&rarr;" className="click_space" />
          </div>
        </form>
        {/* 태스박스 부분 */}
        <div className="fill_space">
          <form onSubmit={onSubmitTag} className="fill_item">
            <input type="text" value={tag} onChange={onTagChange} />
            <button type="submit" className="click_space">
              Add Tags
            </button>
          </form>
          <div style={{ display: "flex", color: "#FFAA66" }}>
            {tags.map((tag) => (
              <span key={tag} onClick={onTagClick}>
                #{tag}
              </span>
            ))}
          </div>
          <label htmlFor="attach-file" className="fill_item">
            <span>Add Photos Here!</span>
            <FontAwesomeIcon icon={faPlus} />
          </label>
          {attachment && (
            <div>
              <img
                src={attachment}
                style={{
                  backgroundImage: attachment,
                  maxWidth: "100px",
                  maxHeight: "100px",
                }}
                alt="image_here"
              />
              <div onClick={onClearAttachment}>
                <span>Remove</span>
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>
          )}
          {/* <input type="submit" value="Upload Image" /> */}
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ opacity: 0 }}
            defaultValue={attachment}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default PostFactory;
