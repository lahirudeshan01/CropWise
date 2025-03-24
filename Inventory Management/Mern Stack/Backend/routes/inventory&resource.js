const express = require("express");
const router = express.Router();
const Inventory = require("../models/inventory");

// @route   GET /api/inventory/:id
// @desc    Get a single inventory item by ID
// @access  Public
// @route   GET /api/inventory
// @desc    Get all inventory items
// @access  Public
router.get("/", async (req, res) => {
    try {
        const inventoryItems = await Inventory.find();
        res.json(inventoryItems);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET /api/inventory/:id
// @desc    Get a single inventory item by ID
// @access  Public
router.get("/:id", async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);
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
// @access  Public
router.post("/", async (req, res) => {
    const { category, itemName, availableAmount, unit, unitPrice, expirationDate, notes } = req.body;

    try {
        const newItem = new Inventory({
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
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// @route   PUT /api/inventory/:id
// @desc    Update an inventory item
// @access  Public
router.put("/:id", async (req, res) => {
    const { category, itemName, availableAmount, unit, unitPrice, expirationDate, notes } = req.body;

    try {
        let item = await Inventory.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ msg: "Item not found" });
        }

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
        res.json(item);
    } catch (err) {
        console.error("Error updating item:", err.message);
        res.status(500).send("Failed to update item. Please try again later.");
    }
});

// @route   DELETE /api/inventory/:id
// @desc    Delete an inventory item
// @access  Public
// @route   DELETE /api/inventory/:id
// @desc    Delete an inventory item
// @access  Public
router.delete("/:id", async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);

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