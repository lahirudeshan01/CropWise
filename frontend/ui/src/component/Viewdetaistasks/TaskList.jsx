// import React, { useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import "./TaskList.css";

// const TaskList = ({ tasks = [] }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const printRef = useRef();

//   const uniqueCategories = Array.from(new Set(tasks.map(({ category }) => category)));
//   const uniqueStatuses = Array.from(new Set(tasks.map(({ status }) => status)));

//   const filteredTasks = tasks.filter(task => {
//     const matchesTitle = !searchTerm || (task.title || "").toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = !categoryFilter || task.category === categoryFilter;
//     const matchesStatus = !statusFilter || task.status === statusFilter;
//     return matchesTitle && matchesCategory && matchesStatus;
//   });

//   const totalPayment = filteredTasks.reduce(
//     (sum, { payment }) => sum + (parseFloat(payment) || 0),
//     0
//   );

//   const handlePrint = () => {
//     const printWindow = window.open("", "", "width=800,height=600");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Task Report</title>
//           <style>
//             body { font-family: Arial, sans-serif; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//             th { background-color: #0286fa; color: #fff; }
//             .status-badge { 
//               padding: 3px 8px; 
//               border-radius: 3px; 
//               color: #fff; 
//               font-size: 0.95em;
//               display: inline-block;
//             }
//             .status-badge.complete { background: #388e3c; }
//             .status-badge.in-progress { background: #fbc02d; color: #222; }
//             .status-badge.unknown { background: #757575; }
//             .total-row { background: #f5f5f5; color: #222; font-weight: bold; font-size: 1.07em; }
//             .total-row td { border: none; }
//             .print-header { text-align: center; margin-bottom: 20px; }
//             .print-footer { text-align: right; margin-top: 20px; font-style: italic; }
//             .print-date { text-align: right; margin-bottom: 10px; }
//           </style>
//         </head>
//         <body>
//           <div class="print-header">
//             <h2>Task Management Report</h2>
//           </div>
//           <div class="print-date">
//             Generated on: ${new Date().toLocaleDateString()}
//           </div>
//           <table>
//             <thead>
//               <tr>
//                 <th>Title</th>
//                 <th>Category</th>
//                 <th>Employee ID</th>
//                 <th>Date</th>
//                 <th>Payment</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${filteredTasks.map(task => `
//                 <tr>
//                   <td>${task.title || "N/A"}</td>
//                   <td>${task.category || "N/A"}</td>
//                   <td>${task.employeeID || "N/A"}</td>
//                   <td>${task.date ? new Date(task.date).toLocaleDateString() : "N/A"}</td>
//                   <td>${task.payment ? parseFloat(task.payment).toFixed(2) : "0.00"}</td>
//                   <td>
//                     <span class="status-badge ${task.status ? task.status.toLowerCase().replace(' ', '-') : 'unknown'}">
//                       ${task.status || "Unknown"}
//                     </span>
//                   </td>
//                 </tr>
//               `).join("")}
//               <tr class="total-row">
//                 <td colspan="4"><b>Total</b></td>
//                 <td><b>Rs.${totalPayment.toFixed(2)}</b></td>
//                 <td></td>
//               </tr>
//             </tbody>
//           </table>
//           <div class="print-footer">
//             End of Report
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//     printWindow.close();
//   };

//   if (!tasks.length) {
//     return <div className="no-tasks">No tasks found!</div>;
//   }

//   return (
//     <div ref={printRef} className="task-list-wrapper">
//       <div className="filters no-print">
//         <input
//           type="text"
//           placeholder="Search by title..."
//           value={searchTerm}
//           onChange={e => setSearchTerm(e.target.value)}
//           aria-label="Search by title"
//         />

//         <select
//           value={categoryFilter}
//           onChange={e => setCategoryFilter(e.target.value)}
//           aria-label="Filter by category"
//         >
//           <option value="">All Categories</option>
//           {uniqueCategories.map(category =>
//             <option key={category} value={category}>{category}</option>
//           )}
//         </select>

//         <select
//           value={statusFilter}
//           onChange={e => setStatusFilter(e.target.value)}
//           aria-label="Filter by status"
//         >
//           <option value="">All Statuses</option>
//           {uniqueStatuses.map(status =>
//             <option key={status} value={status}>{status}</option>
//           )}
//         </select>

//         <button onClick={handlePrint} className="print-btn">
//           Print Report
//         </button>
//       </div>

