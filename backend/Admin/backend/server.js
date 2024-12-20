const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./userRoutes");
const serviceRoutes = require("./serviceRoutes");
const serviceBookingRoutes = require("./ServiceBookingRoutes");
const transactionRoutes = require("./transactionRoutes");
const { Pool } = require("pg");

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Handy",
  password: "A35195lo0Z",
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error("Connection error", err.stack);
  } else {
    console.log("Connected to PostgreSQL");
  }
});

app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/serviceBookings", serviceBookingRoutes);
app.use("/api/transactions", transactionRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
