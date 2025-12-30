import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";
import "./auth.css";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return setError("Please enter a valid email address");
    }

    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);

      setIsLoggedIn(true);     // 🔥 THIS WAS MISSING
      navigate("/");           // redirect
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="auth-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="auth-btn" type="submit">Login</button>
      </form>

      <div className="auth-switch">
        Don’t have an account?{" "}
        <button onClick={() => navigate("/register")}>Register</button>
      </div>
    </div>
  );
}

export default Login;
