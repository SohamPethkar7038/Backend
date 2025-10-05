import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// registrating the users


const registerUser=asyncHandler(async(req,res)=> {
    // get user details from frontend (postman)
    // validation (check email id or some data is not empty)
    // check if user already exists : checck by email id and username 
    // check for images and check for avtar
    // upload them to cloudinary and then check if avtar is uploaded in cloudinary
    // create user objects  --> create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response.

    

    const {fullName,email,userName,password}=req.body
    console.log("email :",email);

    // if(fullName==="") {
    //     throw new ApiError(400,"Fullname is required")
    // }

    if(
        [fullName,email,userName,password].some((field)=>
            field?.trim()==="" )
    )
    {
        throw new ApiError(400,"all fields aree required");
    }

    const existedUser=User.findOne({
        $or:[{email},{userName}]
    })

    if(existedUser){
        throw new ApiError(409,"user with email or username already existed ")
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;

    const coverImageLocalPath=req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar file is required ");
    }

   const avatar= await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(avatar){
        throw new ApiError(400,"avatar file is required ");
    }

    User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || " ",
        email,
        userName:userName.toLowerCase(),
        password
    })

    const createdUser=await User.findById(User._id).select(
        "-password -refreshToken"
    )
})


export {registerUser}