import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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
                    expirationDate: item.expirationDate ? new Date(item.expirationDate).toISOString().split('T')[0] : "",
                    unitPrice: item.unitPrice,
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
                        <input type="date" name="expirationDate" value={formData.expirationDate} onChange={handleChange} className="update-input" />
                        {errors.expirationDate && <p className="update-error-message">{errors.expirationDate}</p>}
                    </>
                )}

                {!["Farm Machinery & Tools", "Packaging Materials"].includes(formData.category) && (
                    <>
                        <label className="update-label">Unit Price (RS.)</label>
                        <input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleChange} className="update-input" />
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