import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅ SPA navigation

  const handleRegister = async () => {
    try {
      setError("");

      await api.post("/auth/register", {
        email,
        password
      });

      alert("Account created! Now login.");

      // 🚀 SPA redirect (no reload)
      navigate("/");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>

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

      <button onClick={handleRegister}>Register</button>

      {/* 🔥 ERROR MESSAGE */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 🔥 NAV TO LOGIN */}
      <p
        style={{ marginTop: "10px", cursor: "pointer", color: "blue" }}
        onClick={() => navigate("/")}
      >
        Already have an account? Login here
      </p>
    </div>
  );
}

export default Register;