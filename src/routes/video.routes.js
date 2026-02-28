import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { uploadVideo } from "../controllers/video.controllers.js";

const router = Router()

router.route("/upload-video").post(verifyJWT,
    upload.fields(
        [
            { name: "video", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 }
        ]
    ), uploadVideo)


export default router