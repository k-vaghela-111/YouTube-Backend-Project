import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controllers.js";

const router = Router()

router.route("/upload-video").post(verifyJWT,
    upload.fields(
        [
            { name: "video", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 }
        ]
    ), publishAVideo)

router.route("/get-all-videos").get(verifyJWT, getAllVideos)

router.route("/:videoId").get(getVideoById)

router.patch(
    "/update-video/:videoId",
    verifyJWT,
    upload.fields([
        { name: "thumbnail", maxCount: 1 }
    ]),
    updateVideo
)

router.route("/delete-video/:videoId").delete(verifyJWT, deleteVideo)
router.route("/publish-video/:videoId").patch(verifyJWT, togglePublishStatus)
export default router