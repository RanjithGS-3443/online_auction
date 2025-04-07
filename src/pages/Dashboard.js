import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [auctions, setAuctions] = useState([]);
  const [completedPayments, setCompletedPayments] = useState([]);

  // 🔹 Fetch all auctions
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        console.log("✅ Products fetched:", response.data);
        setAuctions(response.data);
      })
      .catch((error) => console.error("❌ Error fetching auctions:", error.message));
  }, []);

  // 🔹 Fetch all payments to check for completed auctions
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/payments/all") 
      .then((res) => {
        console.log("✅ All payments fetched:", res.data);
        setCompletedPayments(res.data);
      })
      .catch((error) =>
        console.error("❌ Error fetching payments:", error.message)
      );
  }, []);

  // 🔹 Set background color
  useEffect(() => {
    document.body.style.background = "rgb(6, 3, 200)";
    document.body.style.minHeight = "100vh";
    document.body.style.margin = "0";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  return (
    <div className="container mt-5 dashboard-container">
      <h2 className="text-center mb-4">
        <i className="fas fa-gavel text-primary"></i> Ongoing Auctions
      </h2>

      <div className="row">
        {auctions.map((auction) => {
          // Check if this product has a payment by matching product name
          const payment = completedPayments.find(p => p.productName === auction.name);
          const isCompleted = !!payment;
          const finalBid = payment ? payment.biddedAmount : auction.startingPrice;

          return (
            <div className="col-md-6 col-lg-4 mb-4" key={auction._id}>
              <div className={`card shadow-sm border-0 ${isCompleted ? 'auction-completed' : ''}`}>
                {isCompleted && (
                  <div className="auction-status-container">
                    <div className="auction-completed-banner">Auction Completed</div>
                  </div>
                )}
                <img
                  src={
                    auction.imageUrl.startsWith("/")
                      ? `http://localhost:5000${auction.imageUrl}`
                      : auction.imageUrl
                  }
                  className="card-img-top"
                  alt={auction.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{auction.name}</h5>
                  <p
                    className={`card-text fw-bold ${
                      isCompleted ? "text-danger" : "text-success"
                    }`}
                  >
                    {isCompleted
                      ? `Final Bid: $${finalBid}`
                      : `Starting Price: $${auction.startingPrice}`}
                  </p>

                  {!isCompleted && (
                    <Link
                      to={`/product/${auction._id}`}
                      className="btn btn-outline-primary"
                    >
                      <i className="fas fa-eye"></i> View Auction
                    </Link>
                  )}
                  
                  {isCompleted && (
                    <div className="btn btn-outline-secondary disabled">
                      <i className="fas fa-check-circle"></i> Sold
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>
        {`
        .dashboard-container {
          background: rgba(222, 233, 6, 0.8);
          padding: 20px;
          border-radius: 10px;
        }
        
        .auction-completed {
          position: relative;
          border: 2px solid #dc3545 !important;
        }
        
        .auction-status-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          z-index: 2;
        }
        
        .auction-completed-banner {
          background-color: rgba(220, 53, 69, 0.9);
          color: white;
          padding: 8px 0;
          font-weight: bold;
          text-align: center;
          width: 100%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        `}
      </style>
    </div>
  );
}

export default Dashboard;
