import express from "express";
import path from "path";
import { rootDir } from "../util/path";
import { products } from "./admin";

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("ASd", products);
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

export default router;
