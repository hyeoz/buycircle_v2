import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "@firebase/storage";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "../fbase";
import React, { useState } from "react";
import axios from "axios";

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
  // let resizedImg;
  // if (postObj.attachmentUrl) {
  //   resizedImg =
  //     postObj.attachmentUrl.substring(
  //       0,
  //       postObj.attachmentUrl.indexOf("?alt")
  //     ) +
  //     "_400x400" +
  //     postObj.attachmentUrl.substring(postObj.attachmentUrl.indexOf("?alt"));
  // }

  return (
    <div>
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
          <h4>{postObj.text}</h4>
          <h4>{postObj.price}원</h4>
          <h4>{postObj.payment} 로 결제</h4>
          {postObj.tags?.map((tag) => (
            <p key={tag} style={{ display: "flex" }}>
              #{tag}
            </p>
          ))}

          {postObj.attachmentUrl && (
            <img
              style={{ maxHeight: "400px", maxWidth: "400px" }}
              src={postObj.attachmentUrl}
              alt="Refresh_For_Resized_Image"
            />
          )}

          {isOwner && (
            <div>
              <button onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Post;
