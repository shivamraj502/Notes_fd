import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const API = "https://notes-943e.onrender.com";
  // const API = "http://localhost:5000";

  const handleSubmit = async () => {
    setError("");
    try {
      if (isRegister) {
        await axios.post(`${API}/register`, { email, password });
        setIsRegister(false);
        setError("Registered! Now log in.");
      } else {
        const res = await axios.post(`${API}/login`, { email, password });
        localStorage.setItem("token", res.data.token);
        onLogin();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-box">
      <h2>{isRegister ? "Register" : "Login"}</h2>

      <input
        className="note-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="note-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="add-btn" onClick={handleSubmit}>
        {isRegister ? "Register" : "Login"}
      </button>

      {error && <p className="auth-error">{error}</p>}

      <p className="auth-toggle" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login" : "New here? Register"}
      </p>
    </div>
  );
}

export default Login;