import React, { useState } from "react";
import axios from "axios";

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

  const styles = {
    taskFormContainer: {
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      padding: "32px",
      maxWidth: "520px",
      margin: "40px auto",
    },
    heading: {
      marginTop: 0,
      marginBottom: "28px",
      color: "#222",
      fontWeight: 600,
      fontSize: "2rem",
      letterSpacing: "-1px",
    },
    formGroup: {
      marginBottom: "18px",
    },
    formRow: {
      display: "flex",
      gap: "20px",
      marginBottom: "18px",
    },
    halfWidth: {
      flex: "1 1 0",
    },
    label: {
      display: "block",
      marginBottom: "6px",
      fontWeight: 500,
      color: "#222",
      fontSize: "1rem",
    },
    required: {
      color: "#e53935",
      marginLeft: "4px",
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "1rem",
      background: "#fafbfc",
      transition: "border-color 0.3s",
    },
    select: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "1rem",
      background: "#fafbfc",
      appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23333' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3'/%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 10px center",
      backgroundSize: "12px",
      paddingRight: "30px",
    },
    inputError: {
      borderColor: "#e53935",
      background: "#fff6f6",
    },
    errorMessage: {
      color: "#e53935",
      fontSize: "0.93rem",
      marginTop: "3px",
      display: "block",
    },
    formActions: {
      marginTop: "30px",
      textAlign: "right",
    },
    submitBtn: {
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      padding: "12px 32px",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: 600,
      boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
      transition: "background 0.2s",
    },
    submitBtnHover: {
      backgroundColor: "#388e3c",
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
    if (!formData.employeeID.trim()) newErrors.employeeID = "Employee ID is required";
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
    <div style={styles.taskFormContainer}>
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
          {errors.title && <span style={styles.errorMessage}>{errors.title}</span>}
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
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.category && <span style={styles.errorMessage}>{errors.category}</span>}
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
            {errors.employeeID && <span style={styles.errorMessage}>{errors.employeeID}</span>}
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
            {errors.payment && <span style={styles.errorMessage}>{errors.payment}</span>}
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
            {errors.date && <span style={styles.errorMessage}>{errors.date}</span>}
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
                <option key={option} value={option}>{option}</option>
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
  );
};

export default TaskForm;
