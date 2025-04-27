import React, { useState } from "react";
import axios from "axios";

const LOGO_URL =
  "https://p7.hiclipart.com/preview/976/522/355/natural-environment-earth-ecology-clean-environment.jpg";

const TaskForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    employeeID: "",
    date: "",
    payment: "0.00",
    status: "Unknown",
  });

  const [errors, setErrors] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  const categoryOptions = ["Planting", "Maintenance", "Harvesting"];
  const statusOptions = ["Unknown", "In Progress", "Complete"];

  // Majestic style system
  const styles = {
    pageBg: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #e0f7fa 0%, #fff 60%, #e3f2fd 100%)",
      padding: "0",
      margin: "0",
    },
    formCard: {
      background: "#fff",
      borderRadius: "18px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
      padding: "38px 32px 32px 32px",
      maxWidth: "520px",
      margin: "50px auto",
      position: "relative",
      zIndex: 2,
    },
    header: {
      textAlign: "center",
      marginBottom: "36px",
      marginTop: "18px",
    },
    logo: {
      width: "72px",
      height: "72px",
      objectFit: "contain",
      borderRadius: "50%",
      boxShadow: "0 4px 12px rgba(2,134,250,0.10)",
      margin: "0 auto 12px auto",
      display: "block",
      background: "#f5fafd",
    },
    companyName: {
      fontSize: "2.2rem",
      fontWeight: 800,
      letterSpacing: "2px",
      color: "#14BC0B",
      margin: "0 0 4px 0",
      fontFamily: "'Segoe UI', 'Roboto', Arial, sans-serif",
    },
    tagline: {
      fontSize: "1.13rem",
      color: "#4b4b4b",
      marginBottom: "12px",
      fontWeight: 500,
      letterSpacing: "1px",
    },
    heading: {
      marginTop: "0",
      marginBottom: "28px",
      color: "#1a2a3a",
      fontWeight: 700,
      fontSize: "1.35rem",
      letterSpacing: "0.5px",
      textAlign: "center",
    },
    formGroup: {
      marginBottom: "22px",
    },
    formRow: {
      display: "flex",
      gap: "20px",
      marginBottom: "22px",
      flexWrap: "wrap",
    },
    halfWidth: {
      flex: "1 1 0",
      minWidth: "140px",
    },
    label: {
      display: "block",
      marginBottom: "7px",
      fontWeight: 600,
      color: "#1a2a3a",
      fontSize: "1.04rem",
      letterSpacing: "0.2px",
    },
    required: {
      color: "#e53935",
      marginLeft: "4px",
    },
    input: {
      width: "100%",
      padding: "11px 13px",
      border: "1.5px solid #cfd8dc",
      borderRadius: "6px",
      fontSize: "1.05rem",
      background: "#f8fbfd",
      transition: "border-color 0.3s",
      outline: "none",
      fontWeight: 500,
      color: "#222",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      padding: "11px 13px",
      border: "1.5px solid #cfd8dc",
      borderRadius: "6px",
      fontSize: "1.05rem",
      background: "#f8fbfd",
      appearance: "none",
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%230286fa' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 13px center",
      backgroundSize: "14px",
      paddingRight: "36px",
      fontWeight: 500,
      color: "#222",
      boxSizing: "border-box",
    },
    inputError: {
      borderColor: "#e53935",
      background: "#fff6f6",
    },
    errorMessage: {
      color: "#e53935",
      fontSize: "0.98rem",
      marginTop: "3px",
      display: "block",
      fontWeight: 500,
    },
    formActions: {
      marginTop: "36px",
      textAlign: "center",
    },
    submitBtn: {
      background: "linear-gradient(90deg, #0286fa 0%, #43a047 100%)",
      color: "white",
      border: "none",
      padding: "13px 38px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "1.13rem",
      fontWeight: 700,
      boxShadow: "0 2px 8px rgba(2,134,250,0.14)",
      transition: "background 0.2s, box-shadow 0.2s",
      letterSpacing: "1px",
    },
    submitBtnHover: {
      background: "linear-gradient(90deg, #0266c8 0%, #388e3c 100%)",
      boxShadow: "0 4px 16px rgba(2,134,250,0.18)",
    },
    divider: {
      height: "1.5px",
      background: "linear-gradient(90deg, #0286fa 0%, #43a047 100%)",
      border: "none",
      margin: "30px 0 36px 0",
      opacity: 0.18,
    },
    '@media (maxWidth: 600px)': {
      formCard: {
        padding: "18px 4vw",
        margin: "18px 0",
      },
      formRow: {
        flexDirection: "column",
        gap: "0",
      },
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      const englishOnly = value.replace(/[^a-zA-Z ]/g, "");
      setFormData({ ...formData, [name]: englishOnly });
      return;
    }

    if (name === "payment") {
      const formattedValue = value.replace(/[^0-9.]/g, "");
      if (/^\d*(\.\d{0,2})?$/.test(formattedValue)) {
        setFormData({ ...formData, [name]: formattedValue });
      }
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.employeeID.trim())
      newErrors.employeeID = "Employee ID is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!/^\d+(\.\d{2})?$/.test(formData.payment)) {
      newErrors.payment = "Enter a valid amount with cents (e.g., 2500.00)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.post("http://localhost:3000/api/tasks", formData);
      alert("Task assigned successfully!");
      setFormData({
        title: "",
        category: "",
        employeeID: "",
        date: "",
        payment: "0.00",
        status: "Unknown",
      });
      if (onSubmit) onSubmit(formData);
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to assign task. Please try again.");
    }
  };

  return (
    <div style={styles.pageBg}>
      <div style={styles.formCard}>
        <div style={styles.header}>
          <img src={LOGO_URL} alt="CropWise Logo" style={styles.logo} />
          <div style={styles.companyName}>CropWise</div>
          <div style={styles.tagline}>Smart Agriculture</div>
        </div>
        <hr style={styles.divider} />
        <h1 style={styles.heading}>Assign New Task</h1>
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Task Title */}
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>
              Task Title<span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.title ? styles.inputError : {}),
              }}
              placeholder="Enter task title"
              autoFocus
            />
            {errors.title && (
              <span style={styles.errorMessage}>{errors.title}</span>
            )}
          </div>

          {/* Task Category */}
          <div style={styles.formGroup}>
            <label htmlFor="category" style={styles.label}>
              Task Category<span style={styles.required}>*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{
                ...styles.select,
                ...(errors.category ? styles.inputError : {}),
              }}
            >
              <option value="">Select Category</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.category && (
              <span style={styles.errorMessage}>{errors.category}</span>
            )}
          </div>

          {/* Employee ID and Payment in one row */}
          <div style={styles.formRow}>
            <div style={styles.halfWidth}>
              <label htmlFor="employeeID" style={styles.label}>
                Assign To<span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="employeeID"
                name="employeeID"
                placeholder="Employee ID (e.g. E10450)"
                value={formData.employeeID}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.employeeID ? styles.inputError : {}),
                }}
              />
              {errors.employeeID && (
                <span style={styles.errorMessage}>{errors.employeeID}</span>
              )}
            </div>
            <div style={styles.halfWidth}>
              <label htmlFor="payment" style={styles.label}>
                Payment
              </label>
              <input
                type="text"
                id="payment"
                name="payment"
                placeholder="Amount (e.g., 2500.00)"
                value={formData.payment}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.payment ? styles.inputError : {}),
                }}
              />
              {errors.payment && (
                <span style={styles.errorMessage}>{errors.payment}</span>
              )}
            </div>
          </div>

          {/* Due Date and Status in one row */}
          <div style={styles.formRow}>
            <div style={styles.halfWidth}>
              <label htmlFor="date" style={styles.label}>
                Due Date<span style={styles.required}>*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.date ? styles.inputError : {}),
                }}
              />
              {errors.date && (
                <span style={styles.errorMessage}>{errors.date}</span>
              )}
            </div>
            <div style={styles.halfWidth}>
              <label htmlFor="status" style={styles.label}>
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={styles.select}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div style={styles.formActions}>
            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                ...(isHovered ? styles.submitBtnHover : {}),
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
