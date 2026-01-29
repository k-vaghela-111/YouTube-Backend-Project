import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshTokens = async (userId) => {

    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(401, "Error while generating Access and Refresh Tokens")
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
        throw new ApiError(400, "All feilds are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "user with this email or username already exist !!")
    }

    const avtarLocalPath = req.files?.avtar[0]?.path; //will provide local path of avtar

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avtarLocalPath) {
        throw new ApiError(400, "Avtar file is required ")
    }

    const avtar = await uploadOnCloudinary(avtarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avtar) {
        throw new ApiError(400, "Avtar file is required ")
    }

    const user = await User.create({
        fullName,
        avtar: avtar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
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

    const { username, email, password } = req.body

    if (!username || !email) {
        throw new ApiError(400, "Username or Email is Required")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        throw new ApiError(404, "User with this email or username not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)//return true || false

    if (!isPasswordValid) {
        throw new ApiError(401, "Password is invalid ")
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

export {
    registerUser,
    loginUser
}
