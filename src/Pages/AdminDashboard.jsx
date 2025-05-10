import React, { useEffect, useState } from "react";
import axios from "axios";
import Notiflix from "notiflix";
import {
  FaSearch,
  FaUserEdit,
  FaEnvelope,
  FaPhone,
  FaTrash,
  FaDollarSign,
  FaEdit,
  FaListAlt,
} from "react-icons/fa";
import "../CSS/AdminDashboard.css";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Notiflix.Loading.standard("Fetching users...");
    axios
      .get("https://zenithbank-backend.onrender.com/api/admin/users")
      .then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
        Notiflix.Loading.remove();
      })
      .catch((err) => {
        Notiflix.Loading.remove();
        Notiflix.Report.failure(
          "Fetch Error",
          "Unable to fetch users from the server. Please try again later.",
          "Close"
        );
        console.error("Error fetching users:", err);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term.trim()) return setFilteredUsers(users);

    const results = users.map((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const isMatch = fullName.includes(term.toLowerCase());
      return { ...user, highlight: isMatch };
    });

    const sorted = [
      ...results.filter((u) => u.highlight),
      ...results.filter((u) => !u.highlight),
    ];
    setFilteredUsers(sorted);
  };

  const handleDelete = (userId) => {
    Notiflix.Confirm.show(
      "Delete User",
      "Are you sure you want to delete this user?",
      "Yes, Delete",
      "Cancel",
      function okCb() {
        axios
          .delete(
            `https://zenithbank-backend.onrender.com/api/admin/delete-user-by-id/${userId}`
          )
          .then(() => {
            Notiflix.Notify.success("User deleted successfully.");
            setUsers((prev) => prev.filter((user) => user._id !== userId));
            setFilteredUsers((prev) =>
              prev.filter((user) => user._id !== userId)
            );
          })
          .catch((err) => {
            Notiflix.Notify.failure("Failed to delete user.");
            console.error("Delete error:", err);
          });
      },
      function cancelCb() {
        Notiflix.Notify.info("Action canceled.");
      }
    );
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <a href="#">Dashboard</a>
          <a href="#">Users</a>
          <a href="#">Logout</a>
        </nav>
      </div>

      <div className="main-content">
        <header>
          <h1>Admin Dashboard</h1>
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Search user by name..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </header>

        <div className="user-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr
                  key={idx}
                  style={{
                    backgroundColor: user.highlight ? "#fee2e2" : "white",
                  }}
                >
                  <td>
                    <FaUserEdit /> {user.firstName} {user.lastName}
                  </td>
                  <td>
                    <FaEnvelope /> {user.emailAddress}
                  </td>
                  <td>
                    <FaPhone /> {user.phoneNumber}
                  </td>
                  <td>
                    <FaDollarSign /> ${user.accountBalance}
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/update-user/${user.accountNumber}`)
                      }
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="edit-btn"
                      style={{ backgroundColor: "#16a34a" }}
                      onClick={() =>
                        navigate(`/transactions/${user.accountNumber}`)
                      }
                    >
                      <FaListAlt /> Transactions
                    </button>
                    <button
                      className="edit-btn"
                      style={{ backgroundColor: "red" }}
                      onClick={() => handleDelete(user._id)} // Pass MongoDB _id here
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
