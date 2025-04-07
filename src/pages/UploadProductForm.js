import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UploadProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [image, setImage] = useState(null); // ✅ New state for image

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !startingPrice || !sellerName || !sellerEmail || !image) {
      toast.error("Please fill in all fields and upload an image", { position: "top-center" });
      return;
    }

    const token = localStorage.getItem("token"); // Retrieve JWT token
    if (!token) {
      toast.error("Unauthorized. Please log in first.", { position: "top-center" });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("startingPrice", startingPrice);
    formData.append("sellerName", sellerName);
    formData.append("sellerEmail", sellerEmail);
    formData.append("image", image); // ✅ Attach image file

    try {
      const response = await fetch("http://localhost:5000/api/products/add", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // ✅ Authentication token
        body: formData, // ✅ Send as FormData
      });

      if (response.ok) {
        toast.success("Product added successfully!", { position: "top-center" });
        setName("");
        setDescription("");
        setStartingPrice("");
        setSellerName("");
        setSellerEmail("");
        setImage(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add product", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error. Please try again later.", { position: "top-center" });
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h2 className="text-center text-primary">Upload New Product</h2>
      <form className="card p-4 shadow-lg" onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="form-label">Product Name</label>
        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />

        <label className="form-label mt-3">Description</label>
        <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>

        <label className="form-label mt-3">Starting Price</label>
        <input type="number" className="form-control" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} required />

        <label className="form-label mt-3">Seller Name</label>
        <input type="text" className="form-control" value={sellerName} onChange={(e) => setSellerName(e.target.value)} required />

        <label className="form-label mt-3">Seller Email</label>
        <input type="email" className="form-control" value={sellerEmail} onChange={(e) => setSellerEmail(e.target.value)} required />

        <label className="form-label mt-3">Product Image</label>
        <input type="file" className="form-control" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />

        <button type="submit" className="btn btn-primary mt-4 w-100">Upload Product</button>
      </form>
    </div>
  );
}

export default UploadProductForm;
