import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Inter', sans-serif"
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center"
  },
  logo: {
    fontSize: "32px",
    marginBottom: "10px"
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "8px"
  },
  subtitle: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "30px"
  },
  inputGroup: {
    marginBottom: "15px",
    textAlign: "left"
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#555",
    marginBottom: "5px",
    marginLeft: "2px"
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s"
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background 0.2s"
  },
  footerText: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#666"
  },
  link: {
    color: "#007bff",
    cursor: "pointer",
    fontWeight: "600",
    textDecoration: "none"
  },
  error: {
    color: "#dc3545",
    backgroundColor: "#fbeaea",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "13px",
    marginTop: "15px"
  }
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError("");
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/books");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Log in to manage your reading journey</p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            style={styles.input}
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          />
        </div>

        <button 
          style={styles.button} 
          onClick={handleLogin}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Sign In
        </button>

        {error && <div style={styles.error}>{error}</div>}

        <p style={styles.footerText}>
          Don't have an account?{" "}
          <span 
            style={styles.link} 
            onClick={() => navigate("/register")}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;