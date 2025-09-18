import { Router } from "express";
import {
  createWaterSample,
  getAllWaterSamples,
} from "../controllers/sample.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/")
  .get(verifyJWT, getAllWaterSamples)
  .post(createWaterSample);

export default router;
