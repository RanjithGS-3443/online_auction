import "bootstrap/dist/css/bootstrap.min.css";
import { useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import {
    FaCoins,
    FaGavel,
    FaHammer,
    FaMoneyBillWave,
    FaPlus,
    FaSignOutAlt
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import './Navbar.css';

function CustomNavbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleScroll = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };
  
  const openAdminDashboard = () => {
    window.open('/admin/login', '_blank');
  };

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="shadow p-3 position-relative custom-navbar"
      >
        <Container className="d-flex justify-content-center">
          <Navbar.Brand
            as={Link}
            to="/home"
            className="d-flex flex-column align-items-center"
          >
            <div className="d-flex align-items-center gap-2">
              <FaHammer className="text-warning animate-icon" size={30} />
              <FaCoins className="text-primary animate-icon" size={24} />
            </div>
            <span className="fs-4 fw-bold text-white mt-2 animate-text">
              Auction Platform
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              {user ? (
                <>
                  <Nav.Link as={Link} to="/dashboard" className="nav-item2">
                    <FaGavel className="me-1" /> Auctions
                  </Nav.Link>
                  <Nav.Link as={Link} to="/payment" className="nav-item2">
                    <FaMoneyBillWave className="me-1" /> Payments
                  </Nav.Link>
            
                  <Nav.Link as={Link} to="/upload-product" className="nav-item3">
                    <FaPlus className="me-1" /> Add Item
                  </Nav.Link>
                  <Nav.Link onClick={handleLogout} className="nav-item4">
                    <FaSignOutAlt className="me-1" /> Logout
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="nav-item" onClick={handleScroll}>
                    Login
                  </Nav.Link> &nbsp
                  <Nav.Link as={Link} to="/register" className="nav-item1" onClick={handleScroll}>
                    Register
                  </Nav.Link>
                  <Nav.Link as={Link} to="/admin/login" className="nav-item5" onClick={handleScroll}>
                    Admin Login
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {!user && (
        <div className="main-content">
          <h1 className="welcome-text">Welcome to the Auction Platform</h1>
          <p className="subtext">Bid. Win. Sell. Experience the future of auctions!</p>
          <FaGavel className="auction-icon" />
        </div>
      )}

      <style>
        {`
        .main-content {
          min-height: 100vh;
          background: url("https://source.unsplash.com/1600x900/?auction,market") center/cover no-repeat;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #fff;
          position: relative;
          animation: fadeIn 1.5s ease-in-out;
          background-color: rgba(119, 239, 6, 0.9);
        }
        .welcome-text {
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(45deg,rgb(28, 1, 146),rgb(250, 6, 6));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: slideIn 1s ease-in-out;
        }
        .subtext {
          font-size: 1.5rem;
          margin-top: 10px;
          color: rgba(231, 231, 234, 0.9);
          animation: fadeIn 2s ease-in-out;
        }
        .auction-icon {
          font-size: 5rem;
          color:rgb(255, 0, 0);
          margin-top: 20px;
          animation: bounce 2s infinite;
        }
        .nav-item {
          font-size: 18px;
          font-weight: 500;
          transition: all 0.3s ease-in-out;
          background: red;
          border-radius:15%;
          color: black;
        }
        .nav-item1 {
          font-size: 18px;
          font-weight: 500;
          transition: all 0.3s ease-in-out;
          background: orange;;
          border-radius:15%;
          color: black;
        }
        .nav-item2 {
          font-size: 18px;
          font-weight: 500;
          transition: all 0.3s ease-in-out;
          background: yellow;
          border-radius:15%;
          color: black;
          margin-right: 10px;
        }
        .nav-item3 {
          font-size: 18px;
          font-weight: 500;
          transition: all 0.3s ease-in-out;
          background: blue;
          border-radius:15%;
          color: black;
          margin-right: 10px;
        }
        .nav-item4 {
          font-size: 18px;
          font-weight: 500;
          transition: all 0.3s ease-in-out;
          background: red;
          border-radius:15%;
          color: black;
          margin-right: 10px;
        }
        .nav-item5 {
          font-size: 18px;
          font-weight: 500;
          transition: all 0.3s ease-in-out;
          background: purple;
          border-radius:15%;
          color: black;
          margin-right: 10px;
        }
        .nav-item:hover {
          color: #ffcc00 !important;
          transform: scale(1.1);
        }
        .animate-icon {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      
        .floating-icon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.7;
          animation: float 4s infinite ease-in-out;
        }
      
        .floating-icon.left { left: 20px; }
        .floating-icon.right { right: 20px; }
        @keyframes float {
          0%, 100% { transform: translateY(-50%) translateX(0); }
          50% { transform: translateY(-60%) translateX(5px); }
        }
        .bounce-icon { animation: bounce 1s infinite; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .shake-icon { animation: shake 1s infinite; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          50% { transform: translateX(3px); }
          75% { transform: translateX(-3px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        `}
      </style>
    </>
  );
}

export default CustomNavbar;
