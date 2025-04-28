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
        itemName: "",
        availableAmount: "",
        unit: "Kg",
        expirationDate: "",
        unitPrice: "",
        notes: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    // Define forbidden symbols
    const forbiddenSymbols = ['@', '#', '$', '*', '=', '+', '~', '^', '`', '|', '{', '}', '[', ']', '<', '>', '"', "'", ':', ';', '**','!','-','?', '.', '_'];

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
        const { name, value } = e.target;
        
        // Add validation for itemName field
        if (name === 'itemName') {
            // Check if the first character is a symbol (not letter or number)
            if (value.length === 1 && !/^[a-zA-Z0-9]/.test(value)) {
                // If it's a symbol as first character, don't update the state
                return;
            }
            
            // Check if any of the entered characters are in the forbidden symbols list
            const lastEnteredChar = value.slice(-1);
            if (forbiddenSymbols.includes(lastEnteredChar)) {
                // If it's a forbidden symbol, don't update the state
                return;
            }
        }
        
        if (name === 'category') {
            let defaultUnit = "Kg";
            if (value === "Farm Machinery & Tools") defaultUnit = "Units";
            
            // Convert availableAmount to integer if switching to Units
            let newAmount = formData.availableAmount;
            if (defaultUnit === "Units" && newAmount && newAmount.toString().includes('.')) {
                newAmount = Math.floor(parseFloat(newAmount)).toString();
            }
            
            setFormData(prev => ({ 
                ...prev, 
                category: value, 
                unit: defaultUnit,
                availableAmount: newAmount
            }));
        } else if (name === 'unit') {
            // Convert availableAmount to integer if switching to Units
            let newAmount = formData.availableAmount;
            if (value === "Units" && newAmount && newAmount.toString().includes('.')) {
                newAmount = Math.floor(parseFloat(newAmount)).toString();
            }
            
            setFormData(prev => ({ 
                ...prev, 
                unit: value,
                availableAmount: newAmount
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (formData.unit === "Units") {
            if (value === '' || /^\d*$/.test(value)) {
                setFormData(prev => ({ ...prev, availableAmount: value }));
            }
        } else {
            if (value === '' || /^\d*\.?\d{0,3}$/.test(value)) {
                setFormData(prev => ({ ...prev, availableAmount: value }));
            }
        }
    };

    const handleUnitPriceChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            setFormData(prev => ({ ...prev, unitPrice: value }));
        }
    };

    const handleUnitPriceBlur = () => {
        if (formData.unitPrice) {
            const num = parseFloat(formData.unitPrice);
            if (!isNaN(num)) {
                setFormData(prev => ({ ...prev, unitPrice: num.toFixed(2) }));
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
        
        setFormData(prev => ({ ...prev, availableAmount: newValue }));
    };

    const adjustUnitPrice = (increment) => {
        let currentValue = parseFloat(formData.unitPrice) || 0;
        currentValue += increment;
        
        if (currentValue < 0) currentValue = 0;
        
        setFormData(prev => ({ ...prev, unitPrice: currentValue.toFixed(2) }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.itemName.trim()) {
            newErrors.itemName = "Item Name is required.";
            isValid = false;
        } else if (!/^[a-zA-Z0-9]/.test(formData.itemName)) {
            newErrors.itemName = "Item Name must start with a letter or number.";
            isValid = false;
        }

        if (!formData.availableAmount || isNaN(formData.availableAmount) || parseFloat(formData.availableAmount) <= 0) {
            newErrors.availableAmount = "Available Amount must be a positive number.";
            isValid = false;
        }

        if (formData.unit === "Units" && formData.availableAmount.toString().includes('.')) {
            newErrors.availableAmount = "Available Amount must be a whole number when Units is selected.";
            isValid = false;
        }

        if (!["Farm Machinery & Tools", "Packaging Materials", "Other"].includes(formData.category) && 
            (!formData.expirationDate || new Date(formData.expirationDate) <= new Date())) {
            newErrors.expirationDate = "Expiration Date must be a future date.";
            isValid = false;
        }

        if (!formData.unitPrice || isNaN(formData.unitPrice) || parseFloat(formData.unitPrice) <= 0) {
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

        const updatedItem = {
            category: formData.category,
            itemName: formData.itemName,
            availableAmount: parseFloat(formData.availableAmount),
            unit: formData.unit,
            expirationDate: ["Farm Machinery & Tools", "Packaging Materials", "Other"].includes(formData.category) ? null : formData.expirationDate,
            unitPrice: parseFloat(formData.unitPrice),
            notes: formData.notes
        };

        try {
            await axios.put(`http://localhost:3000/api/inventory/${id}`, updatedItem);
            navigate("/inventryshow");
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

    const availableUnits = getAvailableUnits();

    const showExpirationDate = !["Farm Machinery & Tools", "Packaging Materials", "Other"].includes(formData.category);

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
                <input 
                    name="itemName" 
                    value={formData.itemName} 
                    onChange={handleChange} 
                    className="update-input"
                    placeholder="Enter item name (must start with letter or number)"
                />
                {errors.itemName && <p className="update-error-message">{errors.itemName}</p>}

                <label className="update-label">Available Amount</label>
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
                        className="update-input unit-price-input"
                        placeholder="0"
                    />
                    <button 
                        type="button" 
                        className="unit-price-button" 
                        onClick={() => adjustAmount(1)}
                    >
                        +
                    </button>
                    <select name="unit" value={formData.unit} onChange={handleChange} className="update-select" disabled={availableUnits.length === 1}>
                        {availableUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>
                {errors.availableAmount && <p className="update-error-message">{errors.availableAmount}</p>}

                {showExpirationDate && (
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
                        {errors.expirationDate && (
                            <p className="update-error-message">{errors.expirationDate}</p>
                        )}
                    </>
                )}

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

                <label className="update-label">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} className="update-textarea" />

                <button type="submit" className="update-submit-button">Update Item</button>
                <button type="button" onClick={() => navigate("/inventryshow")} className="update-cancel-button">Cancel</button>
            </form>
            {errors.submitError && <p className="update-error-message">{errors.submitError}</p>}
        </div>
    );
};

export default UpdateInventoryItem;