const express = require("express");
const config = require("config");
const authProxyRoute = require("./routes/auth.routes");
const forumProxyRoute = require("./routes/forum.routes");

const PORT = config.get("port") || 5000;

const app = express();
app.use(express.json({ extended: true }));
app.use("/api/auth", authProxyRoute);
app.use("/api/forum", forumProxyRoute);

app.listen(PORT, () =>
  console.log(`PROXY has been started!!!!!! on port ${PORT}`)
);
