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
            "Pest Control & Storage Protection"
        ],
        default: "Fertilizers"
    },
    itemName: {
        type: String,
        required: true,
    },
    availableKilograms: {
        type: Number,
        required: true,
        min: 0, // Ensures the value is not negative
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0, // Ensures the value is not negative
    },
    expirationDate: {
        type: Date,
        required: true,
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