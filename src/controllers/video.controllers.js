import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import fs from "fs"


const getAllVideos = asyncHandler(async (req, res) => {

    const {
        page = 1,
        limit = 10,
        query,
        sortBy = "createdAt",
        sortType = "desc",
        userId
    } = req.query

    const match = {}

    if (query) {
        match.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }

    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid user id")
        }
        match.owner = new mongoose.Types.ObjectId(userId)
    }

    const sort = {
        [sortBy]: sortType === "asc" ? 1 : -1
    }

    const aggregate = Video.aggregate([
        { $match: match },

        { $sort: sort },

        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },

        {
            $addFields: {
                owner: { $first: "$owner" }
            }
        }
    ])

    const options = {
        page: Number(page),
        limit: Number(limit)
    }

    const videos = await Video.aggregatePaginate(aggregate, options)

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    )
})


const publishAVideo = asyncHandler(async (req, res) => {

    const user = req.user?._id

    if (!user) {
        throw new ApiError(401, "User not authorized")
    }

    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }

    const videoLocalPath = req.files?.video?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video and thumbnail are required")
    }

    const videoUpload = await uploadOnCloudinary(videoLocalPath)
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoUpload || !thumbnailUpload) {
        throw new ApiError(500, "Cloudinary upload failed")
    }

    fs.unlinkSync(videoLocalPath)
    fs.unlinkSync(thumbnailLocalPath)

    const video = await Video.create({
        videoFile: videoUpload.secure_url,
        thumbnail: thumbnailUpload.secure_url,
        title,
        description,
        owner: user,
        duration: videoUpload.duration
    })

    return res.status(201).json(
        new ApiResponse(201, video, "Video uploaded successfully")
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

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    )
})


const updateVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { title, description } = req.body

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const user = req.user

    if (!user) {
        throw new ApiError(401, "Unauthorized user")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (!video.owner.equals(user._id)) {
        throw new ApiError(403, "You are not allowed to update this video")
    }

    let thumbnailUrl

    if (req.file?.path) {
        const uploadedThumbnail = await uploadOnCloudinary(req.file.path)

        if (!uploadedThumbnail) {
            throw new ApiError(500, "Thumbnail upload failed")
        }

        thumbnailUrl = uploadedThumbnail.secure_url
    }

    const updateData = {
        title: title || video.title,
        description: description || video.description
    }

    if (thumbnailUrl) {
        updateData.thumbnail = thumbnailUrl
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateData },
        { new: true }
    )

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    )
})


const deleteVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const user = req.user

    if (!user) {
        throw new ApiError(401, "Unauthorized user")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (!video.owner.equals(user._id)) {
        throw new ApiError(403, "You are not allowed to delete this video")
    }

    await Video.findByIdAndDelete(videoId)

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const user = req.user

    if (!user) {
        throw new ApiError(401, "Unauthorized user")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (!video.owner.equals(user._id)) {
        throw new ApiError(403, "You are not allowed to change publish status")
    }

    video.isPublished = !video.isPublished

    await video.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            `Video ${video.isPublished ? "Published" : "Unpublished"} successfully`
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

