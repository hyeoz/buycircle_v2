import { Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <div
      style={{
        maxWidth: 890,
        width: "100%",
        margin: "0 auto",
        marginTop: 80,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Routes>
        {isLoggedIn ? (
          <>
            <Route
              path="/"
              element={
                <div>
                  <Navigation userObj={userObj} />
                  <Home userObj={userObj} />
                </div>
              }
            />
            <Route
              path="/profile"
              element={
                <div>
                  <Navigation userObj={userObj} />
                  <Profile refreshUser={refreshUser} userObj={userObj} />
                </div>
              }
            />
          </>
        ) : (
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </div>
  );
};

export default AppRouter;
