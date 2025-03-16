const mongoose = require("mongoose");

const dburl="mongodb+srv://u4656mee:4656377@cluster0.pqxma.mongodb.net/Inventory_&_Resource_Management?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set("strictQuery",true,"useNewUrlParser",true);

const connection = async() => {
    try{

    await mongoose.connect(dburl);
    console.log("MongoDB Connected")

    }catch(e){
        console.error(e.message);
        process.exit();

    }
}

module.exports = connection;