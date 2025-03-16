const express = require("express");
const router = express.Router();
const Inventory = require("../models/inventory");

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

// @route   POST /api/inventory
// @desc    Add a new inventory item
// @access  Public
router.post("/", async (req, res) => {
    const { category, itemName, availableKilograms, unitPrice, expirationDate, notes } = req.body;

    try {
        const newItem = new Inventory({
            category,
            itemName,
            availableKilograms,
            unitPrice,
            expirationDate,
            notes,
        });

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
    const { category, itemName, availableKilograms, unitPrice, expirationDate, notes } = req.body;

    try {
        let item = await Inventory.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ msg: "Item not found" });
        }

        item.category = category;
        item.itemName = itemName;
        item.availableKilograms = availableKilograms;
        item.unitPrice = unitPrice;
        item.expirationDate = expirationDate;
        item.notes = notes;

        await item.save();
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE /api/inventory/:id
// @desc    Delete an inventory item
// @access  Public
router.delete("/:id", async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ msg: "Item not found" });
        }

        // Use deleteOne() to delete the item
        await Inventory.deleteOne({ _id: req.params.id });
        res.json({ msg: "Item removed" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;