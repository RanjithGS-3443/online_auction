import axios from "axios";
import { useEffect, useState } from "react";
import { FaBoxOpen, FaGavel, FaMoneyBillWave } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [currentBid, setCurrentBid] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [bidderName, setBidderName] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((response) => {
        console.log("✅ Product Data:", response.data);
        setProduct(response.data);
        setCurrentBid(response.data.highestBid || response.data.startingPrice);
        setBidHistory(response.data.bids ? response.data.bids.reverse() : []);
      })
      .catch((error) => {
        console.error("❌ Error fetching product details:", error);
        setProduct(null);
      });
  }, [id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    const bidValue = parseFloat(bidAmount);

    if (!bidderName.trim()) {
      toast.error("Please enter your name!");
      return;
    }
    if (isNaN(bidValue) || bidValue <= currentBid) {
      toast.error("Bid must be higher than the current highest bid!");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/products/${id}/bid`, {
        bidderName,
        bidAmount: bidValue,
      });

      if (response.data.success) {
        toast.success("🎉 Bid placed successfully!");
        setCurrentBid(bidValue);
        setBidHistory([{ bidderName, bidAmount: bidValue }, ...bidHistory]);
        setBidAmount("");
        setBidderName("");
        setTimeLeft(30);
      } else {
        toast.error("❌ Bid failed. Try again!");
      }
    } catch (error) {
      console.error("❌ Error placing bid:", error);
      toast.error("❌ Failed to place bid. Please try again!");
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      toast.success("⏳ Auction ended! Redirecting to payment...");
      setTimeout(() => navigate(`/payment/${id}`), 2000);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, navigate, id]);

  if (!product) {
    return <h2 className="text-center mt-5 text-danger">❌ Product not found!</h2>;
  }

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center">
        <FaBoxOpen className="text-primary me-2" /> {product.name}
      </h2>

      <div className="card shadow-lg border-0 mt-4 p-4">
        <img
          src={`http://localhost:5000${product.imageUrl}`}
          className="card-img-top rounded"
          alt={product.name}
          style={{ maxWidth: "500px", display: "block", margin: "auto" }}
        />

        <div className="card-body text-center">
          <h4 className="text-dark fw-bold">
            Starting Price: <span className="text-success">${product.startingPrice}</span>
          </h4>
          <h6 className="text-muted">
            Seller: {product.sellerName} ({product.sellerEmail})
          </h6>

          {/* Display Description from Database with Icons */}
          {product.description && (
            <div className="text-start mt-4 p-3 bg-light border rounded">
              <h4 className="text-primary">Product Description</h4>
              <div className="description">
                {product.description.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          )}

          <hr />
          <h4 className="text-primary">
            <FaGavel className="me-2" /> Bidding Section
          </h4>
          <h5 className="text-success">
            <FaMoneyBillWave className="me-2" /> Current Highest Bid: ${currentBid}
          </h5>
          <h6 className="text-danger fw-bold">⏳ Time Left: {timeLeft}s</h6>

          {/* 🔹 Bid Submission Form */}
          <form onSubmit={handleBidSubmit} className="mt-3">
            <div className="d-flex justify-content-center">
              <input
                type="text"
                className="form-control w-25 me-2"
                placeholder="Your Name"
                value={bidderName}
                onChange={(e) => setBidderName(e.target.value)}
                required
              />
              <input
                type="number"
                className="form-control w-25 me-2"
                placeholder="Enter Bid"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">Place Bid</button>
            </div>
          </form>

          <hr />
          <h5 className="text-secondary">📜 Bidding History</h5>
          <ul className="list-group">
            {bidHistory.length > 0 ? (
              bidHistory.map((bid, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between">
                  <strong>{bid.bidderName}</strong>
                  <span>${bid.bidAmount}</span>
                </li>
              ))
            ) : (
              <li className="list-group-item text-center text-muted">No bids yet</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
