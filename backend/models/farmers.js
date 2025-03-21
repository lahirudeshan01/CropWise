const mongoose = require("mongoose");

const FarmerSchema =  new mongoose.Schema({

    farmerId:{
        type:String,
        required: true
    },

    Character:{
        type:String,
        required: true
    },

    verity:{
        type:String,
        required: true
    },

    quantity:{
        type:String,
        required: true
    },

    price:{
        type:String,
        required: true
    },

    address:{
        type:String,
        required: true
    },

    location:{
        type:String,
        required: true
    },

});

module.exports = mongoose.model ("farmers", FarmerSchema);