import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./viewdetail.css";


function Detailsview() {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/api/farmers/${id}`)
        .then((res) => {
          setFarmer(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load farmer data. Please try again later.");
          setLoading(false);
        });
    } else {
      setError("Farmer ID is missing or invalid");
      setLoading(false);
    }
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this farmer?")) {
      axios
        .delete(`http://localhost:3000/api/farmers/${id}`)
        .then(() => {
          navigate("/showall");
        })
        .catch(() => {
          setError("Failed to delete farmer. Please try again later.");
        });
    }
  };

  if (loading)
    return <div className="loading">Loading farmer details...</div>;

  if (error)
    return <div className="error-message">{error}</div>;

  if (!farmer)
    return <div className="no-data">No farmer data found for this ID.</div>;

  return (
    <div className="farmer-details-container">
      <div className="farmer-card">
        <h1 className="title">Listing Details</h1>

        {/* Image Display */}
        {farmer.image && (
          <div className="image-container">
            <img
              src={`http://localhost:3000/uploads/${farmer.image}`}
              alt="Harvest"
              className="farmer-image"
            />
          </div>
        )}

        {/* Farmer Details in Table Format */}
        <table className="farmer-details-table">
          <tbody>
            <tr>
              <th>Listing ID</th>
              <td>{farmer.farmerId || "N/A"}</td>
            </tr>
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
          <Link to={`/updatedetails/${farmer._id}`} className="edit-button2">
            Update Listing
          </Link>
          <button onClick={handleDelete} className="delete-button">
            Remove Listing
          </button>
        </div>
      </div>
    </div>
  );
}

export default Detailsview;
