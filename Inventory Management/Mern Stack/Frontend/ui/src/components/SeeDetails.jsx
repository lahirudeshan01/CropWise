import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./SeeDetails.css";

const SeeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/inventory/${id}`);
                setItem(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching item details:", err);
                setError("Failed to fetch item details. Please try again later.");
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/inventory/${id}`);
            navigate("/");
        } catch (err) {
            console.error("Error deleting item:", err);
            setError("Failed to delete item. Please try again later.");
        }
    };

    const getExpirationStatus = (expirationDate) => {
        if (!expirationDate) return { status: null, timeLeft: null };
        const today = new Date();
        const expDate = new Date(expirationDate);
        const timeDiff = expDate - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) return { status: "expired", timeLeft: `${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''} ago` };
        if (daysLeft === 0) return { status: "expires-today", timeLeft: "Today" };
        if (daysLeft <= 7) return { status: "expires-soon", timeLeft: `${daysLeft} Day${daysLeft !== 1 ? 's' : ''}` };
        if (daysLeft <= 30) return { status: "expires-near", timeLeft: `${daysLeft} Day${daysLeft !== 1 ? 's' : ''}` };

        // Calculate months and days for more than 30 days
        const monthsLeft = Math.floor(daysLeft / 30);
        const remainingDays = daysLeft % 30;
        return { status: "expires-far", timeLeft: `${monthsLeft} Month${monthsLeft !== 1 ? 's' : ''} and ${remainingDays} Day${remainingDays !== 1 ? 's' : ''}` };
    };

    const getStockStatus = (availableAmount) => {
        if (availableAmount === 0) return "out-of-stock"; // Out of stock
        if (availableAmount < 3) return "low-stock"; // Low stock
        return null; // No stock issue
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!item) {
        return <div>Item not found.</div>;
    }

    const expirationStatus = getExpirationStatus(item.expirationDate);
    const stockStatus = getStockStatus(item.availableAmount);

    return (
        <div className="see-details-container">
            <button
                className="back-button"
                onClick={() => navigate("/")}
            >
                ← Back
            </button>
            <h1>{item.category}</h1>
            <div className="item-header">
                <h2>{item.itemName}</h2> {/* Item name remains black */}
            </div>
            <div className="item-details">
                <div className="item-detail-row">
                    <div className="detail-label">Available Amount</div>
                    <div className={`detail-value ${stockStatus}`}>
                        {item.availableAmount} {item.unit}
                        {stockStatus === "low-stock" && " ⚠️"}
                        {stockStatus === "out-of-stock" && " ❗"}
                    </div>
                </div>
                <div className="item-detail-row">
                    <div className="detail-label">Unit price</div>
                    <div className="detail-value">{item.unitPrice} Rs</div>
                </div>
                <div className="item-detail-row">
                    <div className="detail-label">Expires in</div>
                    <div className={`detail-value ${expirationStatus.status}`}>
                        {expirationStatus.status === "expired" ? `Item expired ${expirationStatus.timeLeft}` :
                         expirationStatus.status === "expires-today" ? "Item expires today" :
                         expirationStatus.status === "expires-soon" ? ` ${expirationStatus.timeLeft}` :
                         expirationStatus.status === "expires-near" ? ` ${expirationStatus.timeLeft}` :
                         expirationStatus.status === "expires-far" ? ` ${expirationStatus.timeLeft}` :
                         "No expiration date"}
                    </div>
                </div>
                <div className="item-detail-row">
                    <div className="detail-label">Note</div>
                    <div className="detail-value">
                        <div className="note-value">{item.notes}</div>
                    </div>
                </div>
            </div>
            <div className="action-buttons">
                <button
                    className="update-button"
                    onClick={() => navigate(`/edit-item/${id}`)}
                >
                    Update
                </button>
                <button
                    className="delete-button"
                    onClick={() => setShowDeleteConfirmation(true)}
                >
                    Delete
                </button>
            </div>

            {showDeleteConfirmation && (
                <div className="confirmation-overlay">
                    <div className="confirmation-dialog">
                        <p>Are you sure you want to permanently remove this item?</p>
                        <div className="confirmation-buttons">
                            <button
                                className="delete-button"
                                onClick={handleDelete}
                            >
                                Yes, Delete
                            </button>
                            <button
                                className="update-button"
                                onClick={() => setShowDeleteConfirmation(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeeDetails;