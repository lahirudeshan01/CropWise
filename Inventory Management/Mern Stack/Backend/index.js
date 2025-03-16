const express = require("express");
const dbConnection = require("./config/db");
const inventoryRoutes = require("./routes/inventory&resource");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Enable CORS
app.use(cors({ origin: true, credentials: true }));

// DB Connection
dbConnection();

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => res.send("Hello World"));
app.use("/api/inventory", inventoryRoutes);

const PORT = 3000;

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));