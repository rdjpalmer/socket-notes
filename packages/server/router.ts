import path from "path";
import express, { Application as ExpressApplication } from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// router.get("/editor", (req, res) => {
//   res.sendFile(__dirname + "../editor/build/index.html");
// });

router.use("static", express.static(path.join(__dirname, "../editor/build/static")));

export default router;