import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js"
import mongoose, { isValidObjectId } from "mongoose"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(401, "Video Not Found !!")
    }

    const user = req.user?._id

    if (!user) {
        throw new ApiError(401, "User not found")
    }

    const isVideoLiked = await Like.findOne({ video: videoId, likedBy: user })

    if (!isVideoLiked) {
        await Like.create({
            video: videoId,
            likedBy: user
        })

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Video Liked Successfully"
                )
            )

    }

    await Like.findByIdAndDelete(isVideoLiked._id)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Video Unliked Successfully"
            )
        )
})



export {
    toggleVideoLike,
}