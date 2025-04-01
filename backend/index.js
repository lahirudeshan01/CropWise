const express = require("express");
const routes = require("./routes/farmers_set");
const inventoryRoutes = require("./routes/inventory&resource")
const financeRoutes = require('./routes/financeRoutes');
const router = require("./routes/UserRoute");
const db_connection = require("./config/db_connection");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(cors({ origin: true, credentials: true }));

// Database connection
db_connection();

// Parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("Hello..."));
app.use("/api/farmers", routes);
app.use("/api/inventory", inventoryRoutes);
app.use('/api', financeRoutes);
app.use("/users", router);

const PORT = 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
