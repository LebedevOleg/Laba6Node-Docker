const { response } = require("express");
const Router = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = new Router();
const { check, validationResult } = require("express-validator");
const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 30 });

router.get("/getNews", async (req, res) => {
  if (cache.has("news")) {
    return res.json(cache.get("news"));
  } else {
    try {
      await axios
        .get(config.get("NEWS") + "/api/news/getNews")
        .then((result) => {
          cache.set("news", result.data);
          res.json(result.data);
        });
    } catch (e) {
      res.status(400).json(e.message);
    }
  }
});
module.exports = router;
