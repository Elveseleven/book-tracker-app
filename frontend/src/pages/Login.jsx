import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅ FIXED (must be here)

  const handleLogin = async () => {
    try {
      setError("");

      const res = await api.post("/auth/login", {
        email,
        password
      });

      // 💾 SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      // 🚀 REDIRECT TO BOOKS
      navigate("/books"); // ✅ correct usage
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button onClick={handleLogin}>Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* NAV TO REGISTER */}
      <p
        style={{ marginTop: "10px", cursor: "pointer", color: "blue" }}
        onClick={() => navigate("/register")}
      >
        Don't have an account? Register here
      </p>
    </div>
  );
}

export default Login;