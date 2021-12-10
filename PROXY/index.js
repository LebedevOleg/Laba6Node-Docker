const express = require("express");
const config = require("config");
const authProxyRoute = require("./routes/auth.routes");

const PORT = config.get("port") || 5003;

const app = express();
app.use(express.json({ extended: true }));
app.use("/api/auth", authProxyRoute);

app.listen(PORT, () =>
  console.log(`FUck has been started!!!!!! on port ${PORT}`)
);
