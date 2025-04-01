const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
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
        unique: true,
        lowercase: true,
        trim: true
    },
    farmName: {
        type: String,
        required: true,
        trim: true
    },
    area: { 
        type: Number,
        required: true,
        min: 0
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v instanceof Date && !isNaN(v);
            },
            message: props => `${props.value} is not a valid date!`
        }
    },
    typeOfRice: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
});

// Changed from "UserModel" to "User" to follow Mongoose conventions
module.exports = mongoose.model("User", userSchema);