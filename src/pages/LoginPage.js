import { useContext, useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Stores error messages
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message

    try {
      console.log("🔄 Attempting login with:", { email, password });

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("🔍 Server Response Status:", response.status);

      const data = await response.json();
      console.log("📩 Response Data:", data); // Debugging

      if (response.ok) {
        // Save token and user details in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Update AuthContext
        login(data.user);

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setErrorMessage(data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("❌ Login Error:", error);
      setErrorMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary login-btn">Login</button>
        </form>
      </div>
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #6a11cb, #2575fc);
        }
        .login-box {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          width: 350px;
          text-align: center;
        }
        .login-title {
          margin-bottom: 20px;
          color: #333;
        }
        .input-group {
          display: flex;
          align-items: center;
          background: #f1f1f1;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 15px;
        }
        .icon {
          margin-right: 10px;
          color: #555;
        }
        .form-control {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 16px;
        }
        .login-btn {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 5px;
          background: #2575fc;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: 0.3s;
        }
        .login-btn:hover {
          background: #1a5ac9;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
