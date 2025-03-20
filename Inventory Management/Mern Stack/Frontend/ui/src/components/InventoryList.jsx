import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './InventoryList.css';

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

            {/* Add Item Button */}
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={() => navigate("/add-item")}
            >
                + Add Item
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
                        className="ml-2 p-1 border border-gray-300 rounded"
                    >
                        <option value="All Categories">All Categories</option>
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
                    {filteredInventory.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-100">
                            <td className="p-2 border">{item.category}</td>
                            <td className="p-2 border">{item.itemName}</td>
                            <td className="p-2 border">{item.availableAmount} {item.unit}</td>
                            <td className="p-2 border">
                                <button
                                    className="text-blue-500 hover:underline"
                                    onClick={() => navigate(`/item/${item._id}`)}
                                >
                                    See Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryList;