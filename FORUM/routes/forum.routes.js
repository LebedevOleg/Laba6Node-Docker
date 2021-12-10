const { response } = require("express");
const auth = require("../middleware/auth.middleware");
const Router = require("express");
const router = new Router();
const db = require("../db");

// /api/forum/sendPost
router.post("/sendPost", async (req, res) => {
  try {
    const { userId, text } = req.body;
    const newPost = await db.query(
      "INSERT INTO post (user_id, text) values ($1,$2)",
      [userId, text]
    );
    return res.status(201).json({
      message: "Пост успешно опубликован! и скоро появится на экране",
    });
  } catch (e) {
    res.status(400).json({ message: "Oh my, It's broken " + e.message });
  }
});

router.get("/getPost", auth, async (req, res) => {
  try {
    const posts = await db.query(
      "SELECT user_id, users.login,  post.text, post.date, post.id FROM post full outer join users on post.user_id = users.id where post.text is not null ORDER BY date desc"
    );
    if (posts.rowCount == 0) {
      return res.json({ message: "Здесь еще нет постов" });
    }

    res.json(posts.rows);
  } catch (e) {
    res.json({ message: e.message });
  }
});

router.post("/deletePost", async (req, res) => {
  try {
    const { postId } = req.body;
    const deleted = await db.query("DELETE FROM post WHERE id = $1", [postId]);
    res.json({ message: "Пост удален" });
  } catch (e) {
    res.json({ message: e.message });
  }
});

router.post("/updatePost", async (req, res) => {
  try {
    const { postId, text } = req.body;
    const update = await db.query("UPDATE post SET text=$1 WHERE id = $2", [
      text,
      postId,
    ]);
    res.json({ message: "Пост успешно обновлен" });
  } catch (e) {
    res.json({ message: e.message });
  }
});

router.get("/getAllUsers", async (req, res) => {
  try {
    const users = await db.query("SELECT id, login, is_block FROM users");

    if (users.rowCount == 0) {
      return res.json({ message: "Нет пользователей" });
    }

    res.json(users.rows);
  } catch (e) {
    res.json({ message: e.message });
  }
});

router.post("/blockUser", async (req, res) => {
  try {
    const { userID, blocked } = req.body;
    await db.query("UPDATE users SET is_block=$1 WHERE id = $2", [
      blocked,
      userID,
    ]);
    res.json({ message: "Состояние пользователя успешно изменено" });
  } catch (e) {
    res.json({ message: e.message });
  }
});

router.post("/likes", async (req, res) => {
  try {
    const { postId } = req.body;
    const likes = await db.query("select id from likes where post_id = $1", [
      postId,
    ]);
    res.json({ message: likes.rowCount });
  } catch (e) {
    res.json({ message: e.message });
  }
});

router.post("/Userlike", auth, async (req, res) => {
  try {
    const { postId } = req.body;
    const likes = await db.query(
      "select id from likes where user_id = $1 and post_id = $2",
      [req.userAuth.userId, postId]
    );
    if (likes.rowCount === 0) {
      return res.json({ message: false });
    }
    res.json({ message: true });
  } catch (e) {}
});

router.post("/chngeLike", async (req, res) => {
  try {
    const { postId, userID } = req.body;
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
      ]);
    }
  } catch (e) {
    console.log(e.message);
  }
});

router.post("/setLastPost", auth, async (req, res) => {
  try {
    const { postId, userID } = req.body;
    const lastPostID = await db.query(
      "UPDATE users SET  last_post_id=$1 WHERE id = $2 ",
      [postId, userID]
    );
    res.json(lastPostID.rows);
  } catch (e) {
    res.json(e.message);
  }
});

router.get("/getLastPost", auth, async (req, res) => {
  try {
    const last = await db.query(
      "SELECT last_post_id FROM users WHERE id = $1",
      [req.userAuth.userId]
    );

    res.json({ lastId: last.rows[0].last_post_id });
  } catch (e) {
    console.log(e.message);
  }
});

// */api/forum/importDataDate
router.post("/importDataDate", async (req, res) => {
  try {
    const { StartDate, EndDate } = req.body;

    const messagesDB = await db.query(
      "SELECT post.id, users.login, post.text, post.date, count(likes), users.email FROM post full outer join users on post.user_id = users.id left join likes on post.id = likes.post_id where post.text is not null and post.date > $1 and post.date < $2 group by post.id,users.id ORDER BY date desc",
      [StartDate, EndDate]
    );
    res.json(messagesDB);
  } catch (e) {
    console.log(e.message);
  }
});

router.post("/importDataCount", async (req, res) => {
  try {
    const { Count, side } = req.body;
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

    res.json(messagesDB);
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;
