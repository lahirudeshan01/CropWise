const express = require("express");
const routes = require("./routes/farmers_set");
const db_connection = require("./config/db_connection");
const bodyParser = require ("body-parser");
const cors = require("cors");


const app = express ();
app.use(cors({ origin: true, credentials: true }));

//dbconnection
db_connection();

// Parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get ("/", (req,res) =>res.send("Hello..."));
app.use ("/api/farmers", routes);

const PORT = 3000;

app.listen(PORT,() => console.log(`server running port ${PORT}`));