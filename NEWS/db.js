const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5555,
  database: "laba3node",
});

module.exports = pool;
