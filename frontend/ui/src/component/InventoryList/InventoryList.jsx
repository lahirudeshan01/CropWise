import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './InventoryList.css';
import GenerateInventoryReport from "../InventoryReport/GenerateInventoryReport";


const InventoryList = () => {
    const [inventory, setInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/inventory");
                setInventory(response.data);
            } catch (err) {
                console.error("Error fetching inventory:", err);
            }
        };

        fetchInventory();
    }, []);

    // Filter inventory by search term and selected category
    const filteredInventory = inventory.filter((item) => {
        const matchesSearchTerm = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
        return matchesSearchTerm && matchesCategory;
    });

    // Get expiration status
    const getExpirationStatus = (expirationDate) => {
        if (!expirationDate) return null;
        const today = new Date();
        const expDate = new Date(expirationDate);
        const daysLeft = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) return "expired"; // Expired
        if (daysLeft === 0) return "expires-today"; // Expires today
        if (daysLeft <= 7) return "expires-soon"; // Expires within 7 days
        if (daysLeft <= 30) return "expires-near"; // Expires within 30 days
        return null; // No expiration issue
    };

    // Get stock status
    const getStockStatus = (availableAmount) => {
        if (availableAmount === 0) return "out-of-stock"; // Out of stock
        if (availableAmount < 3) return "low-stock"; // Low stock
        return null; // No stock issue
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Stock Management</h1>

            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>

            {/* Generate Report Button */}
            <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/GenerateInventoryReport")}
                >
                    Generate Report
            </button>

            {/* Inventory Table */}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">
                            <div className="flex items-center">
                                
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="category-dropdown"  // Add this class
                            >
                                <option value="All Categories"><b>All Categories</b></option>
                                <option value="Fertilizers">Fertilizers</option>
                                <option value="Pesticides">Pesticides</option>
                                <option value="Seeds">Seeds</option>
                                <option value="Farm Machinery & Tools">Farm Machinery & Tools</option>
                                <option value="Packaging Materials">Packaging Materials</option>
                                <option value="Pest Control & Storage Protection">Pest Control & Storage Protection</option>
                                <option value="Other">Other</option>
                            </select>
                            </div>
                        </th>
                        <th className="p-2 border">Item</th>
                        <th className="p-2 border">Available Amount</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInventory.map((item) => {
                        const expirationStatus = getExpirationStatus(item.expirationDate);
                        const stockStatus = getStockStatus(item.availableAmount);

                        return (
                            <tr key={item._id} className="hover:bg-gray-100">
                                <td className="p-2 border">{item.category}</td>
                                <td className={`p-2 border ${expirationStatus}`}>
                                    {item.itemName}
                                    {expirationStatus === "expires-near" && " ⚠️"}
                                    {expirationStatus === "expires-soon" && " ⚠️"}
                                    {expirationStatus === "expires-today" && " ❗"}
                                    {expirationStatus === "expired" && " ❗"}
                                </td>
                                <td className={`p-2 border ${stockStatus}`}>
                                    {item.availableAmount} {item.unit}
                                    {stockStatus === "low-stock" && " ⚠️"}
                                    {stockStatus === "out-of-stock" && " ❗"}
                                </td>
                                <td className="p-2 border">
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => navigate(`/item/${item._id}`)}
                                    >
                                        See Details
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryList;
