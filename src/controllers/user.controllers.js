import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"

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

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "user with this email or username already exist !!")
    }


})

export { registerUser }
