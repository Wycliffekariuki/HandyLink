const { Pool } = require("pg");

//Connecting to the database
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Handy",
  password: "A35195lo0Z",
  port: 5432,
});

//Function to execute my amazing, God sent, query
var query = (text, params) => pool.query(text, params);


module.exports = {pool, query };
