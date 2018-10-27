import express from "express";
import { conn } from "../index";
import passport from "passport";
import sha256 from "sha256";
import kakaoKey from "../../keys/kakaoKey";
const LocalStrategy = require("passport-local").Strategy;
const KakaoStrategy = require("passport-kakao").Strategy;
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
  "kakao-login",
  new KakaoStrategy(kakaoKey, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    const NewUserId = "kakao:" + profile.id;
    const NewUserPassword = sha256.x2(NewUserId);
    //해당 id를 가진 user가 존재하는지 찾아본다.
    const sql = "select * from user where username = ?";
    const post = [NewUserId];
    conn.query(sql, post, (err, results, fields) => {
      if (err) {
        console.log(err);
        done(err);
      }
      //만약 해당 유저가 존재하지 않는다면,
      //새로운 아이디를 하나 만들어주고 로그인을 시켜줌.
      if (results.length === 0) {
        const sql = "INSERT user(username, password) values(?,?)";
        const post = [NewUserId, NewUserPassword];
        conn.query(sql, post, (err, results, fields) => {
          if (err) {
            console.log(err);
            done(err);
          }
          //가입이 되었다면 해당 유저로 바로 로그인시켜줌
          const sql = "SELECT * FROM user where username =?";
          const post = [NewUserId];
          conn.query(sql, post, (err, results, fields) => {
            if (err) {
              console.log(err);
              done(err);
            }
            const user = results[0];
            return done(null, user);
          });
        });
      } else {
        //이미 유저가 존재한다면 바로 로그인시켜줌.
        const user = results[0];
        return done(null, user);
      }
    });
  })
);

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

router.get("/kakao", passport.authenticate("kakao-login"));
router.get(
  "/kakao/callback",
  passport.authenticate("kakao-login", {
    successRedirect: "/",
    failureRedirect: "/api/auth/fail"
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
