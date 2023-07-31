const bodyParser = require("body-parser");
const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");
const path = require("path");

//Adding dotenv to use environment variables
require("dotenv").config();

//create express app
const app = express();
const port = 3000;
//parsing middleware
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());
//static files
app.use(express.static("public"));
//set views file
//template engine
app.engine("hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", "hbs");

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // adjust as needed
  host: "127.0.0.1",
  user: "admin",
  password: "",
  database: "worldbankdata",
});

//connect to database
pool.getConnection((err, connection) => {
  if (err) throw err; //not connected
  console.log("Connected as ID " + connection.threadId);
});
const routes = require("./server/routes/user");
app.use("/", routes);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
