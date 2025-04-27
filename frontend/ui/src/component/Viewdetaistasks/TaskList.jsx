import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./TaskList.css";

const LOGO_URL = "https://p7.hiclipart.com/preview/976/522/355/natural-environment-earth-ecology-clean-environment.jpg";

const TaskList = ({ tasks = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const printRef = useRef();

  // Unique filter options
  const uniqueCategories = Array.from(new Set(tasks.map(({ category }) => category)));
  const uniqueStatuses = Array.from(new Set(tasks.map(({ status }) => status)));

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    const matchesTitle = !searchTerm || (task.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || task.category === categoryFilter;
    const matchesStatus = !statusFilter || task.status === statusFilter;
    return matchesTitle && matchesCategory && matchesStatus;
  });

  // Total payment calculation
  const totalPayment = filteredTasks.reduce(
    (sum, { payment }) => sum + (parseFloat(payment) || 0),
    0
  );

  // Print handler (unchanged, majestic in print)
  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Task Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .print-header {
              text-align: center;
              margin-top: 30px;
              margin-bottom: 24px;
            }
            .print-logo {
              width: 90px;
              height: 90px;
              object-fit: contain;
              display: block;
              margin: 0 auto 12px auto;
            }
            .company-name {
              font-size: 2.5em;
              font-weight: bold;
              color:rgb(20, 188, 11);
              margin-bottom: 4px;
              letter-spacing: 2px;
            }
            .company-desc {
              font-size: 1.3em;
              color: #4b4b4b;
              margin-bottom: 18px;
            }
            .spacer {
              height: 30px;
            }
            .print-date {
              text-align: right;
              margin-bottom: 10px;
              font-size: 1em;
              color: #555;
            }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #0286fa; color: #fff; }
            .status-badge { 
              padding: 6px 18px; 
              border-radius: 8px; 
              font-size: 1em;
              min-width: 90px;
              display: inline-block;
              text-align: center;
              font-weight: 600;
            }
            .status-badge.in-progress { background: #fff9c4; color: #222; } /* light yellow */
            .status-badge.complete { background: #b9fbc0; color: #222; }    /* light green */
            .status-badge.unknown { background: #757575; color: #fff; }
            .total-section {
              margin-top: 18px;
              display: flex;
              justify-content: flex-end;
              font-size: 1.15em;
              font-weight: bold;
              color: #222;
              background: #f5f5f5;
              padding: 12px 24px;
              border-radius: 6px;
              max-width: 320px;
              margin-left: auto;
            }
            .total-label {
              margin-right: 16px;
            }
            .print-footer {
              margin-top: 60px;
              font-style: italic;
              color: #555;
              text-align: right;
              font-size: 1em;
            }
            .signature-section {
              margin-top: 60px;
              text-align: left;
              font-size: 1.1em;
              color: #222;
            }
            .signature-line {
              margin-bottom: 4px;
              margin-left: 0;
              font-size: 1.5em;
              letter-spacing: 2px;
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <img src="${LOGO_URL}" alt="CropWise Logo" class="print-logo" />
            <div class="company-name">CropWise</div>
            <div class="company-desc">Smart Agriculture</div>
          </div>
          <div class="spacer"></div>
          <h2 style="text-align:center;margin-bottom:10px;">Task Management Report</h2>
          <div class="print-date">
            Generated on: ${new Date().toLocaleDateString()}
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Employee ID</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTasks.map(task => `
                <tr>
                  <td>${task.title || "N/A"}</td>
                  <td>${task.category || "N/A"}</td>
                  <td>${task.employeeID || "N/A"}</td>
                  <td>${task.date ? new Date(task.date).toLocaleDateString() : "N/A"}</td>
                  <td>${task.payment ? parseFloat(task.payment).toFixed(2) : "0.00"}</td>
                  <td>
                    <span class="status-badge ${task.status ? task.status.toLowerCase().replace(' ', '-') : 'unknown'}">
                      ${task.status || "Unknown"}
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="total-section">
            <span class="total-label">Total</span>
            <span>Rs.${totalPayment.toFixed(2)}</span>
          </div>
          <div class="signature-section">
            <div class="signature-line">...........................................</div>
            signature
          </div>
          <div class="print-footer">
            End of Report
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500); // Allow images to load
  };

  if (!tasks.length) {
    return <div className="no-tasks">No tasks found!</div>;
  }

  // Majestic styles
  const styles = {
    pageBg: {
      minHeight: "100vh",
      background: "linear-gradient(120deg, #f0f8ff 0%, #e9f5e1 100%)",
      padding: "0",
      fontFamily: "'Segoe UI', 'Roboto', Arial, sans-serif",
    },
    hero: {
      textAlign: "center",
      padding: "40px 0 24px 0",
      background: "linear-gradient(90deg,rgb(7, 53, 1) 0%,rgb(93, 255, 101) 100%)",
      borderRadius: "0 0 38px 38px",
      marginBottom: "32px",
      boxShadow: "0 6px 24px rgba(2,102,200,0.08)",
    },
    heroLogo: {
      width: "70px",
      height: "70px",
      objectFit: "contain",
      marginBottom: "12px",
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 2px 8px rgba(2,102,200,0.10)",
    },
    heroTitle: {
      fontSize: "2.6rem",
      fontWeight: 800,
      letterSpacing: "2px",
      color: "#fff",
      margin: "0 0 4px 0",
    },
    heroDesc: {
      fontSize: "1.18rem",
      color: "#e0f7fa",
      marginBottom: "0",
      letterSpacing: "1px",
      fontWeight: 500,
    },
    filterRow: {
      display: "flex",
      gap: "18px",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "24px",
      flexWrap: "wrap",
    },
    filterInput: {
      padding: "10px 15px",
      border: "1.5px solid #b3d0f2",
      borderRadius: "6px",
      fontSize: "1.06em",
      minWidth: "180px",
      background: "#f8fbfd",
      fontWeight: 500,
      outline: "none",
      transition: "border 0.2s",
    },
    filterSelect: {
      padding: "10px 15px",
      border: "1.5px solid #b3d0f2",
      borderRadius: "6px",
      fontSize: "1.06em",
      minWidth: "160px",
      background: "#f8fbfd",
      fontWeight: 500,
      outline: "none",
      transition: "border 0.2s",
    },
    reportBtn: {
      background: "linear-gradient(90deg, #0266c8 0%, #388e3c 100%)",
      color: "#fff",
      border: "none",
      padding: "11px 32px",
      borderRadius: "8px",
      fontWeight: 700,
      fontSize: "1.13em",
      letterSpacing: "1px",
      boxShadow: "0 2px 8px rgba(2,134,250,0.10)",
      cursor: "pointer",
      transition: "background 0.2s, box-shadow 0.2s",
    },
    tableCard: {
      background: "#fff",
      borderRadius: "14px",
      boxShadow: "0 4px 24px rgba(2,134,250,0.10)",
      padding: "0",
      margin: "0 auto",
      maxWidth: "98vw",
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
      fontSize: "1.07em",
      minWidth: "900px",
    },
    th: {
      background: "#0286fa",
      color: "#fff",
      fontWeight: 700,
      padding: "14px 10px",
      border: "none",
      textAlign: "left",
      fontSize: "1.02em",
    },
    td: {
      padding: "12px 10px",
      borderBottom: "1px solid #f0f4f8",
      background: "#fff",
      fontWeight: 500,
    },
    statusBadge: {
      borderRadius: "8px",
      fontWeight: 600,
      fontSize: "1em",
      minWidth: 90,
      display: "inline-block",
      textAlign: "center",
      padding: "6px 18px",
    },
    statusInProgress: {
      background: "#fff9c4", // light yellow
      color: "#222",
    },
    statusComplete: {
      background: "#b9fbc0", // light green
      color: "#222",
    },
    statusUnknown: {
      background: "#757575",
      color: "#fff",
    },
    actionsCell: {
      textAlign: "center",
    },
    viewBtn: {
      background: "linear-gradient(90deg, #33b5e5, #0099cc)",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "7px 18px",
      fontWeight: 600,
      fontSize: "1em",
      cursor: "pointer",
      boxShadow: "0 1px 4px rgba(2,134,250,0.10)",
      transition: "background 0.2s",
    },
    totalSection: {
      marginTop: "18px",
      display: "flex",
      justifyContent: "flex-end",
      fontSize: "1.15em",
      fontWeight: "bold",
      color: "#222",
      background: "#f5f5f5",
      padding: "12px 24px",
      borderRadius: "6px",
      maxWidth: 320,
      marginLeft: "auto",
    },
    totalLabel: {
      marginRight: 16,
    },
    '@media (maxWidth: 900px)': {
      table: { minWidth: "600px" },
    },
    '@media (maxWidth: 600px)': {
      hero: { padding: "24px 0 16px 0" },
      tableCard: { padding: "0 2vw" },
      filterRow: { flexDirection: "column", gap: "10px" },
      table: { fontSize: "0.98em" },
    },
  };

  return (
    <div style={styles.pageBg}>
      {/* Majestic Hero Header */}
      <div style={styles.hero}>
        <img src={LOGO_URL} alt="CropWise Logo" style={styles.heroLogo} />
        <div style={styles.heroTitle}>CropWise</div>
        <div style={styles.heroDesc}>Smart Agriculture</div>
      </div>
      {/* Filters and Actions */}
      <div style={styles.filterRow} className="no-print">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          aria-label="Search by title"
          style={styles.filterInput}
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
          style={styles.filterSelect}
        >
          <option value="">All Categories</option>
          {uniqueCategories.map(category =>
            <option key={category} value={category}>{category}</option>
          )}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          style={styles.filterSelect}
        >
          <option value="">All Statuses</option>
          {uniqueStatuses.map(status =>
            <option key={status} value={status}>{status}</option>
          )}
        </select>
        <button
          onClick={handlePrint}
          style={styles.reportBtn}
        >
          Generate Report
        </button>
      </div>
      {/* Table Card */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>TITLE</th>
              <th style={styles.th}>CATEGORY</th>
              <th style={styles.th}>EMPLOYEE ID</th>
              <th style={styles.th}>DATE</th>
              <th style={styles.th}>PAYMENT</th>
              <th style={styles.th}>STATUS</th>
              <th style={styles.th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, idx) => (
              <tr key={task._id || idx}>
                <td style={styles.td}>{task.title || "N/A"}</td>
                <td style={styles.td}>{task.category || "N/A"}</td>
                <td style={styles.td}>{task.employeeID || "N/A"}</td>
                <td style={styles.td}>{task.date ? new Date(task.date).toLocaleDateString() : "N/A"}</td>
                <td style={styles.td}>{task.payment ? parseFloat(task.payment).toFixed(2) : "0.00"}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(task.status === "In Progress"
                        ? styles.statusInProgress
                        : task.status === "Complete"
                        ? styles.statusComplete
                        : styles.statusUnknown),
                    }}
                  >
                    {task.status || "Unknown"}
                  </span>
                </td>
                <td style={{ ...styles.td, ...styles.actionsCell }}>
                  {task._id ? (
                    <Link
                      to={`/Showtask/${task._id}`}
                      style={styles.viewBtn}
                    >
                      View Details
                    </Link>
                  ) : (
                    <span>No ID</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={styles.totalSection}>
          <span style={styles.totalLabel}>Total</span>
          <span>Rs.{totalPayment.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
