import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { format } from 'date-fns';
import "./UpdateInventoryItem.css";

const UpdateInventoryItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category: "Fertilizers",
        customCategory: "",
        itemName: "",
        availableAmount: "",
        unit: "Kg",
        expirationDate: "",
        unitPrice: "",
        notes: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    const getCurrentDate = () => {
        return format(new Date(), 'yyyy-MM-dd');
    };

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/inventory/${id}`);
                const item = response.data;
                setFormData({
                    category: item.category,
                    customCategory: item.category === "Other" ? item.customCategory : "",
                    itemName: item.itemName,
                    availableAmount: item.availableAmount,
                    unit: item.unit,
                    expirationDate: item.expirationDate ? format(new Date(item.expirationDate), 'yyyy-MM-dd') : "",
                    unitPrice: item.unitPrice ? parseFloat(item.unitPrice).toFixed(2) : "",
                    notes: item.notes
                });
                setLoading(false);
            } catch (err) {
                console.error("Error fetching item details:", err);
                setErrors({ fetchError: "Failed to fetch item details. Please try again later." });
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUnitPriceChange = (e) => {
        const value = e.target.value;
        // Allow only numbers and decimal points
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setFormData({ ...formData, unitPrice: value });
        }
    };

    const handleUnitPriceBlur = () => {
        // Format the value to 2 decimal places when field loses focus
        if (formData.unitPrice) {
            const num = parseFloat(formData.unitPrice);
            if (!isNaN(num)) {
                setFormData({ ...formData, unitPrice: num.toFixed(2) });
            }
        }
    };

    const adjustUnitPrice = (increment) => {
        let currentValue = parseFloat(formData.unitPrice) || 0;
        currentValue += increment;
        
        // Prevent going below 0
        if (currentValue < 0) {
            currentValue = 0;
        }
        
        setFormData({ ...formData, unitPrice: currentValue.toFixed(2) });
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.itemName.trim()) {
            newErrors.itemName = "Item Name is required.";
            isValid = false;
        }

        if (!formData.availableAmount || isNaN(formData.availableAmount) || parseFloat(formData.availableAmount) <= 0) {
            newErrors.availableAmount = "Available Amount must be a positive number.";
            isValid = false;
        }

        if (!["Farm Machinery & Tools", "Packaging Materials"].includes(formData.category) && (!formData.expirationDate || new Date(formData.expirationDate) <= new Date())) {
            newErrors.expirationDate = "Expiration Date must be a future date.";
            isValid = false;
        }

        if (["Fertilizers", "Pesticides", "Seeds"].includes(formData.category) && (!formData.unitPrice || isNaN(formData.unitPrice) || parseFloat(formData.unitPrice) <= 0)) {
            newErrors.unitPrice = "Unit Price must be a positive number.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const finalCategory = formData.category === "Other" ? (formData.customCategory || "Other") : formData.category;

        const updatedItem = {
            category: finalCategory,
            itemName: formData.itemName,
            availableAmount: parseFloat(formData.availableAmount),
            unit: formData.unit,
            expirationDate: ["Farm Machinery & Tools", "Packaging Materials"].includes(formData.category) ? null : formData.expirationDate,
            unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : 0,
            notes: formData.notes
        };

        try {
            await axios.put(`http://localhost:3000/api/inventory/${id}`, updatedItem);
            navigate("/");
        } catch (err) {
            console.error("Error updating item:", err);
            setErrors({ submitError: "Failed to update item. Please try again later." });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (errors.fetchError) {
        return <div className="update-error-message">{errors.fetchError}</div>;
    }

    return (
        <div className="update-inventory-item-container">
            <h1 className="update-title">Update Item</h1>
            <form onSubmit={handleSubmit} className="update-form">
                <label className="update-label">Item Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="update-select">
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Pesticides">Pesticides</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Farm Machinery & Tools">Farm Machinery & Tools</option>
                    <option value="Packaging Materials">Packaging Materials</option>
                    <option value="Pest Control & Storage Protection">Pest Control & Storage Protection</option>
                    <option value="Other">Other</option>
                </select>

                <label className="update-label">Item Name</label>
                <input name="itemName" value={formData.itemName} onChange={handleChange} className="update-input" />
                {errors.itemName && <p className="update-error-message">{errors.itemName}</p>}

                <label className="update-label">Available Amount</label>
                <input type="number" name="availableAmount" value={formData.availableAmount} onChange={handleChange} className="update-input" />
                <select name="unit" value={formData.unit} onChange={handleChange} className="update-select">
                    <option value="Kg">Kg</option>
                    <option value="Liters">Liters</option>
                    <option value="Units">Units</option>
                </select>
                {errors.availableAmount && <p className="update-error-message">{errors.availableAmount}</p>}

                {!["Farm Machinery & Tools", "Packaging Materials"].includes(formData.category) && (
                    <>
                        <label className="update-label">Expiration Date</label>
                        <input 
                            type="date" 
                            name="expirationDate" 
                            value={formData.expirationDate} 
                            onChange={handleChange} 
                            className="update-input"
                            min={getCurrentDate()}
                        />
                        {errors.expirationDate && <p className="update-error-message">{errors.expirationDate}</p>}
                    </>
                )}

                {!["Farm Machinery & Tools", "Packaging Materials"].includes(formData.category) && (
                    <>
                        <label className="update-label">Unit Price (RS.)</label>
                        <div className="unit-price-container">
                            <button 
                                type="button" 
                                className="unit-price-button" 
                                onClick={() => adjustUnitPrice(-1)}
                                disabled={!formData.unitPrice || parseFloat(formData.unitPrice) <= 0}
                            >
                                -
                            </button>
                            <input 
                                type="text" 
                                name="unitPrice" 
                                value={formData.unitPrice} 
                                onChange={handleUnitPriceChange}
                                onBlur={handleUnitPriceBlur}
                                className="update-input unit-price-input"
                                placeholder="0.00"
                            />
                            <button 
                                type="button" 
                                className="unit-price-button" 
                                onClick={() => adjustUnitPrice(1)}
                            >
                                +
                            </button>
                        </div>
                        {errors.unitPrice && <p className="update-error-message">{errors.unitPrice}</p>}
                    </>
                )}

                <label className="update-label">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} className="update-textarea" />

                <button type="submit" className="update-submit-button">Update Item</button>
                <button type="button" onClick={() => navigate("/")} className="update-cancel-button">Cancel</button>
            </form>
            {errors.submitError && <p className="update-error-message">{errors.submitError}</p>}
        </div>
    );
};

export default UpdateInventoryItem;