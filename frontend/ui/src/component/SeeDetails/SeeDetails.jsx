import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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

    // Styles object containing all component styles
    const styles = {
        detailsContainer: {
            maxWidth: "650px",
            margin: "2rem auto",
            padding: "1.5rem 2rem",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
        },
        categoryHeading: {
            fontSize: "1.2rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
        },
        itemHeader: {
            padding: "0.5rem 0 1rem 0",
            marginBottom: "1.5rem",
            borderBottom: "2px solid #f3f4f6"
        },
        itemTitle: {
            fontSize: "1.75rem",
            fontWeight: 700,
            margin: 0,
            color: "#1f2937"
        },
        itemDetails: {
            marginBottom: "1.5rem"
        },
        detailRow: {
            display: "flex",
            padding: "0.75rem 0",
            borderBottom: "1px solid #f3f4f6",
            alignItems: "flex-start"
        },
        detailLabel: {
            fontWeight: 600,
            width: "180px",
            flexShrink: 0,
            color: "#4b5563",
            fontSize: "0.95rem",
            paddingTop: "0.15rem"
        },
        detailValue: {
            flexGrow: 1,
            fontSize: "1rem",
            color: "#1f2937"
        },
        noteContent: {
            backgroundColor: "#f9fafb",
            borderRadius: "6px",
            padding: "0.75rem 1rem",
            marginTop: 0,
            border: "1px solid #e5e7eb",
            lineHeight: 1.5,
            minHeight: "60px"
        },
        actionButtons: {
            display: "flex",
            gap: "12px",
            marginTop: "2rem",
            justifyContent: "flex-end"
        },
        updateButton: {
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "0.6rem 1.5rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.9rem",
            transition: "all 0.2s",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
        },
        deleteButton: {
            backgroundColor: "#ef4444",
            color: "white",
            padding: "0.6rem 1.5rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.9rem",
            transition: "all 0.2s",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
        },
        confirmOverlay: {
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            backdropFilter: "blur(3px)"
        },
        confirmDialog: {
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "1.5rem",
            width: "430px", // Changed from maxWidth to fixed width
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
            margin: "0 1rem" // Add some margin on small screens
        },
        confirmText: {
            marginBottom: "1.5rem",
            fontSize: "1rem",
            color: "#1f2937"
        },
        confirmButtons: {
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginTop: "1.5rem"
        },
        expired: {
            color: "#ef4444",
            fontWeight: 600
        },
        expirestoday: {
            color: "#ef4444",
            fontWeight: 600
        },
        expiressoon: {
            color: "#f97316",
            fontWeight: 600
        },
        expiresnear: {
            color: "#f59e0b",
            fontWeight: 600
        },
        outOfStock: {
            color: "#ef4444",
            fontWeight: 600
        },
        lowStock: {
            color: "#f97316",
            fontWeight: 600
        },
        backButton: {
            backgroundColor: "#87f59b",
            color: "#63514b",
            padding: "0.25rem 0.5rem", // Reduced from 0.5rem 1rem (now much narrower)
            borderRadius: "6px",
            border: "1px solidrgb(31, 206, 95)",
            cursor: "pointer",
            fontWeight: 500,
            marginBottom: "1rem",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center", // Center content horizontally
            transition: "all 0.2s",
            fontSize: "0.8rem", // Slightly smaller font
            height: "28px", // Reduced height
            minWidth: "auto", // Don't force minimum width
            width: "auto", // Let content determine width
          },
        quickUpdateButton: {
            backgroundColor: "#bed5fa",
            color: "white",
            border: "none",
            borderRadius: "4px", // Changed from 50% to make it square
            width: "30px", // Reduced from 24px
            height: "30px", // Reduced from 24px
            cursor: "pointer",
            marginLeft: "8px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px", // Reduced from 12px
            padding: "0", // Ensure no extra padding
            minWidth: "auto", // Don't force minimum width
            lineHeight: "1", // Better vertical alignment
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)", // Optional: subtle shadow
            transition: "all 0.2s ease" // Smooth hover effect
        },
        textError: {
            color: "#ef4444",
            fontWeight: 500
        },
        inputError: {
            borderColor: "#ef4444",
            boxShadow: "0 0 0 1px #ef4444"
        },
        validationError: {
            color: "#ef4444",
            fontSize: "0.875rem",
            marginTop: "0.5rem",
            textAlign: "center",
            fontWeight: 600
        },
        quantityControls: {
            display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        margin: "1rem auto",
        width: "100%",
        maxWidth: "280px" // Reduced from 320px
        },
        quantityInput: {
            width: "100px",
            padding: "8px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            textAlign: "center",
            fontSize: "1rem",
            margin: 0,
            flex: 1
        },
        quantityButton: {
            width: "30px !important",
            height: "30px !important",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#4ade80 !important", // Changed to light green
            border: "1px solid #d1d5db !important",
            borderRadius: "6px !important",
            cursor: "pointer !important",
            fontSize: "1rem !important",
            fontWeight: "bold !important",
            transition: "background-color 0.2s !important",
            flexShrink: 0,
            padding: "0 !important",
            margin: "0 !important",
            color: "white !important" // Ensure text color is white for contrast
        },
        quantityButtonDisabled: {
            opacity: "0.5 !important",
            cursor: "not-allowed !important",
            backgroundColor: "#86efac !important" // Lighter green for disabled state
        },
        mobileStyles: {
            detailsContainer: {
                padding: "1rem",
                margin: "1rem",
                maxWidth: "calc(100% - 2rem)"
            },
            detailRow: {
                flexDirection: "column",
                paddingBottom: "1rem"
            },
            detailLabel: {
                width: "100%",
                marginBottom: "0.25rem"
            },
            detailValue: {
                width: "100%"
            }
        }
    };

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
        if (daysLeft === 0) return { status: "expirestoday", timeLeft: "Today" };
        if (daysLeft <= 7) return { status: "expiressoon", timeLeft: `${daysLeft} Day${daysLeft !== 1 ? 's' : ''}` };
        if (daysLeft <= 30) return { status: "expiresnear", timeLeft: `${daysLeft} Day${daysLeft !== 1 ? 's' : ''}` };

        const monthsLeft = Math.floor(daysLeft / 30);
        const remainingDays = daysLeft % 30;
        return { status: "expiresfar", timeLeft: `${monthsLeft} Month${monthsLeft !== 1 ? 's' : ''} and ${remainingDays} Day${remainingDays !== 1 ? 's' : ''}` };
    };

    const getStockStatus = (availableAmount) => {
        if (availableAmount === 0) return "outOfStock";
        if (availableAmount < 3) return "lowStock";
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
        return <div style={styles.textError}>{error}</div>;
    }

    if (!item) {
        return <div>Item not found.</div>;
    }

    const expirationStatus = getExpirationStatus(item.expirationDate);
    const stockStatus = getStockStatus(item.availableAmount);
    const showExpirationDate = !["Farm Machinery & Tools", "Packaging Materials"].includes(item.category);

    // Check if mobile view based on window width
    const isMobile = window.innerWidth <= 640;
    
    // Apply mobile styles conditionally
    const containerStyle = isMobile 
        ? {...styles.detailsContainer, ...styles.mobileStyles.detailsContainer} 
        : styles.detailsContainer;
    
    const detailRowStyle = isMobile 
        ? {...styles.detailRow, ...styles.mobileStyles.detailRow} 
        : styles.detailRow;
    
    const detailLabelStyle = isMobile 
        ? {...styles.detailLabel, ...styles.mobileStyles.detailLabel} 
        : styles.detailLabel;
    
    const detailValueStyle = isMobile 
        ? {...styles.detailValue, ...styles.mobileStyles.detailValue} 
        : styles.detailValue;

    return (
        <div style={containerStyle}>
            <button style={styles.backButton} onClick={() => navigate("/inventryshow")}>
                ←
            </button>
            <h1 style={styles.categoryHeading}>{item.category}</h1>
            <div style={styles.itemHeader}>
                <h2 style={styles.itemTitle}>{item.itemName}</h2>
            </div>
            <div style={styles.itemDetails}>
                <div style={detailRowStyle}>
                    <div style={detailLabelStyle}>Available Amount</div>
                    <div style={{...detailValueStyle, ...(stockStatus ? styles[stockStatus] : {})}}>
                        {item.availableAmount} {item.unit}
                        {stockStatus === "lowStock" && " ⚠️"}
                        {stockStatus === "outOfStock" && " ❗"}
                        <button
                            style={styles.quickUpdateButton}
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
                <div style={detailRowStyle}>
                    <div style={detailLabelStyle}>Unit price</div>
                    <div style={detailValueStyle}>{formatCurrency(item.unitPrice)}</div>
                </div>
                {showExpirationDate && (
                    <div style={detailRowStyle}>
                        <div style={detailLabelStyle}>Expires in</div>
                        <div style={{...detailValueStyle, ...(expirationStatus.status ? styles[expirationStatus.status] : {})}}>
                            {expirationStatus.status === "expired" ? `Item expired ${expirationStatus.timeLeft}` :
                            expirationStatus.status === "expirestoday" ? "Item expires today" :
                            expirationStatus.status === "expiressoon" ? ` ${expirationStatus.timeLeft}` :
                            expirationStatus.status === "expiresnear" ? ` ${expirationStatus.timeLeft}` :
                            expirationStatus.status === "expiresfar" ? ` ${expirationStatus.timeLeft}` :
                            "No expiration date"}
                        </div>
                    </div>
                )}
                <div style={detailRowStyle}>
                    <div style={detailLabelStyle}>Note</div>
                    <div style={detailValueStyle}>
                        <div style={styles.noteContent}>{item.notes}</div>
                    </div>
                </div>
            </div>
            <div style={styles.actionButtons}>
                <button style={styles.updateButton} onClick={() => navigate(`/edit-item/${id}`)}>
                    Update
                </button>
                <button style={styles.deleteButton} onClick={() => setShowDeleteConfirmation(true)}>
                    Delete
                </button>
            </div>

            {showDeleteConfirmation && (
                <div style={styles.confirmOverlay}>
                    <div style={styles.confirmDialog}>
                        <p style={styles.confirmText}>Are you sure you want to permanently remove this item?</p>
                        <div style={styles.confirmButtons}>
                            <button style={styles.deleteButton} onClick={handleDelete}>
                                Yes, Delete
                            </button>
                            <button style={styles.updateButton} onClick={() => setShowDeleteConfirmation(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showQuickUpdateModal && (
                <div style={styles.confirmOverlay}>
                    <div style={styles.confirmDialog}>
                        <p style={styles.confirmText}>Quick Update Available Amount</p>
                        <div style={styles.quantityControls}>
                            <button 
                                style={{
                                    ...styles.quantityButton,
                                    ...(!quickUpdateAmount || parseFloat(quickUpdateAmount) <= 0 ? styles.quantityButtonDisabled : {})
                                }}
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
                                style={{
                                    ...styles.quantityInput,
                                    ...(validationError ? styles.inputError : {})
                                }}
                                placeholder="0"
                            />
                            <button 
                                style={styles.quantityButton}
                                onClick={() => adjustQuickUpdateAmount(1)}
                            >
                                +
                            </button>
                        </div>
                        {validationError && (
                            <div style={styles.validationError}>
                                {validationError}
                            </div>
                        )}
                        <div style={styles.confirmButtons}>
                            <button 
                                style={{
                                    ...styles.updateButton,
                                    ...(validationError || !quickUpdateAmount ? {opacity: 0.5, cursor: "not-allowed"} : {})
                                }}
                                onClick={handleQuickUpdate}
                                disabled={validationError || !quickUpdateAmount}
                            >
                                Update
                            </button>
                            <button style={styles.deleteButton} onClick={() => setShowQuickUpdateModal(false)}>
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