const pool = require("./db");

const createTransaction = async (transaction) => {
  const { booking_id, amount, payment_status, payment_methods, payment_type, transaction_details } = transaction;
  const query =
    "INSERT INTO transactions (booking_id, amount, transaction_date, payment_status, payment_methods, payment_type, transaction_details, createdAt) VALUES ($1, $2, NOW(), $3, $4, $5, $6, NOW()) RETURNING *";
  const values = [booking_id, amount, payment_status, payment_methods, payment_type, transaction_details];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getTransactions = async () => {
  const query = "SELECT * FROM transactions";
  const { rows } = await pool.query(query);
  return rows;
};

const getTransactionById = async (id) => {
  const query = "SELECT * FROM transactions WHERE id = $1";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const updateTransaction = async (id, transaction) => {
  const { booking_id, amount, payment_status, payment_methods, payment_type, transaction_details } = transaction;
  const query =
    "UPDATE transactions SET booking_id = $1, amount = $2, payment_status = $3, payment_methods = $4, payment_type = $5, transaction_details = $6, updatedAt = NOW() WHERE id = $7 RETURNING *";
  const values = [booking_id, amount, payment_status, payment_methods, payment_type, transaction_details, id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteTransaction = async (id) => {
  const query = "DELETE FROM Transactions WHERE id = $1 RETURNING *";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
