import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";


const uploadVideo = asyncHandler(async (req, res) => {

    const user = req.user._id

    if (!user) {
        throw new ApiError(403, "User not found or not LoggedIn")
    }

    const { title, description } = req.body || {}

    if (!title || !description) {
        throw new ApiError(402, "all fields are required")
    }

    const videoLocalPath = req.files?.video[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(402, "Failed to upload url of video and thumbnail")
    }

    const videoUrl = await uploadOnCloudinary(videoLocalPath)
    const thumbnailUrl = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoUrl || !thumbnailUrl) {
        throw new ApiError(402, "Error to upload files on cloadinary")
    }

    const video = await Video.create(
        {
            videoFile: videoUrl.url,
            thumbnail: thumbnailUrl.url,
            title: title,
            description: description,
            owner: user,
            duration: videoUrl.duration
        }
    )

    return res.
        status(200)
        .json(
            new ApiResponse(200, video, "Video Uploaded Successfully")
        )
})

export {
    uploadVideo
}

