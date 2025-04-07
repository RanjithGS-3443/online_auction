import axios from "axios";
import { useEffect, useState } from "react";
import { FaGavel, FaTrophy } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AuctionDetails() {
  const { id } = useParams(); // ✅ Get auction ID from URL
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidderName, setBidderName] = useState("");
  const [highestBid, setHighestBid] = useState(null);
  const [highestBidder, setHighestBidder] = useState("No bids yet");
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // ✅ Fetch auction details from backend
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/auctions/${id}`)
      .then((response) => {
        console.log("✅ Auction Data:", response.data);
        setAuction(response.data);
        setHighestBid(response.data.startingPrice);
        setHighestBidder(response.data.highestBidder || "No bids yet");
      })
      .catch((error) => {
        console.error("❌ Error fetching auction details:", error);
        setAuction(null);
      });
  }, [id]);

  // ✅ Timer effect
  useEffect(() => {
    let countdown;
    if (isTimerActive && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      clearInterval(countdown);
      toast.success("Auction ended! Redirecting to payment...", { position: "top-center" });
      setTimeout(() => navigate("/payment"), 2000);
    }
    return () => clearInterval(countdown);
  }, [isTimerActive, timer, navigate]);

  if (!auction) {
    return <h2 className="text-center mt-5 text-danger">Auction not found!</h2>;
  }

  // ✅ Handle bid submission
  const handleBidSubmit = async () => {
    if (!bidderName.trim()) {
      toast.error("Please enter your name!", { position: "top-center" });
      return;
    }

    const newBidAmount = parseFloat(bidAmount);
    if (!newBidAmount || isNaN(newBidAmount) || newBidAmount <= highestBid) {
      toast.error(`Enter a valid bid higher than $${highestBid}!`, { position: "top-center" });
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/auctions/${id}/bid`, {
        bidderName,
        amount: newBidAmount,
      });

      setHighestBid(response.data.highestBid);
      setHighestBidder(response.data.highestBidder);
      setBidAmount("");
      setBidderName("");
      setTimer(30);
      setIsTimerActive(true);
      toast.success("Your bid has been placed successfully!", { position: "top-center" });
    } catch (error) {
      toast.error("Error placing bid. Try again!", { position: "top-center" });
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center"><FaGavel className="text-primary" /> {auction.name}</h2>
      <div className="card shadow-lg border-0 mt-4 p-4">
        <img src={`http://localhost:5000${auction.imageUrl}`} className="card-img-top rounded" alt={auction.name} style={{ maxWidth: "500px", display: "block", margin: "auto" }} />
        <div className="card-body">
          <h4 className="text-dark fw-bold text-center">Starting Price: <span className="text-success">${auction.startingPrice}</span></h4>
          <h5 className="mt-3 text-center"><FaTrophy className="text-warning" /> Highest Bid: <span className="text-danger fw-bold">${highestBid}</span></h5>
          <h6 className="text-muted text-center">By: {highestBidder}</h6>
        </div>
      </div>
    </div>
  );
}

export default AuctionDetails;
