import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Notiflix from "notiflix";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaWallet,
} from "react-icons/fa";
import "../CSS/UpdateUser.css";

export default function UpdateUser() {
  const { accountNumber } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Mapping of field names to icons
  const iconMap = {
    firstName: <FaUser />,
    lastName: <FaUser />,
    emailAddress: <FaEnvelope />,
    phoneNumber: <FaPhone />,
    address: <FaHome />,
    accountBalance: <FaWallet />,
  };

  useEffect(() => {
    Notiflix.Loading.standard("Fetching user data...");
    axios
      .get(
        `https://zenithbank-backend.onrender.com/api/admin/user/${accountNumber}`
      )
      .then((res) => {
        setFormData(res.data);
        setOriginalData(res.data);
        setLoading(false);
        Notiflix.Loading.remove();
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch user data.");
        Notiflix.Notify.failure("Failed to fetch user data.");
        Notiflix.Loading.remove();
        setLoading(false);
      });
  }, [accountNumber]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasChanges()) return;

    setSaving(true);
    Notiflix.Loading.hourglass("Saving changes...");
    axios
      .put(
        `https://zenithbank-backend.onrender.com/api/admin/user/${accountNumber}`,
        formData
      )
      .then(() => {
        Notiflix.Notify.success("User updated successfully!");
        setSaving(false);
        Notiflix.Loading.remove();
        navigate("/admin-dashboard");
      })
      .catch((err) => {
        console.error("Update failed", err);
        Notiflix.Notify.failure("Failed to update user. Try again.");
        setSaving(false);
        Notiflix.Loading.remove();
      });
  };

  if (loading) {
    return <div className="update-user-container">Loading user data...</div>;
  }

  return (
    <div className="update-user-container">
      <div className="back-arrow" onClick={() => navigate("/admin-dashboard")}>
        <FaArrowLeft /> <span>Back to Dashboard</span>
      </div>

      <h2>Update User Info</h2>

      {error && <div className="error-message">{error}</div>}

      <form className="update-form" onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) =>
          // Exclude specific fields that shouldn't be edited
          key !== "transactionHistory" && key !== "__v" && key !== "_id" ? (
            <div className="form-group" key={key}>
              <label>{key}</label>
              <div className="input-with-icon">
                {/* Dynamically apply icons based on the key */}
                {iconMap[key] || <FaUser />}
                <input
                  type="text"
                  name={key}
                  value={value || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          ) : null
        )}

        <button type="submit" disabled={!hasChanges() || saving}>
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
