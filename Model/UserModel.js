const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,  // Text data
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensures no duplicate emails
        lowercase: true,
        trim: true
    },
    farmName: {
        type: String,
        required: true,
        trim: true
    },
    area: { 
        type: Number,  // Area is usually a number (in acres, hectares, etc.)
        required: true,
        min: 0
    },
    startDate: {
        type: Date,  // Changed to Date type
        required: true
    },
    typeOfRice: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6  // Added validation for minimum password length
    },
});

module.exports = mongoose.model(
    "UserModel", //file name
    userSchema //function name
)