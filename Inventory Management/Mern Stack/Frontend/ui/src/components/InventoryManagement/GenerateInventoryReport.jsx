import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GenerateInventoryReport = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/inventory");
                setInventory(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching inventory:", err);
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    const handlePrint = () => {
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
            }
        `;

        // Create a style element for print
        const styleElement = document.createElement('style');
        styleElement.innerHTML = printStyles;
        
        // Clone the report content
        const printContent = document.getElementById('inventoryReport-printContent').cloneNode(true);
        
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
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

    return (
        <div style={styles.container}>
            <button 
                style={styles.backButton}
                onClick={() => navigate("/")}
                className="inventoryReport-noPrint"
            >
                ← 
            </button>

            <div style={styles.header}>
                <h1 style={styles.title}>Inventory Report</h1>
                <p style={styles.subtitle}>Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
            </div>

            <div id="inventoryReport-printContent" style={styles.reportContainer} className="inventoryReport-reportContainer">
                <table style={styles.table} className="inventoryReport-table">
                    <thead>
                        <tr style={styles.tableHeaderRow} className="inventoryReport-tableHeaderRow">
                            <th style={styles.tableHeaderCell} className="inventoryReport-tableHeaderCell">Category</th>
                            <th style={styles.tableHeaderCell} className="inventoryReport-tableHeaderCell">Item</th>
                            <th style={styles.tableHeaderCell} className="inventoryReport-tableHeaderCell">Available Amount</th>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
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
    backButton: {
        backgroundColor: '#fc5b42',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '8px 16px',
        cursor: 'pointer',
        marginBottom: '20px',
        fontSize: '14px',
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