const { response } = require("express");
const Router = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = new Router();
const { check, validationResult } = require("express-validator");
const axios = require("axios");
var convert = require("xml-js");
const cheerio = require("cheerio");
const url = "https://rssexport.rbc.ru/rbcnews/news/30/full.rss";

router.get("/getNews", async (req, res) => {
  console.log("here");
  axios.get(url).then((result) => {
    var resJSON = convert.xml2json(result.data, { compact: true });
    res.json(resJSON);
  });
});
module.exports = router;
