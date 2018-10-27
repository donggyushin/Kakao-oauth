import express from "express";
import bodyParser from "body-parser";
import api from "./routes/index";
import mysql from "mysql";
import mysqlKey from "../keys/mysqlKey";
import session from "express-session";
import sessionKey from "../keys/sessionKey";
import mysqlStoreKey from "../keys/mysqlStoreKey";
var MySQLStroe = require("express-mysql-session")(session);
const sessionStore = new MySQLStroe(mysqlStoreKey);

//app
const app = express();
const conn = mysql.createConnection(mysqlKey);
conn.connect();

//variables
let port = 3000;

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(sessionKey));

//settings
app.set("view engine", "ejs");
app.set("views", "./views");

//router
app.use("/api", api);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

//exports

export { sessionStore, conn };

//listen
app.listen(port, () => {
  console.log("Express is listening on port", port);
});
