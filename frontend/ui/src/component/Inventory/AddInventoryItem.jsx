import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import "./AddInventoryItem.css";

const AddInventoryItem = () => {
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

    const getCurrentDate = () => {
        return format(new Date(), 'yyyy-MM-dd');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category') {
            let defaultUnit = "Kg";
            if (value === "Farm Machinery & Tools") defaultUnit = "Units";
            setFormData({ 
                ...formData, 
                category: value, 
                unit: defaultUnit,
                availableAmount: ["Farm Machinery & Tools", "Packaging Materials", "Pest Control & Storage Protection", "Other"].includes(value) && defaultUnit === "Units"
                    ? (formData.availableAmount.includes('.')) ? Math.floor(parseFloat(formData.availableAmount)).toString() || "" : formData.availableAmount
                    : formData.availableAmount
            });
        } else if (name === 'unit') {
            setFormData({ 
                ...formData, 
                unit: value,
                availableAmount: value === "Units" 
                    ? (formData.availableAmount.includes('.')) ? Math.floor(parseFloat(formData.availableAmount)).toString() || "" : formData.availableAmount
                    : formData.availableAmount
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (formData.unit === "Units") {
            if (value === '' || /^\d*$/.test(value)) {
                setFormData({ ...formData, availableAmount: value });
            }
        } else {
            if (value === '' || /^\d*\.?\d{0,3}$/.test(value)) {
                setFormData({ ...formData, availableAmount: value });
            }
        }
    };

    const handleUnitPriceChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            setFormData({ ...formData, unitPrice: value });
        }
    };

    const handleUnitPriceBlur = () => {
        if (formData.unitPrice) {
            const num = parseFloat(formData.unitPrice);
            if (!isNaN(num)) {
                setFormData({ ...formData, unitPrice: num.toFixed(2) });
            }
        }
    };

    const adjustAmount = (increment) => {
        let currentValue = parseFloat(formData.availableAmount) || 0;
        if (formData.unit === "Units") {
            currentValue = Math.floor(currentValue) + increment;
        } else {
            const decimalPart = currentValue % 1;
            currentValue = Math.floor(currentValue) + increment + decimalPart;
        }
        
        if (currentValue < 0) currentValue = 0;
        
        const newValue = formData.unit === "Units" 
            ? currentValue.toString() 
            : (currentValue % 1 === 0 ? currentValue.toString() : currentValue.toFixed(3).replace(/\.?0+$/, ''));
        
        setFormData({ ...formData, availableAmount: newValue });
    };

    const adjustUnitPrice = (increment) => {
        let currentValue = parseFloat(formData.unitPrice) || 0;
        currentValue += increment;
        
        if (currentValue < 0) currentValue = 0;
        
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

        if (formData.unit === "Units" && formData.availableAmount.includes('.')) {
            newErrors.availableAmount = "Available Amount must be a whole number when Units is selected.";
            isValid = false;
        }

        // Only validate expiration date if category is not "Farm Machinery & Tools", "Packaging Materials", or "Other"
        if (!["Farm Machinery & Tools", "Packaging Materials", "Other"].includes(formData.category) && 
            (!formData.expirationDate || new Date(formData.expirationDate) <= new Date())) {
            newErrors.expirationDate = "Expiration Date must be a future date.";
            isValid = false;
        }

        // Only validate unit price if category is "Fertilizers", "Pesticides", or "Seeds"
        if (["Fertilizers", "Pesticides", "Seeds"].includes(formData.category) && 
            (!formData.unitPrice || isNaN(formData.unitPrice) || parseFloat(formData.unitPrice) <= 0)) {
            newErrors.unitPrice = "Unit Price must be a positive number.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const getAvailableUnits = () => {
        switch(formData.category) {
            case "Fertilizers":
            case "Pesticides":
                return ["Kg", "Liters"];
            case "Seeds":
                return ["Kg"];
            case "Packaging Materials":
                return ["Kg", "Units"];
            case "Farm Machinery & Tools":
                return ["Units"];
            case "Pest Control & Storage Protection":
            case "Other":
                return ["Kg", "Liters", "Units"];
            default:
                return ["Kg", "Liters", "Units"];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const finalCategory = formData.category === "Other" ? (formData.customCategory || "Other") : formData.category;

        const newItem = {
            category: finalCategory,
            itemName: formData.itemName,
            availableAmount: parseFloat(formData.availableAmount),
            unit: formData.unit,
            expirationDate: ["Farm Machinery & Tools", "Packaging Materials", "Other"].includes(formData.category) ? null : formData.expirationDate,
            unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : 0,
            notes: formData.notes
        };

        try {
            await axios.post("http://localhost:3000/api/inventory", newItem);
            navigate("/inventryshow");
        } catch (err) {
            console.error("Error adding item:", err);
        }
    };

    const availableUnits = getAvailableUnits();

    // Determine if we should show expiration date and unit price fields
    const showExpirationDate = !["Farm Machinery & Tools", "Packaging Materials"].includes(formData.category);
    const showUnitPrice = !["Farm Machinery & Tools", "Packaging Materials"].includes(formData.category);

    return (
        <div className="add-inventory-item-container p-4">
            <h1 className="text-2xl font-bold mb-4">Add New Item</h1>
            <form onSubmit={handleSubmit}>
                <label>Item Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Pesticides">Pesticides</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Farm Machinery & Tools">Farm Machinery & Tools</option>
                    <option value="Packaging Materials">Packaging Materials</option>
                    <option value="Pest Control & Storage Protection">Pest Control & Storage Protection</option>
                    <option value="Other">Other</option>
                </select>
               
                <label>Item Name</label>
                <input name="itemName" value={formData.itemName} onChange={handleChange} />
                {errors.itemName && <p className="error-message">{errors.itemName}</p>}

                <label>Available Amount</label>
                <div className="unit-price-container">
                    <button 
                        type="button" 
                        className="unit-price-button" 
                        onClick={() => adjustAmount(-1)}
                        disabled={!formData.availableAmount || parseFloat(formData.availableAmount) <= 0}
                    >
                        -
                    </button>
                    <input 
                        type="text" 
                        name="availableAmount" 
                        value={formData.availableAmount} 
                        onChange={handleAmountChange}
                        className="unit-price-input"
                        placeholder="0"
                    />
                    <button 
                        type="button" 
                        className="unit-price-button" 
                        onClick={() => adjustAmount(1)}
                    >
                        +
                    </button>
                    <select name="unit" value={formData.unit} onChange={handleChange} disabled={availableUnits.length === 1}>
                        {availableUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>
                {errors.availableAmount && <p className="error-message">{errors.availableAmount}</p>}

                {showExpirationDate && (
                    <>
                        <label>Expiration Date</label>
                        <input 
                            type="date" 
                            name="expirationDate" 
                            value={formData.expirationDate} 
                            onChange={handleChange} 
                            min={getCurrentDate()}
                        />
                        {formData.category !== "Other" && errors.expirationDate && (
                            <p className="error-message">{errors.expirationDate}</p>
                        )}
                    </>
                )}

                {showUnitPrice && (
                    <>
                        <label>Unit Price (RS.)</label>
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
                                className="unit-price-input"
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
                        {["Fertilizers", "Pesticides", "Seeds"].includes(formData.category) && errors.unitPrice && (
                            <p className="error-message">{errors.unitPrice}</p>
                        )}
                    </>
                )}

                <label>Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} />

                <button type="submit" onClick={() => navigate("/inventryshow")} className="submit-button">Add Item</button>
                <button type="button" onClick={() => navigate("/inventryshow")} className="cancel-button">Cancel</button>
            </form>
        </div>
    );
};

export default AddInventoryItem;