const mongoose = require("mongoose")

const dburl = "mongodb+srv://glahirudeshan:z0vueIwypul7MVwy@cluster1.kal0bts.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

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