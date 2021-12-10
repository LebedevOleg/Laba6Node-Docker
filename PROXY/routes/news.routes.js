const { response } = require("express");
const Router = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = new Router();
const db = require("../db");
const { check, validationResult } = require("express-validator");

router.post("/getNews", async (req, res) => {
  try {
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
});

module.exports = router;
