import express from "express";
import test from "./test";
import signup from "./signup";

const router = express.Router();

router.use("/test", test);
router.use("/signup", signup);

export default router;
