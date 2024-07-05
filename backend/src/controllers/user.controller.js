import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
//import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async(req, res) => {
    const {userName, email, fullName, password} = req.body;

    if (!email) {email = "";}

    if([fullName, userName, password].some((feild) => feild?.trim() === "")){
        throw new ApiError(400, "All feilds are required");
    }

    const exisitedUser = await User.findOne({
        $or: [{email}, {userName}]
    });

    if(exisitedUser) {throw new ApiError(409, "Already existing username or email");}

    const user = await User.create({
        fullName,
        email,
        password,
        userName: userName
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){throw new ApiError(500, "User not formed");}

    //sending the response
    return res.status(201).json(new ApiResponse(201, createdUser, "New User created sucessfully"));
});

const loginUser =  asyncHandler(async(req, res) => {
    const {userName, email, password} = req.body;

    if(!userName && !email){
        throw new ApiError(400, "Username/Email not provided")
    }

    
    const user = await User.findOne({
        $or: [{userName}, {email}]
    });

    if(!user){throw new ApiError(400, "No user found");}

    if(!(user.isPasswordCorrect(password))){throw new ApiError(401, "Password incorrect");}

    //calling the fn
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    //since the above "user" does not have refreshToken, we will call again without the password and resfesh token
    const loggedUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );


    return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(new ApiResponse(
        200,
        {
            user: loggedUser, 
            refreshToken,
            accessToken
        },
        "User logged in successfully"
    ))
});

export {registerUser}