const express = require("express");
const config = require("config");
const path = require("path");
const authProxyRoute = require("./routes/auth.routes");
const forumProxyRoute = require("./routes/forum.routes");
const NewsProxyRoute = require("./routes/news.routes");

const PORT = config.get("port") || 5000;
const app = express();

app.use(express.json({ extended: true }));
app.use("/api/auth", authProxyRoute);
app.use("/api/forum", forumProxyRoute);
app.use("/api/news", NewsProxyRoute);

if (process.env.NODE_ENV === "prodaction") {
  app.use("/", express.static(path.join(__dirname, "client", "build")));
  console.log("here");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () =>
  console.log(`PROXY has been started!!!!!! on port ${PORT}`)
);
