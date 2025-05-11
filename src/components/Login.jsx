import React, { useState } from "react";
import axios from "axios";
import Notiflix from "notiflix";
import "../CSS/Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://zenithbank-backend.onrender.com/api/admin/login",
        {
          email,
          password,
        }
      );

      Notiflix.Notify.success("Login successful!");
      localStorage.setItem("adminToken", res.data.token);
      window.location.href = "/admin-dashboard";
    } catch (err) {
      console.error("Login failed", err);
      Notiflix.Notify.failure("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <img src="/LOADINGIMG.png" alt="Logo" />
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <div className="input-icon">
            <FontAwesomeIcon icon={faEnvelope} />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              inputMode="email"
              autoComplete="username"
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="input-icon">
            <FontAwesomeIcon icon={faLock} />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              inputMode="text"
              autoComplete="current-password"
            />
            <span
              className="eye-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!email || !password || loading}
          className={loading ? "loading" : ""}
        >
          <FontAwesomeIcon icon={faRightToBracket} />
          {loading ? " Continuing to Dashboard..." : " Login"}
        </button>

        <p className="change-password-link">
          <a href="/change-password">Change Password</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
