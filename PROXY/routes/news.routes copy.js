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
      await axios.post("/api/auth/register", req.body);
    } catch (e) {
      res.status(401).json({ message: e.message });
    }
  }
);

module.exports = router;
