/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Notiflix from "notiflix";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import "../CSS/Transaction.css";

const Transaction = () => {
  const { accountNumber } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://zenithbank-backend.onrender.com/api/admin/user/${accountNumber}/transactions`
        );
        setTransactions(response.data.transactionHistory || []);
      } catch (error) {
        Notiflix.Notify.failure("Error fetching transaction history");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [accountNumber]);

  const handleChangeStatus = async (transactionId, newStatus) => {
    try {
      await axios.put(
        `https://zenithbank-backend.onrender.com/api/admin/transaction/${transactionId}/status`,
        { status: newStatus }
      );
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.transactionId === transactionId
            ? { ...transaction, status: newStatus }
            : transaction
        )
      );
      Notiflix.Notify.success("Status updated");
    } catch (error) {
      Notiflix.Notify.failure("Error changing status");
      console.error(error);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await axios.delete(
        `https://zenithbank-backend.onrender.com/api/admin/transaction/${transactionId}`
      );
      setTransactions((prev) =>
        prev.filter((t) => t.transactionId !== transactionId)
      );
      Notiflix.Notify.success("Transaction deleted");
    } catch (error) {
      Notiflix.Notify.failure("Error deleting transaction");
      console.error(error);
    }
  };

  return (
    <div className="transaction-container">
      {/* Back Button */}
      <div className="back-button" onClick={() => navigate("/admin-dashboard")}>
        <FaArrowLeft className="icon" /> Back to Dashboard
      </div>

      {loading ? (
        <div className="loading">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="no-transactions">
          <FaTimesCircle className="no-icon" />
          <p>No transactions found for this account.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <h2>Transaction History</h2>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.transactionId}>
                  <td>{transaction.transactionId}</td>
                  <td>{transaction.type}</td>
                  <td>${transaction.amount}</td>
                  <td>
                    <select
                      className={`status-dropdown ${transaction.status}`}
                      value={transaction.status}
                      onChange={(e) =>
                        handleChangeStatus(
                          transaction.transactionId,
                          e.target.value
                        )
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteTransaction(transaction.transactionId)
                      }
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transaction;
