import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./viewdetail.css";

function Detailsview() {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate(); // Add this for navigation after delete

  useEffect(() => {
    // Check if id is defined before making the API call
    if (id) {
      console.log("Fetching farmer with ID:", id); // Debug log

      axios
        .get(`http://localhost:3000/api/farmers/${id}`)
        .then((res) => {
          console.log("API response:", res.data); // Debug log
          setFarmer(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching farmer details:", error);
          setError("Failed to load farmer data. Please try again later.");
          setLoading(false);
        });
    } else {
      console.error("Farmer ID is undefined");
      setError("Farmer ID is missing or invalid");
      setLoading(false);
    }
  }, [id]);

  // Add the delete function
  const handleDelete = () => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete this farmer?")) {
      // Proceed with deletion
      axios
        .delete(`http://localhost:3000/api/farmers/${id}`)
        .then((res) => {
          console.log("Delete response:", res.data);
          // Redirect to the farmers list page after successful deletion
          navigate("/showall"); // Change this to your actual route for showing all farmers
        })
        .catch((error) => {
          console.error("Error deleting farmer:", error);
          setError("Failed to delete farmer. Please try again later.");
        });
    }
  };

  if (loading) {
    return <div>Loading farmer details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!farmer) {
    return <div>No farmer data found for this ID.</div>;
  }

  return (
    <div className="show-farmer-details">
      <div className="content">
        <h1 className="title">Farmer Details</h1>
        <p className="subtitle">This is the full detail of the farmer</p>

        <table className="custom-table">
          <tbody>
            <tr>
              <th>ID</th>
              <td>{farmer._id || "N/A"}</td>
            </tr>
            {/* <tr>
              <th>Farmer ID</th>
              <td>{farmer.farmerId || "N/A"}</td>
            </tr> */}
            <tr>
              <th>Character</th>
              <td>{farmer.Character || "N/A"}</td>
            </tr>
            <tr>
              <th>Verity</th>
              <td>{farmer.verity || "N/A"}</td>
            </tr>
            <tr>
              <th>Quantity</th>
              <td>{farmer.quantity || "N/A"}</td>
            </tr>
            <tr>
              <th>Price</th>
              <td>{farmer.price || "N/A"}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{farmer.address || "N/A"}</td>
            </tr>
            <tr>
              <th>Location</th>
              <td>{farmer.location || "N/A"}</td>
            </tr>
          </tbody>
        </table>

        <div className="button-container">
          <Link to={`/updatedetails/${farmer._id}`} className="edit-button">
            Edit Details
          </Link>
          <button onClick={handleDelete} className="delete-button">
            Delete Farmer
          </button>
        </div>
      </div>
    </div>
  );
}

export default Detailsview;