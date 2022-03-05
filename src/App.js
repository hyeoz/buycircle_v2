import { useCallback, useEffect, useState } from "react";
import AppRouter from "./components/Router";
import { authService, dbService } from "./fbase";
import { HashRouter } from "react-router-dom";
import { onAuthStateChanged, updateProfile } from "@firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState();

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setUserObj(user);
        // 작은 객체로 사용자 정보를 가져와 실시간으로 리렌더링 될 수 있도록
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
          updateProfile: (args) => updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  // 프로필 수정 실시간으로 적용하기 위해
  const refreshUser = () => {
    const user = authService.currentUser;
    // console.log(user, "App user Information");
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL,
      updateProfile: (args) => updateProfile(args),
    });
  };

  return (
    <HashRouter base="/">
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={!!userObj} // userObj 가 있다면 로그인 된 것
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      <footer style={{ textAlign: "center", marginTop: "10px" }}>
        &copy; BUYCIRCLE {new Date().getFullYear()}
      </footer>
    </HashRouter>
  );
}

export default App;
