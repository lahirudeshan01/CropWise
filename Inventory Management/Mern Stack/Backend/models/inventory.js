const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: [
            "Fertilizers",
            "Pesticides",
            "Seeds",
            "Farm Machinery & Tools",
            "Packaging Materials",
            "Pest Control & Storage Protection",
            "Other",
        ],
        default: "Fertilizers"
    },
    itemName: {
        type: String,
        required: true,
    },
    availableAmount: {
        type: Number,
        required: true,
        min: 0, // Ensures the value is not negative
    },
    unit: {
        type: String,
        required: true,
        enum: ["Kg", "Liters", "Units"],
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0, // Ensures the value is not negative
    },
    expirationDate: {
        type: Date,
        required: function() {
            return this.category !== "Farm Machinery & Tools" && this.category !== "Packaging Materials";
        },
        validate: {
            validator: function (value) {
                // Ensure the expiration date is in the future
                return value > Date.now();
            },
            message: "Expiration date must be in the future.",
        },
    },
    notes: {
        type: String,
        default: "", // Optional field
    },
});

module.exports = Inventory = mongoose.model("inventory", InventorySchema);