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
        type: Number,
        required: true,
        min: 0
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
    image: {
        type: String,
        required: false
    }
});

// Method to update quantity when order is placed
FarmerSchema.methods.updateQuantity = function(orderedQuantity) {
    if (this.quantity >= orderedQuantity) {
        this.quantity -= orderedQuantity;
        return this.save();
    } else {
        throw new Error('Insufficient quantity available');
    }
};

module.exports = mongoose.model("farmers", FarmerSchema);
