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
    const [showQuickUpdateModal, setShowQuickUpdateModal] = useState(false);
    const [quickUpdateAmount, setQuickUpdateAmount] = useState("");
    const [validationError, setValidationError] = useState("");

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
            navigate("/inventryshow");
        } catch (err) {
            console.error("Error deleting item:", err);
            setError("Failed to delete item. Please try again later.");
        }
    };

    const adjustQuickUpdateAmount = (increment) => {
        let currentValue = parseFloat(quickUpdateAmount) || 0;
        
        if (item.unit === "Units") {
            // For Units, only allow whole numbers
            currentValue = Math.floor(currentValue) + increment;
        } else {
            // For Kg and Liters, allow decimals
            const decimalPart = currentValue % 1;
            currentValue = Math.floor(currentValue) + increment + decimalPart;
        }
        
        if (currentValue < 0) currentValue = 0;
        
        const newValue = item.unit === "Units" 
            ? currentValue.toString() 
            : (currentValue % 1 === 0 ? currentValue.toString() : currentValue.toFixed(3).replace(/\.?0+$/, ''));
        
        setQuickUpdateAmount(newValue);
        setValidationError("");
    };

    const handleQuickUpdate = async () => {
        if (!quickUpdateAmount || isNaN(quickUpdateAmount)) {
            setValidationError("Please enter a valid amount.");
            return;
        }

        if (parseFloat(quickUpdateAmount) <= 0) {
            setValidationError("Available amount must be greater than 0.");
            return;
        }

        if (item.unit === "Units" && !Number.isInteger(parseFloat(quickUpdateAmount))) {
            setValidationError("Units cannot be a decimal number.");
            return;
        }

        if (["Kg", "Liters"].includes(item.unit) && quickUpdateAmount.split('.')[1]?.length > 3) {
            setValidationError("Maximum 3 decimal places allowed for Kg and Liters.");
            return;
        }

        try {
            const updatedItem = { 
                ...item, 
                availableAmount: parseFloat(quickUpdateAmount),
                unit: item.unit
            };

            if (item.category !== "Farm Machinery & Tools" && item.category !== "Packaging Materials") {
                updatedItem.expirationDate = item.expirationDate;
            }

            await axios.put(`http://localhost:3000/api/inventory/${id}`, updatedItem);
            setItem(updatedItem);
            setShowQuickUpdateModal(false);
            setQuickUpdateAmount("");
            setValidationError("");
        } catch (err) {
            console.error("Error updating item:", err);
            setError("Failed to update item. Please try again later.");
        }
    };

    const handleQuickUpdateInputChange = (e) => {
        const value = e.target.value;
        
        if (item.unit === "Units") {
            // Only allow whole numbers for Units
            if (value === '' || /^\d*$/.test(value)) {
                setQuickUpdateAmount(value);
                setValidationError("");
            }
        } else {
            // Allow up to 3 decimal places for Kg and Liters
            if (value === '' || /^\d*\.?\d{0,3}$/.test(value)) {
                setQuickUpdateAmount(value);
                setValidationError("");
            }
        }

        // Show error immediately if value is 0
        if (parseFloat(value) === 0) {
            setValidationError("Available amount must be greater than 0.");
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

        const monthsLeft = Math.floor(daysLeft / 30);
        const remainingDays = daysLeft % 30;
        return { status: "expires-far", timeLeft: `${monthsLeft} Month${monthsLeft !== 1 ? 's' : ''} and ${remainingDays} Day${remainingDays !== 1 ? 's' : ''}` };
    };

    const getStockStatus = (availableAmount) => {
        if (availableAmount === 0) return "out-of-stock";
        if (availableAmount < 3) return "low-stock";
        return null;
    };

    const formatCurrency = (value) => {
        const num = parseFloat(value || 0);
        return `Rs. ${num.toFixed(2)}`;
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
    const showExpirationDate = !["Farm Machinery & Tools", "Packaging Materials"].includes(item.category);

    return (
        <div className="see-details-container">
            <button className="back-button" onClick={() => navigate("/inventryshow")}>
                ← Back
            </button>
            <h1>{item.category}</h1>
            <div className="item-header">
                <h2>{item.itemName}</h2>
            </div>
            <div className="item-details">
                <div className="item-detail-row">
                    <div className="detail-label">Available Amount</div>
                    <div className={`detail-value ${stockStatus}`}>
                        {item.availableAmount} {item.unit}
                        {stockStatus === "low-stock" && " ⚠️"}
                        {stockStatus === "out-of-stock" && " ❗"}
                        <button
                            className="quick-update-button"
                            onClick={() => {
                                setQuickUpdateAmount(item.availableAmount.toString());
                                setShowQuickUpdateModal(true);
                                setValidationError("");
                            }}
                        >
                            ✏️
                        </button>
                    </div>
                </div>
                <div className="item-detail-row">
                    <div className="detail-label">Unit price</div>
                    <div className="detail-value">{formatCurrency(item.unitPrice)}</div>
                </div>
                {showExpirationDate && (
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
                )}
                <div className="item-detail-row">
                    <div className="detail-label">Note</div>
                    <div className="detail-value">
                        <div className="note-value">{item.notes}</div>
                    </div>
                </div>
            </div>
            <div className="action-buttons">
                <button className="update-button" onClick={() => navigate(`/edit-item/${id}`)}>
                    Update
                </button>
                <button className="delete-button" onClick={() => setShowDeleteConfirmation(true)}>
                    Delete
                </button>
            </div>

            {showDeleteConfirmation && (
                <div className="confirmation-overlay">
                    <div className="confirmation-dialog">
                        <p>Are you sure you want to permanently remove this item?</p>
                        <div className="confirmation-buttons">
                            <button className="delete-button" onClick={handleDelete}>
                                Yes, Delete
                            </button>
                            <button className="update-button" onClick={() => setShowDeleteConfirmation(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showQuickUpdateModal && (
                <div className="confirmation-overlay">
                    <div className="confirmation-dialog">
                        <p>Quick Update Available Amount</p>
                        <div className="quick-update-controls">
                            <button 
                                className="amount-adjust-button"
                                onClick={() => adjustQuickUpdateAmount(-1)}
                                disabled={!quickUpdateAmount || parseFloat(quickUpdateAmount) <= 0}
                            >
                                -
                            </button>
                            <input
                                type="text"
                                value={quickUpdateAmount}
                                onChange={handleQuickUpdateInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        adjustQuickUpdateAmount(1);
                                    } else if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        adjustQuickUpdateAmount(-1);
                                    }
                                }}
                                className={`amount-input ${validationError ? "input-error" : ""}`}
                                placeholder="0"
                            />
                            <button 
                                className="amount-adjust-button"
                                onClick={() => adjustQuickUpdateAmount(1)}
                            >
                                +
                            </button>
                        </div>
                        {validationError && (
                            <div style={{ color: "#ef4444", fontWeight: "600", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                                {validationError}
                            </div>
                        )}
                        <div className="confirmation-buttons">
                            <button 
                                className="update-button" 
                                onClick={handleQuickUpdate}
                                disabled={validationError || !quickUpdateAmount}
                            >
                                Update
                            </button>
                            <button className="delete-button" onClick={() => setShowQuickUpdateModal(false)}>
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