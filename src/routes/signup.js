import express from "express";
import multer from "multer";
import { conn } from "../index";
import sha256 from "sha256";
const router = express.Router();
const upload = multer();

router.post("/", upload.array(), (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const hashedPassword = sha256.x2(password);
  console.log("password: " + password);
  console.log("hashedPassword: " + hashedPassword);
  const sql = "INSERT INTO user(username, password) VALUES(?, ?)";
  const post = [username, hashedPassword];
  conn.query(sql, post, (err, results, fields) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(results);
      res.redirect("/");
    }
  });
});

export default router;
