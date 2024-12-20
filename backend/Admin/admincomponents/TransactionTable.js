import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    booking_id: "",
    amount: "",
    payment_status: "",
    payment_methods: "",
    payment_type: "",
    transaction_details: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/transactions").then((response) => setTransactions(response.data));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/transactions/${id}`)
      .then(() => setTransactions(transactions.filter((transaction) => transaction.id !== id)));
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/api/transactions/${editingTransaction.id}`, editingTransaction).then(() => {
      setTransactions(
        transactions.map((transaction) =>
          transaction.id === editingTransaction.id ? editingTransaction : transaction,
        ),
      );
      setEditingTransaction(null);
    });
  };

  const handleAdd = () => {
    axios.post("http://localhost:5000/api/transactions", newTransaction).then((response) => {
      setTransactions([...transactions, response.data]);
      setNewTransaction({
        booking_id: "",
        amount: "",
        payment_status: "",
        payment_methods: "",
        payment_type: "",
        transaction_details: "",
      });
    });
  };

  return (
    <div>
      <h2>Manage Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Amount</th>
            <th>Payment Status</th>
            <th>Payment Methods</th>
            <th>Payment Type</th>
            <th>Transaction Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.booking_id}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.payment_status}</td>
              <td>{transaction.payment_methods}</td>
              <td>{transaction.payment_type}</td>
              <td>{transaction.transaction_details}</td>
              <td>
                <button onClick={() => handleEdit(transaction)}>Edit</button>
                <button onClick={() => handleDelete(transaction.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Add New Transaction</h3>
      <input
        placeholder="Booking ID"
        value={newTransaction.booking_id}
        onChange={(e) => setNewTransaction({ ...newTransaction, booking_id: e.target.value })}
      />
      <input
        placeholder="Amount"
        value={newTransaction.amount}
        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
      />
      <input
        placeholder="Payment Status"
        value={newTransaction.payment_status}
        onChange={(e) => setNewTransaction({ ...newTransaction, payment_status: e.target.value })}
      />
      <input
        placeholder="Payment Methods"
        value={newTransaction.payment_methods}
        onChange={(e) => setNewTransaction({ ...newTransaction, payment_methods: e.target.value })}
      />
      <input
        placeholder="Payment Type"
        value={newTransaction.payment_type}
        onChange={(e) => setNewTransaction({ ...newTransaction, payment_type: e.target.value })}
      />
      <input
        placeholder="Transaction Details"
        value={newTransaction.transaction_details}
        onChange={(e) => setNewTransaction({ ...newTransaction, transaction_details: e.target.value })}
      />
      <button onClick={handleAdd}>Add Transaction</button>
      {editingTransaction && (
        <div>
          <h3>Edit Transaction</h3>
          <input
            placeholder="Booking ID"
            value={editingTransaction.booking_id}
            onChange={(e) => setEditingTransaction({ ...editingTransaction, booking_id: e.target.value })}
          />
          <input
            placeholder="Amount"
            value={editingTransaction.amount}
            onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: e.target.value })}
          />
          <input
            placeholder="Payment Status"
            value={editingTransaction.payment_status}
            onChange={(e) => setEditingTransaction({ ...editingTransaction, payment_status: e.target.value })}
          />
          <input
            placeholder="Payment Methods"
            value={editingTransaction.payment_methods}
            onChange={(e) => setEditingTransaction({ ...editingTransaction, payment_methods: e.target.value })}
          />
          <input
            placeholder="Payment Type"
            value={editingTransaction.payment_type}
            onChange={(e) => setEditingTransaction({ ...editingTransaction, payment_type: e.target.value })}
          />
          <input
            placeholder="Transaction Details"
            value={editingTransaction.transaction_details}
            onChange={(e) => setEditingTransaction({ ...editingTransaction, transaction_details: e.target.value })}
          />
          <button onClick={handleUpdate}>Update Transaction</button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
