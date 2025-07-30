const mongoose = require("mongoose");

const FarmerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farmerId: {
        type: String,
        required: true
    },
    Character: {
        type: String,
        required: true
    },
    verity: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: { // Add this field
        type: String,
        required: false
    }
});

module.exports = mongoose.model("farmers", FarmerSchema);
