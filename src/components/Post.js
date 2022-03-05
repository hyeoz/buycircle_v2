import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "../fbase";
import React, { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 10px;
  text-align: center;

  &:hover {
    box-shadow: 5px 5px 5px grey;
    transition: 0.5s;
  }

  h1 {
    text-align: center;
    border-top: 3px dotted black;
    border-bottom: 3px dotted black;
  }
  .post_box {
    display: flex;
    justify-content: space-between;
  }
  .post_item {
    border-top: 2px dotted grey;
    border-bottom: 2px dotted grey;
  }
  .isOwner {
    background-color: #fce5cd;
    border-color: #fce5cd;
    border-radius: 0.5rem;
    margin-bottom: 10px;
    &:hover {
      background-color: #f9cb9c;
    }
  }
`;

const Post = ({ postObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newPostText, setNewPostText] = useState(postObj.text);
  const [newPostPrice, setNewPostPrice] = useState(postObj.price);
  const [newPostPayment, setNewPostPayment] = useState(postObj.payment);

  const [tag, setTag] = useState("");
  const [newTags, setNewTags] = useState(postObj.tags);

  // console.log(postObj);
  const onDeleteClick = async () => {
    const deleteOk = window.confirm(
      "Are you sure you want to delete this hwit"
    );
    if (deleteOk) {
      await deleteDoc(doc(dbService, `buycircle/${postObj.id}`));
      await deleteObject(ref(storageService, postObj.attachmentUrl));
    }
  };
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(dbService, `buycircle/${postObj.id}`), {
      text: newPostText,
      price: newPostPrice,
      payment: newPostPayment,
      tags: newTags,
    });
    setEditing(false);
  };
  const onPostChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewPostText(value);
  };
  const onPriceChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewPostPrice(value);
  };
  const onPaymentChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewPostPayment(value);
  };
  // 태그기능 수정..
  const onTagChange = (e) => {
    const {
      target: { value },
    } = e;
    setTag(value);
  };
  const onSubmitTag = (e) => {
    e.preventDefault();
    const newTag = newTags.concat(tag);
    setNewTags(newTag);
    setTag("");
  };
  const onTagClick = (e) => {
    const clickedTag = e.target.innerText.slice(1);
    const filteredTags = newTags.filter((t) => t !== clickedTag);
    setNewTags(filteredTags);
  };
  // resizing 이슈....

  return (
    <Wrapper>
      <div>
        <h1>RECIEPT</h1>
        {editing ? (
          <div>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="Edit your Text"
                value={newPostText}
                required
                autoFocus
                onChange={onPostChange}
              />
              <input
                type="text"
                placeholder="Edit your Price"
                value={newPostPrice}
                required
                autoFocus
                onChange={onPriceChange}
              />
              <input
                type="text"
                placeholder="Edit your Payment"
                value={newPostPayment}
                required
                autoFocus
                onChange={onPaymentChange}
              />
              <input type="submit" value="Update post!" />
            </form>
            <form onSubmit={onSubmitTag}>
              <input type="text" value={tag} onChange={onTagChange} />
              <button type="submit">태그 수정</button>
            </form>
            {newTags.map((tag) => (
              <span key={tag} onClick={onTagClick}>
                #{tag}
              </span>
            ))}
            <button onClick={toggleEditing}>Cancel</button>
          </div>
        ) : (
          <div>
            {postObj.attachmentUrl && (
              <img
                style={{ maxHeight: "400px", maxWidth: "400px" }}
                src={postObj.attachmentUrl}
                alt="Refresh_For_Resized_Image"
              />
            )}
            {postObj.tags?.map((tag) => (
              <p key={tag} style={{ display: "flex", color: "#FFAA66" }}>
                #{tag}
              </p>
            ))}
            <h3 className="post_item">{postObj.text}</h3>

            <div className="post_box">
              <h3>TOTAL</h3>
              <h3>{postObj.price} ₩</h3>
            </div>
            <div className="post_box post_item">
              <h3>TYPE</h3>
              <h3>{postObj.payment}</h3>
            </div>

            {isOwner && (
              <div style={{ textAlign: "right" }}>
                <button onClick={onDeleteClick} className="isOwner">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button onClick={toggleEditing} className="isOwner">
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
              </div>
            )}
          </div>
        )}
        <h1 style={{ border: 0, paddingBottom: "10px" }}>+++THANK YOU+++</h1>
        <span style={{ width: "inherit", overflow: "hidden" }}>
          \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
        </span>
      </div>
    </Wrapper>
  );
};
export default Post;