//       {filteredTasks.length === 0 ? (
//         <div className="no-tasks">No tasks match your filters.</div>
//       ) : (
//         <div className="table-container">
//           <table className="task-table">
//             <thead>
//               <tr>
//                 <th style={{ background: "#0286fa", color: "#fff" }}>TITLE</th>
//                 <th style={{ background: "#0286fa", color: "#fff" }}>CATEGORY</th>
//                 <th style={{ background: "#0286fa", color: "#fff" }}>EMPLOYEE ID</th>
//                 <th style={{ background: "#0286fa", color: "#fff" }}>DATE</th>
//                 <th style={{ background: "#0286fa", color: "#fff" }}>PAYMENT</th>
//                 <th style={{ background: "#0286fa", color: "#fff" }}>STATUS</th>
//                 <th className="no-print" style={{ background: "#0286fa", color: "#fff" }}>ACTIONS</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredTasks.map((task, idx) => (
//                 <tr key={task._id || idx}>
//                   <td>{task.title || "N/A"}</td>
//                   <td>{task.category || "N/A"}</td>
//                   <td>{task.employeeID || "N/A"}</td>
//                   <td>{task.date ? new Date(task.date).toLocaleDateString() : "N/A"}</td>
//                   <td>{task.payment ? parseFloat(task.payment).toFixed(2) : "0.00"}</td>
//                   <td>
//                     <span
//                       className={`status-badge ${task.status ? task.status.toLowerCase().replace(' ', '-') : "unknown"}`}
//                       style={{
//                         background:
//                           task.status === "Complete"
//                             ? "#388e3c"
//                             : task.status === "In Progress"
//                             ? "#fbc02d"
//                             : "#757575",
//                         color: task.status === "In Progress" ? "#222" : "#fff",
//                         fontWeight: 600,
//                         padding: "6px 18px",
//                         borderRadius: 8,
//                         fontSize: "1em",
//                         minWidth: 90,
//                         display: "inline-block",
//                         textAlign: "center"
//                       }}
//                     >
//                       {task.status || "Unknown"}
//                     </span>
//                   </td>
//                   <td className="no-print">
//                     {task._id ? (
//                       <Link to={`/Showtask/${task._id}`} className="view-details-btn">
//                         View Details
//                       </Link>
//                     ) : (
//                       <span>No ID</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//               {/* Highlighted Total Row */}
//               <tr
//                 className="total-row"
//                 style={{
//                   background: "#f5f5f5",
//                   color: "#222",
//                   fontWeight: "bold",
//                   fontSize: "1.07em"
//                 }}
//               >
//                 <td colSpan={4}><b>Total</b></td>
//                 <td><b>Rs.{totalPayment.toFixed(2)}</b></td>
//                 <td colSpan={2}></td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskList;



import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./TaskList.css";

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

  // Print handler
  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Task Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #0286fa; color: #fff; }
            .status-badge { 
              padding: 6px 18px; 
              border-radius: 20px; 
              font-size: 1em;
              min-width: 90px;
              display: inline-block;
              text-align: center;
              font-weight: 600;
            }
            .status-badge.in-progress { background: #ffd54f; color: #795548; }
            .status-badge.complete { background: #43a047; color: #fff; }
            .status-badge.unknown { background: #e0e0e0; color: #757575; }
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
            .print-header { text-align: center; margin-bottom: 20px; }
            .print-footer { text-align: right; margin-top: 20px; font-style: italic; }
            .print-date { text-align: right; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h2>Task Management Report</h2>
          </div>
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
          <div class="print-footer">
            End of Report
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // No tasks message
  if (!tasks.length) {
    return <div className="no-tasks">No tasks found!</div>;
  }

  return (
    <div ref={printRef} className="task-list-wrapper">
      <header className="task-list-header">
        <h2>Task List</h2>
        <div className="filters no-print">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            aria-label="Search by title"
          />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
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
          >
            <option value="">All Statuses</option>
            {uniqueStatuses.map(status =>
              <option key={status} value={status}>{status}</option>
            )}
          </select>
          <button onClick={handlePrint} className="print-btn">
            Print Report
          </button>
        </div>
      </header>

      {filteredTasks.length === 0 ? (
        <div className="no-tasks">No tasks match your filters.</div>
      ) : (
        <div className="table-container">
          <table className="task-table">
            <thead>
              <tr>
                <th style={{ background: "#0286fa", color: "#fff" }}>TITLE</th>
                <th style={{ background: "#0286fa", color: "#fff" }}>CATEGORY</th>
                <th style={{ background: "#0286fa", color: "#fff" }}>EMPLOYEE ID</th>
                <th style={{ background: "#0286fa", color: "#fff" }}>DATE</th>
                <th style={{ background: "#0286fa", color: "#fff" }}>PAYMENT</th>
                <th style={{ background: "#0286fa", color: "#fff" }}>STATUS</th>
                <th className="no-print" style={{ background: "#0286fa", color: "#fff" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, idx) => (
                <tr key={task._id || idx}>
                  <td>{task.title || "N/A"}</td>
                  <td>{task.category || "N/A"}</td>
                  <td>{task.employeeID || "N/A"}</td>
                  <td>{task.date ? new Date(task.date).toLocaleDateString() : "N/A"}</td>
                  <td>{task.payment ? parseFloat(task.payment).toFixed(2) : "0.00"}</td>
                  <td>
                    <span
                      className={`status-badge ${task.status ? task.status.toLowerCase().replace(' ', '-') : "unknown"}`}
                      style={
                        task.status === "In Progress"
                          ? {
                              background: "#ffd54f", // Highlighted yellow
                              color: "#795548",
                              borderRadius: "20px",
                              fontWeight: 600,
                              padding: "6px 18px",
                              fontSize: "1em",
                              minWidth: 90,
                              display: "inline-block",
                              textAlign: "center",
                            }
                          : task.status === "Complete"
                          ? {
                              background: "#43a047", // Highlighted green
                              color: "#fff",
                              borderRadius: "20px",
                              fontWeight: 600,
                              padding: "6px 18px",
                              fontSize: "1em",
                              minWidth: 90,
                              display: "inline-block",
                              textAlign: "center",
                            }
                          : {
                              background: "#e0e0e0", // Light grey for unknown
                              color: "#757575",
                              borderRadius: "20px",
                              fontWeight: 600,
                              padding: "6px 18px",
                              fontSize: "1em",
                              minWidth: 90,
                              display: "inline-block",
                              textAlign: "center",
                            }
                      }
                    >
                      {task.status || "Unknown"}
                    </span>
                  </td>
                  <td className="no-print">
                    {task._id ? (
                      <Link to={`/Showtask/${task._id}`} className="view-details-btn">
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
          {/* Total section below and right-aligned */}
          <div
            className="total-section"
            style={{
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
              marginLeft: "auto"
            }}
          >
            <span className="total-label" style={{ marginRight: 16 }}>Total</span>
            <span>Rs.{totalPayment.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;















