import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa"; // Importing checkmark icon
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [bidDetails, setBidDetails] = useState(null);
  const [bidderName, setBidderName] = useState("");
  const [bidderEmail, setBidderEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCVV] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false); // State for payment success animation

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        if (response.data) {
          setProduct(response.data);
          setBidDetails({
            biddedAmount: response.data.highestBid || response.data.startingPrice,
          });
        } else {
          setError("❌ Product Not Found!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("⚠️ Unable to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!bidderName.trim() || !bidderEmail.trim() || !address.trim()) {
      toast.error("⚠️ Please fill in all required fields!");
      return;
    }

    if (paymentMethod === "Credit Card") {
      if (!/^[0-9]{16}$/.test(cardNumber)) {
        toast.error("⚠️ Enter a valid 16-digit card number!");
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiryDate)) {
        toast.error("⚠️ Enter a valid expiry date (MM/YY)!");
        return;
      }
      if (!/^[0-9]{3}$/.test(cvv)) {
        toast.error("⚠️ Enter a valid 3-digit CVV!");
        return;
      }
    }

    // Prepare the payment data
    const paymentData = {
      productId: id,
      bidderName,       // userName
      bidderEmail,      // userEmail
      address,
      paymentMethod,
      cardNumber,
      expiryDate,
      cvv,
      biddedAmount: product.highestBid || product.startingPrice,  // biddedAmount
      productName: product.name, // productName
    };

    try {
      const response = await axios.post("http://localhost:5000/api/payments", paymentData);
      if (response.data.success) {
        setPaymentSuccess(true); // Show the success animation
        toast.success("✅ Payment successful! Redirecting...");
        setTimeout(() => navigate("/success"), 2000);
      } else {
        toast.error("⚠️ Error processing payment. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("⚠️ Error processing payment. Please try again.");
    }
  };

  if (loading) return <h2 className="text-center mt-5">⏳ Loading Payment Details...</h2>;
  if (error) return <h2 className="text-center text-danger">{error}</h2>;

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center text-primary">💳 Payment Details</h2>
      <div className="card shadow-lg border-0 mt-4 p-4">
        <h4>Product: <span className="text-success">{product?.name || "Unknown Product"}</span></h4>
        <h4>Winning Bid: <span className="text-danger">${bidDetails?.biddedAmount || "N/A"}</span></h4>

        {paymentSuccess && (
          <div className="text-center mt-4">
            <FaCheckCircle size={50} color="green" className="mb-3" />
            <h3>Payment Successful!</h3>
          </div>
        )}

        {!paymentSuccess && (
          <form onSubmit={handlePayment} className="mt-3">
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" value={bidderName} onChange={(e) => setBidderName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={bidderEmail} onChange={(e) => setBidderEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Shipping Address</label>
              <textarea className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Payment Method</label>
              <select className="form-control" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option>Credit Card</option>
                <option>PayPal</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            {paymentMethod === "Credit Card" && (
              <>
                <div className="mb-3">
                  <label className="form-label">Card Number</label>
                  <input type="text" className="form-control" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} maxLength="16" placeholder="1234567812345678" />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Expiry Date</label>
                    <input type="text" className="form-control" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} maxLength="5" placeholder="MM/YY" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">CVV</label>
                    <input type="text" className="form-control" value={cvv} onChange={(e) => setCVV(e.target.value)} maxLength="3" placeholder="123" />
                  </div>
                </div>
              </>
            )}
            <button type="submit" className="btn btn-success">Confirm Payment</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;
