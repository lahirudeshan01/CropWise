import React, { useState, useEffect } from "react";
import axios from "axios";
import api from '../../api/apiUtils';
import TaskList from "./TaskList";

const ShowAll = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/tasks")
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error getting tasks data:", err);
        setError("Failed to load tasks data. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading tasks data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="tasks-page">
      <h1>Task List</h1>
      <TaskList tasks={tasks} />
    </div>
  );
};

export default ShowAll;
