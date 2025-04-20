const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    employeeID: {
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    payment:{
        type:String,
        required: true,
    },
    status:{
        type:String,
        required: true,
    }
    
});

module.exports = Task = mongoose.model("Task", TaskSchema);