const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const Transaction = require("../models/finance");
const Salary = require("../models/salary");

//test
router.get("/test",(req,res)=>res.send("Tasks routes working"));

// Add a new task
router.post("/", async (req, res) => {
    try {
        const { title, category, employeeID, date, payment, status } = req.body;

        // Create the task
        const newTask = new Task({
            title,
            category,
            employeeID,
            date,
            payment,
            status: status || "Unknown"
        });

        // Save the task
        const savedTask = await newTask.save();

        // Create a transaction for the salary payment with current date and time
        const transaction = new Transaction({
            name: `${employeeID}-${category}`, // Employee ID with task category
            category: 'Salary Payment',
            amount: parseFloat(payment),
            date: new Date(), // Current date and time
            status: 'Outcome',
            reference: 'Salary Payment'
        });

        // Save the transaction
        await transaction.save();

        // Get the month and year from the task date
        const taskDate = new Date(date);
        const monthYear = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}`;

        // Calculate EPF and ETF
        const basicSalary = parseFloat(payment);
        const epf = basicSalary * 0.08;
        const etf = basicSalary * 0.03;
        const netSalary = basicSalary - epf;

        // Update or create salary record
        const salary = await Salary.findOneAndUpdate(
            { employeeId: employeeID, monthYear: monthYear },
            {
                $inc: { basicSalary: basicSalary },
                $push: { transactionRefs: transaction._id },
                $setOnInsert: {
                    epf: epf,
                    etf: etf,
                    netSalary: netSalary,
                    status: 'Pending'
                }
            },
            { upsert: true, new: true }
        );

        res.status(201).json({
            success: true,
            message: 'Task assigned and salary updated successfully',
            task: savedTask,
            transaction: transaction,
            salary: salary
        });

    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to assign task',
            error: error.message
        });
    }
});

// Get all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find().sort({ date: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(400).json({ msg: "No tasks found" });
    }
});

// Get a specific task
router.get("/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        res.status(400).json({ msg: "Cannot find this task" });
    }
});

// Update a task
router.put("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }
        res.json({ msg: "Update successfully", task });
    } catch (error) {
        res.status(400).json({ msg: "Update failed" });
    }
});

// Delete a task
router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }
        res.json({ msg: "Deleted Successfully" });
    } catch (error) {
        res.status(400).json({ msg: "Cannot be Delete" });
    }
});

module.exports = router;