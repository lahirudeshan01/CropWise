//pw = hIL5W19dr8NtSFGi
const express = require("express");
const mongoose = require("mongoose");
const router = require("./Route/UserRoute");
const app = express();

//Middleware
app.use(express.json());
app.use("/users",router);


mongoose.connect("mongodb+srv://admin:hIL5W19dr8NtSFGi@cluster0.mjta8.mongodb.net/")
.then(()=> console.log("connect to MongoDB"))
.then(()=> {
    app.listen(5000);
})
.catch((err)=> console.log((err)));