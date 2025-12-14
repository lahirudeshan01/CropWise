require("dotenv").config();


const express = require("express");
const http = require("http");
const routes = require("./routes/farmers_set");
const inventoryRoutes = require("./routes/inventory&resource");
const financeRoutes = require('./routes/financeRoutes');
const router = require("./routes/UserRoute");
const routess = require("./routes/tasks");
const orderRoutes = require('./routes/orderset');
const notificationRoutes = require('./routes/notificationRoutes');
const db_connection = require("./config/db_connection");
const socketIO = require('./config/socketio'); // Import the Socket.IO config
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors({
  origin: 'https://cropwise.kgkpr.online',
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = socketIO.init(server);

// Store io instance in app for use in routes
app.set('socketio', io);

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
app.use("/api/tasks", routess);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 3000;


// Use server.listen instead of app.listen for Socket.IO to work
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));