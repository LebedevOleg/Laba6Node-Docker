const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  password: "postgres",
  host: "192.10.1.2",
  port: 5432,
  database: "laba3node",
});

module.exports = pool;
