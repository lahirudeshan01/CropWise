const mongoose = require("mongoose")

const dburl = "mongodb+srv://sethmidu:1234567890s@itpcluster1.x6bkl.mongodb.net/?retryWrites=true&w=majority&appName=itpcluster1";

mongoose.set("strictQuery",true,"useNewUrlParser",true);

const connection = async () => {
    try {
        await mongoose.connect(dburl);
        console.log("MongoDB Connected");
    } catch (e) {
        console.error(e.message);
        process.exit();
    }
};

module.exports = connection;