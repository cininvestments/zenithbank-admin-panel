/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import "../CSS/ChangePassword.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Notiflix from "notiflix";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const checkEmailExists = async () => {
    try {
      const res = await axios.post(
        "https://zenithbank-backend.onrender.com/api/admin/check-email",
        { email }
      );
      setEmailValid(res.data.exists);
    } catch (err) {
      setEmailValid(false);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (!emailValid) {
      Notiflix.Notify.failure("Admin email does not exist.");
      return;
    }

    try {
      await axios.post(
        "https://zenithbank-backend.onrender.com/api/admin/change-password-email-only",
        {
          email,
          newPassword,
        }
      );
      Notiflix.Notify.success("Password changed successfully!");
      setEmail("");
      setNewPassword("");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      Notiflix.Notify.failure("Failed to change password.");
      console.error(err);
    }
  };

  return (
    <div className="change-password-container">
      <form onSubmit={handleChange}>
        <h2>Change Admin Password</h2>

        <div className="input-group">
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onBlur={checkEmailExists}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {emailValid === false && (
          <small className="error-text">
            Email not found in admin records.
          </small>
        )}

        <div className="input-group">
          <FontAwesomeIcon icon={faLock} className="icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className="toggle-icon"
            onClick={togglePasswordVisibility}
          />
        </div>

        <button type="submit">Change Password</button>
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/")}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Login
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
