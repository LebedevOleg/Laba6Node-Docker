import axios from "axios";
import React, { useContext, useState, useEffect, useCallback } from "react";
import Modal from "./modal/ChangeMessage.modal";
import DOMPurify from "dompurify";
import stl from "./BlockMessItem.module.css";
import { AuthContext } from "../context/authContext";

const BlockMessItem = (post) => {
  const auth = useContext(AuthContext);
  const { token } = useContext(AuthContext);
  console.debug(token);
  const [numLikes, setNumLikes] = useState();
  const [like, setLike] = useState();
  const date = post.post.date.split("T")[0];
  const time = post.post.date.split("T")[1].split(".")[0];

  const DeleteHandler = async () => {
    await axios
      .post("/api/forum/deletePost", { postId: post.post.id })
      .then((res) => {
        if (window.M) {
          window.M.toast({ html: res.data.message });
        }
      });
  };

  const GetLikesHandler = useCallback(async () => {
    try {
      await axios
        .post("/api/forum/likes", { postId: post.post.id })
        .then((res) => {
          setNumLikes(res.data.message);
        });
      GetUsetLike();
    } catch (e) {
      console.error(e.message);
    }
  }, []);

  const GetUsetLike = useCallback(async () => {
    await axios
      .post(
        "/api/forum/Userlike",
        { postId: post.post.id, userID: auth.userId },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data.message);
        if (res.data.message) {
          setLike(true);
        } else {
          setLike(false);
        }
      });
  }, []);

  const ChangeLike = async () => {
    await axios.post("/api/forum/chngeLike", {
      postId: post.post.id,
      userID: auth.userId,
    });
  };
  useEffect(() => {
    GetLikesHandler();
    GetUsetLike();
    var run = setInterval(() => GetLikesHandler(), 7000);
  }, [GetLikesHandler, GetUsetLike]);

  return (
    <div>
      <div className={post.new ? stl.new : ""}>
        <div className="col s12 m7">
          <div className="card horizontal">
            <div className="card-image"></div>
            <div className="card-stacked">
              <p>
                ????????????????:{" "}
                {post.post.login === null ? "[DELETED] " : post.post.login} ??{" "}
                {date} {time}
              </p>
              <div className="card-content">
                <p
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.post.text),
                  }}
                ></p>
              </div>
              {auth.userLogin === post.post.login ? (
                <div className="card-action">
                  <a>
                    <Modal post={(post.post, post.post)} />
                  </a>
                  <a onClick={DeleteHandler} style={{ cursor: "pointer" }}>
                    ??????????????
                  </a>
                  {like ? (
                    <a class="btn right" onClick={ChangeLike}>
                      ???????????????? {numLikes}
                    </a>
                  ) : (
                    <a class="btn-flat right" onClick={ChangeLike}>
                      ???????????????? {numLikes}
                    </a>
                  )}
                </div>
              ) : (
                <div className="card-action">
                  {like ? (
                    <a class="btn right" onClick={ChangeLike}>
                      ???????????????? {numLikes}
                    </a>
                  ) : (
                    <a class="btn-flat right" onClick={ChangeLike}>
                      ???????????????? {numLikes}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockMessItem;
