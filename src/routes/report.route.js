import {Router} from 'express';
import { createReport } from '../controllers/report.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import {verifyJWT} from "../middlewares/auth.middleware.js"
 
const router = Router();

router.route("/").post(upload.single("medicalReport"),verifyJWT, createReport)

export default router;