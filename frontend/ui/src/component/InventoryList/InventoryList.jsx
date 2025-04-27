import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './InventoryList.css';
import GenerateInventoryReport from "../InventoryReport/GenerateInventoryReport";


const InventoryList = () => {
    const [inventory, setInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [showReport, setShowReport] = useState(false);
    const [reportContent, setReportContent] = useState("");
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
    const generateAiReport = () => {
        const ai_pdf_button = document.getElementById("ai-pdf-button");
        ai_pdf_button.setAttribute("disabled", "true");
        ai_pdf_button.innerHTML = "Generating...";

        // Analyze inventory data
        const lowStockItems = inventory.filter(item => item.availableAmount < 3);
        const expiredItems = inventory.filter(item => {
            if (!item.expirationDate) return false;
            const today = new Date();
            const expDate = new Date(item.expirationDate);
            return expDate < today;
        });
        const expiringSoonItems = inventory.filter(item => {
            if (!item.expirationDate) return false;
            const today = new Date();
            const expDate = new Date(item.expirationDate);
            const daysLeft = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
            return daysLeft <= 7 && daysLeft >= 0;
        });

        const prompt = `Create a detailed inventory analysis report for the following inventory data:

Current Inventory Status:
- Total Items: ${inventory.length}
- Low Stock Items: ${lowStockItems.length} items
${lowStockItems.map(item => `  • ${item.itemName}: ${item.availableAmount} ${item.unit} remaining`).join('\n')}
- Expired Items: ${expiredItems.length}
- Items Expiring Soon: ${expiringSoonItems.length}

Please provide a professional analysis that covers:
1. The current state of inventory
2. Critical items that need attention
3. Recommendations for inventory management
4. Risk assessment
5. Action items

Format the response as a clear, professional report with proper paragraphs and bullet points where appropriate.`;

        const requestBody = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        };

        fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDqlu4n9Hw98cPn04TaWbcfileVdZJuCOo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data); // Debug log

            if (!data || !data.candidates || !data.candidates[0]) {
                throw new Error('Invalid API response format - missing candidates');
            }

            let content;
            try {
                content = data.candidates[0].content.parts[0].text;
                if (!content) {
                    throw new Error('Empty content received from API');
                }
                console.log('Parsed content:', content); // Debug log
            } catch (error) {
                console.error('Error parsing content:', error);
                throw new Error('Failed to parse API response content');
            }

            const formattedContent = `
                <div class="report-container" style="
                    font-family: 'Segoe UI', Arial, sans-serif;
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 40px;
                    background-color: white;
                    box-shadow: 0 0 20px rgba(0,0,0,0.1);
                    border-radius: 12px;
                    line-height: 1.6;
                ">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="
                            color: #1a365d;
                            font-size: 32px;
                            font-weight: 600;
                            margin-bottom: 10px;
                        ">Inventory Analysis Report</h1>
                        <p style="color: #666; font-size: 14px;">Generated on ${new Date().toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </div>

                    <div style="
                        background-color: #f8fafc;
                        border-left: 4px solid #3b82f6;
                        padding: 20px;
                        margin-bottom: 30px;
                        border-radius: 0 8px 8px 0;
                    ">
                        <h2 style="
                            color: #1e40af;
                            font-size: 20px;
                            margin: 0 0 10px 0;
                        ">Inventory Analysis</h2>
                        <div style="margin: 0; color: #334155; white-space: pre-line;">${content.replace(/\*\*/g, '')}</div>
                    </div>

                    <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: right;">
                        <button onclick="window.print()" style="
                            background-color: #2563eb;
                            color: white;
                            padding: 12px 24px;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 16px;
                            transition: background-color 0.3s;
                        ">Print Report</button>
                    </div>
                </div>
            `;

            setReportContent(formattedContent);
            setShowReport(true);
        })
        .catch(error => {
            console.error('Detailed error:', error);
            ai_pdf_button.removeAttribute("disabled");
            ai_pdf_button.innerHTML = "Generate AI Report";
            alert(`Error generating report: ${error.message}`);
        });
    };

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
            
            {/* Report Modal */}
            {showReport && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    zIndex: 1000,
                    overflow: 'auto',
                    padding: '20px'
                }}>
                    <div style={{
                        position: 'relative',
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '12px',
                        maxWidth: '1000px',
                        margin: '40px auto',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}>
                        <button 
                            onClick={() => {
                                setShowReport(false);
                                const ai_pdf_button = document.getElementById("ai-pdf-button");
                                if (ai_pdf_button) {
                                    ai_pdf_button.removeAttribute("disabled");
                                    ai_pdf_button.innerHTML = "Generate AI Report";
                                }
                            }}
                            style={{
                                position: 'absolute',
                                right: '20px',
                                top: '20px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                fontSize: '18px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        >×</button>
                        <div dangerouslySetInnerHTML={{ __html: reportContent }} />
                    </div>
                </div>
            )}

            <div className="button-container">
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
                <button id="ai-pdf-button" className="button ai-pdf" onClick={generateAiReport}>
                    Generate AI Report
                </button>
                {/* Generate Report Button */}
                <button
                    className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 mr-2"
                    onClick={() => navigate("/GenerateInventoryReport")}
                >
                    Generate Report
                </button>
            </div>
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
