import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "../fbase";
import React, { useState } from "react";

const Post = ({ postObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newPostText, setNewPostText] = useState(postObj.text);
  const [newPostPrice, setNewPostPrice] = useState(postObj.price);
  const [newPostPayment, setNewPostPayment] = useState(postObj.payment);

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
          <button onClick={toggleEditing}>Cancel</button>
        </div>
      ) : (
        <div>
          <h4>{postObj.text}</h4>
          <h4>{postObj.price}원</h4>
          <h4>{postObj.payment} 로 결제</h4>
          {postObj.attachmentUrl && (
            <img src={postObj.attachmentUrl} alt="Image_Here" />
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
