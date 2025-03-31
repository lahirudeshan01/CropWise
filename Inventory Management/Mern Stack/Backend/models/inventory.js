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
        min: 0,
    },
    unit: {
        type: String,
        required: true,
        enum: ["Kg", "Liters", "Units"],
    },
    unitPrice: {
        type: Number,
        required: function() {
            return this.category !== "Farm Machinery & Tools" && 
                   this.category !== "Packaging Materials" && 
                   this.category !== "Other";
        },
        min: 0,
    },
    expirationDate: {
        type: Date,
        required: function() {
            return this.category !== "Farm Machinery & Tools" && 
                   this.category !== "Packaging Materials" && 
                   this.category !== "Other";
        },
        validate: {
            validator: function (value) {
                if (this.category !== "Farm Machinery & Tools" && 
                    this.category !== "Packaging Materials" && 
                    this.category !== "Other") {
                    return value > Date.now();
                }
                return true;
            },
            message: "Expiration date must be in the future.",
        },
    },
    notes: {
        type: String,
        default: "",
    },
});

module.exports = Inventory = mongoose.model("inventory", InventorySchema);