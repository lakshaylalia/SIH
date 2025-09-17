import {Router} from 'express';
import { createReport } from '../controllers/report.controller.js';
import {upload} from '../middlewares/multer.middleware.js';

const router = Router();

router.route("/").post(upload.single("medicalReport"),createReport)

export default router;