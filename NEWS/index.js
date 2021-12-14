const express = require("express");
const config = require("config");
const NewsProxyRoute = require("./routes/news.rows");

const PORT = config.get("port") || 5003;

const app = express();
app.use(express.json({ extended: true }));
app.use("/api/news", NewsProxyRoute);

app.listen(PORT, () =>
  console.log(`NEWS has been started!!!!!! on port ${PORT}`)
);
