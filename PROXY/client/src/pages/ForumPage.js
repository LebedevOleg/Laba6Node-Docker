import axios from "axios";
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  Component,
} from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../context/authContext";
import BlockMessItem from "../ForumItem/BlockMessItem";
import SendMessTodo from "../ForumItem/sendMessItem";
import Modal from "../ForumItem/modal/ChangeMessage.modal";
import BlockUser from "../ForumItem/modal/BlockUser.modal";

export const ForumPage = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { userId, token } = useContext(AuthContext);
  const sendMessage = SendMessTodo();
  const [posts, setPosts] = useState([]);
  const [lastID, setlastID] = useState();
  const getPosts = useCallback(async () => {
    try {
      await axios
        .get("/api/forum/getPost", {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        .then(async (res) => {
          await axios
            .post(
              "/api/forum/setLastPost",
              { postId: res.data[0].id, userID: userId },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              console.log(response);
            });
          setPosts(res.data);
        });
    } catch (e) {
      console.log(e.message);
    }
  }, []);

  const getLastPost = useCallback(async () => {
    await axios
      .get("/api/forum/getLastPost", {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then(async (res) => {
        setlastID(res.data.lastId);
      });
  }, []);
  const setLastPost = useCallback(async () => {
    try {
      await axios
        .post(
          "/api/forum/setLastPost",
          { postId: posts[0].id, userID: auth.userId },
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        )
        .then((res) => console.debug(res.data));
    } catch (e) {
      console.debug(e.message);
    }
  }, []);

  useEffect(() => {
    getPosts();
    getLastPost();
    var run = setInterval(() => getPosts(), 5000);
    var run1 = setInterval(() => getLastPost(), 5000);
  }, [getPosts, getLastPost]);

  const LogoutHandler = (event) => {
    event.preventDefault();
    auth.logout();
    history.push("/");
  };

  return (
    <div>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        ></link>
      </head>
      <nav>
        <div className="nav-wrapper #689f38 light-green darken-2">
          <a className="brand-logo ">???????????????? ????????????</a>
          <ul id="nav-mobile" className="right hide-on-med-and-down ">
            <li> ????????????????????????: {auth.userLogin}</li>
            <li>
              <a href="/news/">??????????????</a>
            </li>
            <li>
              <a href="/forum/">??????????</a>{" "}
            </li>
            <li>
              <a href="/import/">???????????? ??????????????????</a>{" "}
            </li>
            <li>
              <a href="/" onClick={LogoutHandler}>
                ??????????
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <h1>??????????????????</h1>

      <div>
        {Array.from(posts).map((row) => (
          <BlockMessItem post={row} new={row.id <= lastID ? false : true} />
        ))}
      </div>
      {sendMessage}
      {auth.isAdmin ? <BlockUser /> : <div></div>}
    </div>
  );
};

export default ForumPage;
