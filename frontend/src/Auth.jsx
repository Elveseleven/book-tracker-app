import { useState } from "react";
import api from "../api/axios";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const url = isLogin ? "/auth/login" : "/auth/register";

    const res = await api.post(url, { email, password });

    if (isLogin) {
      localStorage.setItem("token", res.data.token);
      window.location.href = "/books";
    } else {
      setIsLogin(true);
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={submit}>
        {isLogin ? "Login" : "Register"}
      </button>

      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer" }}>
        Switch to {isLogin ? "Register" : "Login"}
      </p>
    </div>
  );
}