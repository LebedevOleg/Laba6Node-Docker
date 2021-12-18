const { response } = require("express");
const Router = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = new Router();
const { check, validationResult } = require("express-validator");
const axios = require("axios");

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
      console.log("register", req.body);
      await axios
        .post(config.get("AUTH") + "/api/auth/register", req.body)
        .then((result) => {
          res.status(201).json(result.data);
        });
    } catch (e) {
      res.status(401).json({ message: e.message });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    console.log(config.get("AUTH") + "/api/auth/login");

    await axios
      .post(config.get("AUTH") + "/api/auth/login", req.body)
      .then((result) => {
        console.log("here");
        res.status(201).json(result.data);
      });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: e.message });
  }
});

router.post("/getUserLogin", async (req, res) => {
  try {
    console.log("getUserLogin", req.body);
    await axios
      .post(config.get("AUTH") + "/api/auth/getUserLogin", req.body)
      .then((result) => {
        res.status(201).json(result.data);
      });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

module.exports = router;
