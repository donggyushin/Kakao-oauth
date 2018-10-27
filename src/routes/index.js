import express from "express";
import test from "./test";
import signup from "./signup";
import auth from "./auth";

const router = express.Router();

router.use("/test", test);
router.use("/signup", signup);
router.use("/auth", auth);

export default router;
