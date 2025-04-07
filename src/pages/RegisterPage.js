import axios from "axios";
import { useState } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      alert(response.data.message); // Show success message
    } catch (error) {
      console.error("Registration Error:", error.response?.data);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Full Name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <button className="btn btn-success register-btn" type="submit">Register</button>
        </form>
      </div>
      <style jsx>{`
        .register-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #ff7e5f, #feb47b);
        }
        .register-box {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          width: 350px;
          text-align: center;
        }
        .register-title {
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
        .register-btn {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 5px;
          background: #28a745;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: 0.3s;
        }
        .register-btn:hover {
          background: #218838;
        }
      `}</style>
    </div>
  );
}

export default RegisterPage;
