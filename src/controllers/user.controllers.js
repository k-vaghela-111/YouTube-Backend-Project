import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // fetch user details  from body
    // Validation - not empty
    // check already exist or not ?
    // check for images and avtar
    // upload them to cloudinary , avtar
    // create user object - create entry in db
    // remove password and refreshToken feilds from response
    // check for user creation
    //return res

    const { fullName, email, username, password } = req.body

    if (!fullName || !email || !username || !password) {
        throw new ApiError(400, "All required fields must be provided.")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "A user with this email or username already exists.")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path; //will provide local path of avtar
    const coverImagePath = req.files?.coverImage[0]?.path;//will provide local path of image

    console.log(avatarLocalPath);
    console.log(coverImagePath);



    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required.")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImagePath);

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar image. Please try again.")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "User registration failed due to a server error.")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {

    // req.body take data
    //username or email check
    //find the user
    //check password
    // access and refresh token genration
    // send cookie

    const {email, password } = req.body

    if (!email) {
        throw new ApiError(400, "Email is required to login.")
    }

    const user = await User.findOne({email})

    if (!user) {
        throw new ApiError(404, "No account found with the provided email or username.")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)//return true || false

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password. Please try again.")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id)
        .select(
            "-password -refreshToken"
        )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully "
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        )

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    // take refresh token from user
    // take refresh token of user from db
    // encrypt the token taken from user
    // check both token are equal
    // generate new refresh and access token

    const incomingRefreshToken = req.user.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token missing. Unauthorized request.")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Unauthorized. Invalid refresh token.")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid or expired refresh token.")
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "AccessToken refreshed successfully"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }


})

const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { password, newPassword, confirmPassword } = req.body

    if (newPassword !== confirmPassword) {
        throw new ApiError(
            401,
            "new passwor must be same as confirm password"
        )
    }

    const user = await User.findById(req.user?._id)

    if (!user) {
        throw new ApiError(401, "User not find please check your email or register your email")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Passwor is incorrect Pleasy try again")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Passwor Changed Successfully"
            )
        )

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword
}
