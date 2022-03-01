import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import PostFactory from "../components/Posts";
import Post from "../components/Post";

const Home = ({ userObj }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    onSnapshot(
      query(collection(dbService, "buycircle"), orderBy("createAt", "desc")),
      (snapshot) => {
        const postsArr = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsArr);
      }
    );
  }, []);

  return (
    <div>
      <PostFactory userObj={userObj} />
      <div>
        <div>
          {posts.map((post) => (
            <Post
              key={post.id}
              postObj={post}
              isOwner={post.creatorId === userObj.uid}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
