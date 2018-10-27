import express from "express";
import { conn } from "../index";
import passport from "passport";
import sha256 from "sha256";
const LocalStrategy = require("passport-local").Strategy;
const router = express.Router();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const sql = "select * from user where id =?";
  const post = [id];
  conn.query(sql, post, (err, results, fields) => {
    const user = results[0];
    done(err, user);
  });
});

passport.use(
  new LocalStrategy((username, password, done) => {
    const sql = "select * from user where username =?";
    const hashedPassword = sha256.x2(password);
    const post = [username];
    conn.query(sql, post, (err, results, fields) => {
      if (err) {
        console.log(err);
        return done(err);
      }
      const user = results[0];
      if (hashedPassword !== user.password) {
        return done(null, false);
      } else {
        done(null, user);
      }
    });
  })
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/api/auth/fail",
    failureFlash: false
  })
);

router.get("/fail", (req, res) => {
  res.send("wrong access, please check username and password again");
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

export default router;
