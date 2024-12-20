const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Handy",
  password: "A35195lo0Z",
  port: 5432,
});

module.exports = pool;
