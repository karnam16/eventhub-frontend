import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";
import "./auth.css";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return setError("Please enter a valid email address");
    }

    // Password match validation
    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    try {
      await API.post("/auth/register", {
        email,
        password,
      });

      // Redirect to login after successful registration
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Register</h2>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleRegister}>
        <div className="auth-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="auth-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        <button className="auth-btn" type="submit">
          Register
        </button>
      </form>

      <div className="auth-switch">
        Already have an account?{" "}
        <button type="button" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Register;
