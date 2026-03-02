import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video id is Invalid")
    }

    const comments = await Comment.find({ video: videoId })
        .limit(limit * 1)
        .skip((page - 1) * limit)

    return res
        .status(200)
        .json(
            new ApiResponse(200, comments, "Comments fetched successfully")
        )
})

const addComment = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { commentContent } = req.body

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    if (!commentContent.trim()) {
        throw new ApiError(400, "Comment is required")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const user = req.user

    if (!user) {
        throw new ApiError(401, "Unothorised access please login again")
    }

    const comment = await Comment.create({
        content: commentContent,
        video: videoId,
        owner: user._id
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                comment,
                "Comment Added Successfully"
            )
        )
})

const updateComment = asyncHandler(async (req, res) => {
    
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}