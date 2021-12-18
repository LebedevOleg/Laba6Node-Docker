const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  password: "0000",
  host: "172.18.0.6",
  port: 5432,
  database: "laba3node",
});

module.exports = pool;
