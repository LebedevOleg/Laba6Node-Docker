const { response } = require("express");
const Router = require("express");
const router = new Router();
const config = require("config");
const { default: axios } = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 11, checkperiod: 13 });

//* /api/forum/sendPost
router.post("/sendPost", async (req, res) => {
  try {
    await axios
      .post(config.get("FORUM") + "/api/forum/sendPost", req.body)
      .then((result) => {
        res.json(result.data);
      });
  } catch (e) {
    res.status(400).json({ message: "Oh my, It's broken " + e.message });
  }
});
//* /api/forum/getPost
router.get("/getPost", async (req, res) => {
  if (cache.has("posts")) {
    console.log("cache");
    return res.json(cache.get("posts"));
  } else {
    try {
      await axios
        .get(config.get("FORUM") + "/api/forum/getPost", {
          headers: { authorization: req.headers.authorization },
        })
        .then((result) => {
          cache.set("posts", result.data);
          console.log("api");
          return res.status(201).json(result.data);
        });
    } catch (e) {
      res.json({ message: e.message });
    }
  }
});

router.post("/deletePost", async (req, res) => {
  try {
    await axios
      .post(config.get("FORUM") + "/api/forum/deletePost", req.body)
      .then((result) => {
        res.json(result.data);
      });
    /* const { postId } = req.body;
    const deleted = await db.query("DELETE FROM post WHERE id = $1", [postId]);
    res.json({ message: "Пост удален" }); */
  } catch (e) {
    res.json({ message: e.message });
  }
});

router.post("/updatePost", async (req, res) => {
  try {
    await axios
      .post(config.get("FORUM") + "/api/forum/updatePost", req.body)
      .then((result) => {
        res.json(result.data);
      });
    /*  const { postId, text } = req.body;
    const update = await db.query("UPDATE post SET text=$1 WHERE id = $2", [
      text,
      postId,
    ]);
    res.json({ message: "Пост успешно обновлен" }); */
  } catch (e) {
    res.json({ message: e.message });
  }
});

router.get("/getAllUsers", async (req, res) => {
  try {
    await axios
      .get(config.get("FORUM") + "/api/forum/getAllUsers")
      .then((result) => {
        res.status(201).json(result.data);
      });
    /* const users = await db.query("SELECT id, login, is_block FROM users");

    if (users.rowCount == 0) {
      return res.json({ message: "Нет пользователей" });
    }
 
    res.json(users.rows); */
  } catch (e) {
    res.json({ message: e.message });
  }
});

router.post("/blockUser", async (req, res) => {
  try {
    await axios
      .post(config.get("FORUM") + "/api/forum/blockUser", req.body)
      .then((result) => {
        res.json(result.data);
      });
    /*    const { userID, blocked } = req.body;
    await db.query("UPDATE users SET is_block=$1 WHERE id = $2", [
      blocked,
      userID,
    ]);
    res.json({ message: "Состояние пользователя успешно изменено" }); */
  } catch (e) {
    res.json({ message: e.message });
  }
});

router.post("/likes", async (req, res) => {
  try {
    await axios
      .post(config.get("FORUM") + "/api/forum/likes", req.body)
      .then((result) => {
        res.json(result.data);
      });
    /*  const { postId } = req.body;
    const likes = await db.query("select id from likes where post_id = $1", [
      postId,
    ]);
    res.json({ message: likes.rowCount }); */
  } catch (e) {
    res.json({ message: e.message });
  }
});

router.post(
  "/Userlike",
  /* auth, */ async (req, res) => {
    try {
      await axios
        .post(config.get("FORUM") + "/api/forum/Userlike", req.body, {
          headers: { authorization: req.headers.authorization },
        })
        .then((result) => {
          // console.log(result.data);
          res.status(201).json(result.data);
        });
      /*  const { postId } = req.body;
      const likes = await db.query(
        "select id from likes where user_id = $1 and post_id = $2",
        [req.userAuth.userId, postId]
      );
      if (likes.rowCount === 0) {
        return res.json({ message: false });
      }
      res.json({ message: true }); */
    } catch (e) {
      console.log(e.message + " UserLike");
    }
  }
);

