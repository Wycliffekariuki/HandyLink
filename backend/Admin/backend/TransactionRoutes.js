const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require("./transactionQuery");

// Create a new transaction
router.post("/", async (req, res) => {
  try {
    const transaction = await createTransaction(req.body);
    res.status(201).send(transaction);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await getTransactions();
    res.send(transactions);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a transaction by ID
router.get("/:id", async (req, res) => {
  try {
    const transaction = await getTransactionById(req.params.id);
    if (!transaction) return res.status(404).send();
    res.send(transaction);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a transaction by ID
router.put("/:id", async (req, res) => {
  try {
    const transaction = await updateTransaction(req.params.id, req.body);
    if (!transaction) return res.status(404).send();
    res.send(transaction);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a transaction by ID
router.delete("/:id", async (req, res) => {
  try {
    const transaction = await deleteTransaction(req.params.id);
    if (!transaction) return res.status(404).send();
    res.send(transaction);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
