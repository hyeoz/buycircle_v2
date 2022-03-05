import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import PostFactory from "../components/Posts";
import Scroll from "../components/Scroll";

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
  // console.log(userObj, "Home");

  return (
    <div>
      <PostFactory userObj={userObj} />
      <Scroll posts={posts} userObj={userObj} />
    </div>
  );
};

export default Home;
