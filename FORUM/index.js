const express = require("express");
const config = require("config");
const forumRouter = require("./routes/forum.routes");

const PORT = config.get("port") || 5002;

const app = express();
app.use(express.json({ extended: true }));
app.use("/api/forum", forumRouter);

app.listen(PORT, () =>
  console.log(`FUck has been started!!!!!! on port ${PORT}`)
);