router.post("/chngeLike", async (req, res) => {
  try {
    await axios.post(config.get("FORUM") + "/api/forum/chngeLike", req.body);
    /* const { postId, userID } = req.body;
    const likes = await db.query(
      "select id from likes where user_id = $1 and post_id = $2",
      [userID, postId]
    );
    if (likes.rowCount == 0) {
      await db.query("INSERT INTO likes(user_id, post_id) VALUES ( $1, $2)", [
        userID,
        postId,
      ]);
    } else {
      await db.query("DELETE FROM likes WHERE user_id = $1 and post_id = $2", [
        userID,
        postId,
      ]); */
  } catch (e) {
    console.log(e.message + " chngeLike");
  }
});
//* /api/forum/setLastPost
router.post(
  "/setLastPost",
  /* auth, */ async (req, res) => {
    try {
      await axios
        .post(config.get("FORUM") + "/api/forum/setLastPost", req.body, {
          headers: { authorization: req.headers.authorization },
        })
        .then((result) => {
          res.status(201).json(result.data);
        });
      /* const { postId, userID } = req.body;
      const lastPostID = await db.query(
        "UPDATE users SET  last_post_id=$1 WHERE id = $2 ",
        [postId, userID]
      );
      res.json(lastPostID.rows); */
    } catch (e) {
      res.json(e.message);
    }
  }
);
//* /api/forum/getLastPost
router.get(
  "/getLastPost",
  /* auth, */ async (req, res) => {
    try {
      await axios
        .get(config.get("FORUM") + "/api/forum/getLastPost", {
          headers: { authorization: req.headers.authorization },
        })
        .then((result) => {
          res.status(201).json(result.data);
        });
      /*  const last = await db.query(
        "SELECT last_post_id FROM users WHERE id = $1",
        [req.userAuth.userId]
      );

      res.json({ lastId: last.rows[0].last_post_id }); */
    } catch (e) {
      console.log(e.message + " getLastPost");
    }
  }
);

// */api/forum/importDataDate
router.post("/importDataDate", async (req, res) => {
  try {
    await axios
      .post(config.get("FORUM") + "/api/forum/importDataDate", req.body)
      .then((result) => {
        res.json(result.data);
      });
    /*  const { StartDate, EndDate } = req.body;

    const messagesDB = await db.query(
      "SELECT post.id, users.login, post.text, post.date, count(likes), users.email FROM post full outer join users on post.user_id = users.id left join likes on post.id = likes.post_id where post.text is not null and post.date > $1 and post.date < $2 group by post.id,users.id ORDER BY date desc",
      [StartDate, EndDate]
    );
    res.json(messagesDB); */
  } catch (e) {
    console.log(e.message + " importDataDate");
  }
});

router.post("/importDataCount", async (req, res) => {
  try {
    await axios
      .post(config.get("FORUM") + "/api/forum/importDataCount", req.body)
      .then((result) => {
        res.json(result.data);
      });
    /* const { Count, side } = req.body;
    if (side === "desc") {
      const messagesDB = await db.query(
        "SELECT post.id, users.login, post.text, post.date, users.email, count(likes) FROM post full outer join users on post.user_id = users.id	left join likes on post.id = likes.post_id where post.text is not null	group by post.id, users.id ORDER BY date desc limit $1",
        [Count]
      );
      res.json(messagesDB);
    } else {
      const messagesDB = await db.query(
        "SELECT post.id, users.login, post.text, post.date, users.email, count(likes) FROM post full outer join users on post.user_id = users.id	left join likes on post.id = likes.post_id where post.text is not null	group by post.id, users.id ORDER BY date asc limit $1",
        [Count]
      );
      res.json(messagesDB);
    }

    res.json(messagesDB); */
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;
