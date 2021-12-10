const express = require("express");
const config = require("config");
const signRouter = require("./routes/sign.routes");

const PORT = config.get("port") || 5001;

const app = express();
app.use(express.json({ extended: true }));
app.use("/api/auth", signRouter);

app.listen(PORT, () =>
  console.log(`Auth server has been started!!!!!! on port ${PORT}`)
);
