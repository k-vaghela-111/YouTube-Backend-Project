import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { isValidObjectId } from "mongoose";


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query

    const filter = {}

    if (query) {
        filter.title = { $regex: query, $options: "i" }
    }

    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid user id")
        }
        filter.owner = userId
    }

    const videos = await Video.find(filter)
        .sort({ [sortBy]: sortType === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"))
})


const publishAVideo = asyncHandler(async (req, res) => {

    const user = req.user._id

    if (!user) {
        throw new ApiError(403, "User not found or not LoggedIn")
    }

    const { title, description } = req.body || {}

    if (!title || !description) {
        throw new ApiError(402, "all fields are required")
    }

    const videoLocalPath = req.files?.video?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(401, "Failed to upload url of video and thumbnail")
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

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                video,
                "Video fetched successfully "
            )
        )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body

    console.log("title : ", title);


    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video id is invalid")
    }

    const user = req.user

    if (!user) {
        throw new ApiError(401, "Not an authorized user , please login")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(401, "Video not found in database")
    }

    if (user._id.toString() !== video.owner.toString()) {
        throw new ApiError(403, "You are not allowed to change the details of video")
    }

    let thumbnailUrl

    if (req.file?.path) {
        const thumbnail = await uploadOnCloudinary(req.file.path)
        thumbnailUrl = thumbnail.url
    }

    const updateData = {
        title,
        description
    }

    if (thumbnailUrl) {
        updateData.thumbnail = thumbnailUrl
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateData },
        { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedVideo,
                "Details updated successfully"
            )
        )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video id is invalid")
    }

    const user = req.user

    if (!user) {
        throw new ApiError(401, "Not an authorized user , please login")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(401, "Video not found in database")
    }

    if (user._id.toString() !== video.owner.toString()) {
        throw new ApiError(403, "You are not allowed to delete the video")
    }

    await Video.findByIdAndDelete(videoId)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Video deleted successfully"
            )
        )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video id is invalid")
    }

    const user = req.user

    if (!user) {
        throw new ApiError(401, "Not an authorized user , please login")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(401, "Video not found in database")
    }

    if (user._id.toString() !== video.owner.toString()) {
        throw new ApiError(403, "You are not allowed to change publish status")
    }

    video.isPublished = !video.isPublished

    await video.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            "Publish status updated successfully"
        )
    )

})



export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}

