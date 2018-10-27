import express from "express";
import bodyParser from "body-parser";
import api from "./routes/index";

//app
const app = express();

//variables
let port = 3000;

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//settings
app.set("view engine", "ejs");
app.set("views", "./views");

//router
app.use("/api", api);

app.get("/", (req, res) => {
  res.render("index");
});

//listen
app.listen(port, () => {
  console.log("Express is listening on port", port);
});
