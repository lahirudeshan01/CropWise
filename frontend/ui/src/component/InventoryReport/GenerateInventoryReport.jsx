import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GenerateInventoryReport = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/inventory");
                if (response.data && Array.isArray(response.data)) {
                    setInventory(response.data);
                } else {
                    setError("Invalid data format received from server");
                }
            } catch (err) {
                console.error("Error fetching inventory:", err);
                setError("Failed to fetch inventory data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    const handlePrint = () => {
        if (inventory.length === 0) {
            alert("No inventory data available to print");
            return;
        }

        // Create print styles
        const printStyles = `
            @page {
                size: A4;
                margin: 10mm;
            }
            @media print {
                body {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }
                .inventoryReport-noPrint {
                    display: none !important;
                }
                .inventoryReport-reportContainer {
                    border: none !important;
                    padding: 0 !important;
                }
                .inventoryReport-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                .inventoryReport-tableHeaderRow {
                    background-color: #f5f5f5 !important;
                }
                .inventoryReport-tableHeaderCell, .inventoryReport-tableCell {
                    padding: 8px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                .inventoryReport-header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .inventoryReport-title {
                    font-size: 20px;
                    font-weight: bold;
                }
                .inventoryReport-subtitle {
                    font-size: 14px;
                    color: #666;
                }
                .inventoryReport-companyHeader {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .inventoryReport-logo {
                    height: 80px;
                    margin-bottom: 10px;
                }
                .inventoryReport-companyName {
                    font-size: 28px;
                    font-weight: bold;
                    color: #2a6496;
                    margin-bottom: 5px;
                }
                .inventoryReport-companyDesc {
                    font-size: 16px;
                    color: #555;
                    font-style: italic;
                }
                .inventoryReport-signature {
                    margin-top: 50px;
                    text-align: left;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    width: 200px;
                }
            }
        `;

        // Create a style element for print
        const styleElement = document.createElement('style');
        styleElement.innerHTML = printStyles;
        
        // Clone the report content
        const printContent = document.getElementById('inventoryReport-printContent').cloneNode(true);
        
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert("Please allow pop-ups to print the report");
            return;
        }
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Inventory Report</title>
                </head>
                <body>
                    ${printContent.outerHTML}
                </body>
            </html>
        `);
        
        // Add the styles to the print window
        printWindow.document.head.appendChild(styleElement);
        
        // Trigger print after content loads
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    if (loading) {
        return <div style={styles.loading}>Loading inventory data...</div>;
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorMessage}>{error}</div>
                <button 
                    style={styles.backButton}
                    onClick={() => navigate("/")}
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (inventory.length === 0) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorMessage}>No inventory items found</div>
                <button 
                    style={styles.backButton}
                    onClick={() => navigate("/")}
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <button 
                style={styles.backButton}
                onClick={() => navigate("/inventryshow")}
                className="inventoryReport-noPrint"
            >
                ← 
            </button>

            <div id="inventoryReport-printContent" style={styles.reportContainer} className="inventoryReport-reportContainer">
                <div style={styles.companyHeader} className="inventoryReport-companyHeader">
                    <img 
                        src="https://p7.hiclipart.com/preview/976/522/355/natural-environment-earth-ecology-clean-environment.jpg" 
                        alt="Company Logo" 
                        style={styles.logo} 
                        className="inventoryReport-logo"
                    />
                    <div style={styles.companyName} className="inventoryReport-companyName">CropWise</div>
                    <div style={styles.companyDesc} className="inventoryReport-companyDesc">Smart Agriculture</div>
                </div>

                <div style={styles.header}>
                    <h1 style={styles.title}>Inventory Report</h1>
                    <p style={styles.subtitle}>Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                </div>

                <table style={styles.table} className="inventoryReport-table">
                    <thead>
                        <tr style={styles.tableHeaderRow} className="inventoryReport-tableHeaderRow">
                            <th style={styles.tableHeaderCell} className="inventoryReport-tableHeaderCell">Category</th>
                            <th style={styles.tableHeaderCell} className="inventoryReport-tableHeaderCell">Item</th>
                            <th style={styles.tableHeaderCell} className="inventoryReport-tableHeaderCell">Available Amount</th>
                            <th style={styles.tableHeaderCell} className="inventoryReport-tableHeaderCell">Unit Price</th>
                            <th style={styles.tableHeaderCell} className="inventoryReport-tableHeaderCell">Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((item) => (
                            <tr key={item._id} style={styles.tableRow} className="inventoryReport-tableRow">
                                <td style={styles.tableCell} className="inventoryReport-tableCell">{item.category}</td>
                                <td style={styles.tableCell} className="inventoryReport-tableCell">{item.itemName}</td>
                                <td style={styles.tableCell} className="inventoryReport-tableCell">
                                    {item.availableAmount} {item.unit}
                                </td>
                                <td style={styles.tableCell} className="inventoryReport-tableCell">
                                    Rs.{item.unitPrice?.toLocaleString() || '0'}
                                </td>
                                <td style={styles.tableCell} className="inventoryReport-tableCell">
                                    Rs.{(item.availableAmount * (item.unitPrice || 0)).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={styles.signature} className="inventoryReport-signature">
                    <div>...........................................</div>
                    <div>Signature</div>
                </div>
            </div>

            <button 
                onClick={handlePrint}
                style={styles.printButton}
                className="inventoryReport-noPrint"
            >
                Print Report
            </button>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1000px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    },
    loading: {
        textAlign: 'center',
        padding: '20px',
        fontSize: '18px',
    },
    errorContainer: {
        textAlign: 'center',
        padding: '20px',
    },
    errorMessage: {
        color: '#dc3545',
        fontSize: '18px',
        marginBottom: '20px',
    },
    backButton: {
        backgroundColor: '#fc5b42',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 16px',
        cursor: 'pointer',
        marginBottom: '20px',
        fontSize: '14px',
    },
    companyHeader: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    logo: {
        height: '80px',
        marginBottom: '10px',
    },
    companyName: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#2a6496',
        marginBottom: '5px',
    },
    companyDesc: {
        fontSize: '16px',
        color: '#555',
        fontStyle: 'italic',
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
    },
    reportContainer: {
        margin: '20px 0',
        border: '1px solid #eee',
        borderRadius: '5px',
        padding: '15px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },
    tableHeaderRow: {
        backgroundColor: '#f5f5f5',
    },
    tableHeaderCell: {
        padding: '12px',
        textAlign: 'left',
        borderBottom: '1px solid #ddd',
        fontWeight: 'bold',
    },
    tableRow: {
        borderBottom: '1px solid #eee',
    },
    tableCell: {
        padding: '12px',
        textAlign: 'left',
    },
    signature: {
        marginTop: '50px',
        textAlign: 'left',
        paddingTop: '20px',
        borderTop: '1px solid #ddd',
        width: '200px',
    },
    printButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '20px',
        display: 'block',
        width: '100%',
    },
};

export default GenerateInventoryReport;