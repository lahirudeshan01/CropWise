const express = require("express");
const router = express.Router();
const Inventory = require("../models/inventory");
const Transaction = require("../models/finance");
const auth = require("../middleware/auth"); // Import auth middleware

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/inventory/:id
// @desc    Get a single inventory item by ID
// @access  Private
// @route   GET /api/inventory
// @desc    Get all inventory items for current user
// @access  Private
router.get("/", async (req, res) => {
    try {
        const inventoryItems = await Inventory.find({ userId: req.user._id });
        res.json(inventoryItems);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET /api/inventory/:id
// @desc    Get a single inventory item by ID (for current user)
// @access  Private
router.get("/:id", async (req, res) => {
    try {
        const item = await Inventory.findOne({ _id: req.params.id, userId: req.user._id });
        if (!item) {
            return res.status(404).json({ msg: "Item not found" });
        }
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST /api/inventory
// @desc    Add a new inventory item
// @access  Private
router.post("/", async (req, res) => {
    const { category, itemName, availableAmount, unit, unitPrice, expirationDate, notes } = req.body;

    try {
        const newItem = new Inventory({
            userId: req.user._id, // Add user ID
            category,
            itemName,
            availableAmount,
            unit,
            unitPrice,
            notes,
        });

        // Only set expirationDate if the category requires it
        if (category !== "Farm Machinery & Tools" && category !== "Packaging Materials") {
            newItem.expirationDate = expirationDate;
        }

        const item = await newItem.save();

        // Create expense transaction for inventory only if not Farm Machinery & Tools
        if (category !== "Farm Machinery & Tools") {
            const parsedUnitPrice = parseFloat(unitPrice) || 0;
            const parsedAmount = parseFloat(availableAmount) || 0;
            
            if (parsedUnitPrice > 0 && parsedAmount > 0) {
                const totalCost = parsedUnitPrice * parsedAmount;
                
                const newTransaction = new Transaction({
                    userId: req.user._id, // Add user ID
                    name: `Purchase of ${itemName}`,
                    amount: totalCost,
                    status: 'Outcome',
                    reference: 'Inventory Expense',
                    date: new Date()
                });
                
                try {
                    await newTransaction.save();
                    console.log('Transaction created:', newTransaction);
                } catch (transactionErr) {
                    console.error('Error creating transaction:', transactionErr);
                }
            }
        }

        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   PUT /api/inventory/:id
// @desc    Update an inventory item (for current user)
// @access  Private
router.put("/:id", async (req, res) => {
    const { category, itemName, availableAmount, unit, unitPrice, expirationDate, notes } = req.body;

    try {
        let item = await Inventory.findOne({ _id: req.params.id, userId: req.user._id });

        if (!item) {
            return res.status(404).json({ msg: "Item not found" });
        }

        // Calculate the difference in amount for transaction
        const oldTotal = item.availableAmount * item.unitPrice;
        const newTotal = parseFloat(availableAmount) * parseFloat(unitPrice);
        const costDifference = newTotal - oldTotal;

        // Update fields
        item.category = category;
        item.itemName = itemName;
        item.availableAmount = parseFloat(availableAmount); // Ensure it's a number
        item.unit = unit;
        item.unitPrice = unitPrice;
        item.notes = notes;

        // Only update expirationDate if the category requires it
        if (category !== "Farm Machinery & Tools" && category !== "Packaging Materials") {
            if (expirationDate) {
                const expDate = new Date(expirationDate);
                if (expDate <= new Date()) {
                    return res.status(400).json({ msg: "Expiration date must be in the future." });
                }
                item.expirationDate = expDate;
            } else {
                item.expirationDate = null; // Clear expirationDate if not provided
            }
        } else {
            item.expirationDate = null; // Clear expirationDate for categories that don't require it
        }

        await item.save();

        // Create transaction only if:
        // 1. The category is not "Farm Machinery & Tools"
        // 2. There is a cost difference
        // 3. The cost difference is positive (increase in value)
        if (category !== "Farm Machinery & Tools" && costDifference > 0) {
            const newTransaction = new Transaction({
                userId: req.user._id, // Add user ID
                name: `Inventory Update: ${itemName}`,
                amount: costDifference,
                status: 'Outcome',
                reference: 'Inventory Expense',
                date: new Date()
            });
            
            try {
                await newTransaction.save();
                console.log('Transaction created:', newTransaction);
            } catch (transactionErr) {
                console.error('Error creating transaction:', transactionErr);
            }
        }

        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE /api/inventory/:id
// @desc    Delete an inventory item (for current user)
// @access  Private
router.delete("/:id", async (req, res) => {
    try {
        const item = await Inventory.findOne({ _id: req.params.id, userId: req.user._id });

        if (!item) {
            return res.status(404).json({ msg: "Item not found" });
        }

        await Inventory.deleteOne({ _id: req.params.id });
        res.json({ msg: "Item removed" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;