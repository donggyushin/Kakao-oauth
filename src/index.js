import express from "express";
import bodyParser from "body-parser";
import api from "./routes/index";
import mysql from "mysql";
import mysqlKey from "../keys/mysqlKey";
import session from "express-session";
import sessionKey from "../keys/sessionKey";
import mysqlStoreKey from "../keys/mysqlStoreKey";
import multer from "multer";
import passport from "passport";
const upload = multer();
var MySQLStore = require("express-mysql-session")(session);

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
app.use(passport.initialize());
app.use(passport.session());

//settings
app.set("view engine", "ejs");
app.set("views", "./views");

//router
app.use("/api", api);
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("index");
  } else {
    res.send("not logined");
  }
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/login", (req, res) => {
  res.render("login");
});

//exports

//listen
app.listen(port, () => {
  console.log("Express is listening on port", port);
});

export { conn, upload };
