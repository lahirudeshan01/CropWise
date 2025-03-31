import React, { useState } from "react";
import axios from "axios"; // Import axios for API calls
import "./TaskForm.css";

const TaskForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    employeeID: "",
    date: "",
    payment: "N/A",
    status: "Unknown",
    // description: "",
  });

  const [errors, setErrors] = useState({});

  const categoryOptions = ["Planting", "Maintenance", "Harvesting"];
  const statusOptions = ["Unknown", "In Progress", "Complete"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.employeeID.trim())
      newErrors.employeeID = "Employee ID is required";
    if (!formData.date) newErrors.date = "Date is required";
    // if (!formData.description.trim())
    //   newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:3000/api/tasks", formData);

      alert("Task assigned successfully!");

      // Reset form
      setFormData({
        title: "",
        category: "",
        employeeID: "",
        date: "",
        payment: "N/A",
        status: "Unknown",
        // description: "",
      });

      // Call onSubmit callback (if provided)
      if (onSubmit) {
        onSubmit(formData);
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to assign task. Please try again.");
    }
  };

  return (
    <div className="task-form-container">
      <h1>Assign New Task</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">
            Task Title<span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? "error" : ""}
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="category">
            Task Category<span className="required">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? "error" : ""}
          >
            <option value="">Select Category</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="error-message">{errors.category}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="employeeID">
            Assign To<span className="required">*</span>
          </label>
          <input
            type="text"
            id="employeeID"
            name="employeeID"
            placeholder="Employee ID (e.g. E10450)"
            value={formData.employeeID}
            onChange={handleChange}
            className={errors.employeeID ? "error" : ""}
          />
          {errors.employeeID && (
            <span className="error-message">{errors.employeeID}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="date">
              Due Date<span className="required">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? "error" : ""}
            />
            {errors.date && (
              <span className="error-message">{errors.date}</span>
            )}
          </div>

          <div className="form-group half-width">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="payment">Payment</label>
          <input
            type="text"
            id="payment"
            name="payment"
            placeholder="Amount or N/A"
            value={formData.payment}
            onChange={handleChange}
          />
        </div>

        

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Assign Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
