import express from "express";
import multer from "multer";
const router = express.Router();
const upload = multer();

router.post("/", upload.array(), (req, res) => {
  console.log(req.body.contents);
  return res.json({
    success: true
  });
});

router.get("/:id", (req, res) => {
  console.log("reading post ", req.params.id);
  return res.json({
    index: req.params.id
  });
});

export default router;
