const { response } = require("express");
const Router = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = new Router();
const db = require("../db");
const { check, validationResult } = require("express-validator");

// */api/auth/register
router.post(
  "/register",
  [
    check("email", "Неккоректный email").trim().isEmail(),
    check("password", "Минимальная длинна 3 символа")
      .trim()
      .isLength({ min: 3 }),
    check("login", "не пустой").trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ msg: errors });
      }

      const { login, password, email } = req.body;

      const users = await db.query("SELECT * FROM users where login = $1", [
        login,
      ]);
      if (users.rowCount == 0) {
        const users = await db.query("SELECT * FROM users where email = $1", [
          email,
        ]);
        if (users.rowCount == 0) {
          const newPerson = await db.query(
            "INSERT INTO users (login, password, email) values ($1, $2, $3)",
            [login, password, email]
          );
          return res
            .status(201)
            .json({ message: "Пользователь успешно создан!!" });
        } else {
          return res
            .status(400)
            .json({ message: "Пользователь с такой почтой существует!!" });
        }
      } else {
        console.log(users);
        return res
          .status(400)
          .json({ message: "Пользователь с таким именем существует!!" });
      }
    } catch (e) {
      res.status(400).json({ message: "Oh my, It's broken " + e.message });
    }
  }
);

// */api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await db.query("SELECT * FROM users WHERE login = $1", [
      login,
    ]);
    if (user.rowCount == 0) {
      return res
        .status(400)
        .json({ message: "Пользователя с таким Логином не сущесвует!" });
    }
    if (password != user.rows[0].password) {
      return res.status(400).json({ message: "Пароль не верный!" });
    }
    const token = jwt.sign(
      { userId: user.rows[0].id },
      config.get("jwtSecret"),
      { expiresIn: "365d" }
    );
    res.json({
      token,
      userId: user.rows[0].id,
      userLogin: user.rows[0].login,
      IsAdmin: user.rows[0].is_admin,
      IsBlock: user.rows[0].is_block,
    });
  } catch (e) {
    return res.status(400).json({ message: "Ошибка" });
  }
});

// */api/auth/getUserLogin
router.post("/getUserLogin", async (req, res) => {
  try {
    const { id } = req.body;
    const user = await db.query("SELECT * FROM users WHERE id = $1", [login]);
    res.json({
      login: user.rows[0].login,
      email: user.rows[0].email,
      isAdmin: user.rows[0].is_Admin,
      isBlock: user.rows[0].is_Block,
    });
  } catch (e) {}
});

module.exports = router;
