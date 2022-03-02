import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import PostFactory from "../components/Posts";
// import ScrollContainer from "../components/Scroll";
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
  // console.log(posts, "Home");

  // 스크롤
  const [datas, setDatas] = useState([]);
  const [scrollOptions, setScrollOptions] = useState(5);

  useEffect(() => {
    setDatas(posts.slice(0, scrollOptions));
  }, [posts, scrollOptions]);

  // 스크롤하는 위치 인식 함수
  const onScroll = () => {
    // console.log(e);
    const scrollHeight = document.documentElement.scrollHeight; // 페이지 총 높이
    let clientHeight = document.documentElement.clientHeight;
    let scrollTop = document.documentElement.scrollTop;

    if (
      // 이벤트 제어는 조건문으로 해주기!
      scrollTop + clientHeight >= scrollHeight &&
      scrollOptions < posts.length
    ) {
      console.log("들어오나여", scrollOptions);
      setScrollOptions(scrollOptions + 5);
      // console.log(posts.length);
    }
  };

  useEffect(() => {
    (() => {
      window.addEventListener("scroll", onScroll);
    })();
    // removeEventListener 는 다른 페이지 렌더링될 때 이벤트리스너가 남아있을까봐 삭제해 주는 것!
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });

  return (
    <div>
      <PostFactory userObj={userObj} />
      <div>
        {/* <ScrollContainer posts={posts} userObj={userObj} /> */}
        {datas?.map((post) => (
          <Post
            key={post.id}
            postObj={post}
            isOwner={post.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
