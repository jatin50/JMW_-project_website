import { User } from "../src/models/user.models.js";
import asyncHandler from "../src/utils/AsyncHandler.js";
import { apierrors } from "../src/utils/apierrors.js";
import { apiresponse } from "../src/utils/apiresponse.js";
import jwt from "jsonwebtoken"
import crypto from "crypto"
import sendMail from "../src/utils/mailer.js"

const GenerateAccessAndRefreshToken = async(userId)=>{
try {
    const user = await User.findById(userId);
    const AccessToken = user.GenerateAccessToken()
    const RefreshToken = user.GenerateRefreshToken()
    user.RefreshToken = RefreshToken
    await user.save({validateBeforeSave:false})
    return {AccessToken,RefreshToken}

} catch (error) {
    throw new apierrors(500,"Something went wrong while generating access and refresh tokens")
}
}
const RegisterUser = asyncHandler(async(req,res)=>{
    // create user input username email etc from front end
    const{name,email,password,phonenumber}= req.body
    console.log(name)

    // check validation
    if([name, email, password, phonenumber].some(field => !field || field.toString().trim()==="")) {
      throw new apierrors(402,"ALL FIELDS MUST BE FILLED")
    }
    // check if user already exists
    const userExists = await User.findOne({ $or:[{ email }, { name }]});
    if(userExists) {
      throw new apierrors(400, "User already exists");
    }
    //create user on db
    const user = await User.create({
      name,
      email,
       phonenumber,
      password,
    });
    // remove password and tokens from user object
    const createdUser = await User.findById(user._id).select("-password -refreshTokens");
    if(!createdUser) {
      throw new apierrors(500, "something went wrong user not created");
    }
     res.status(201).json(
      new apiresponse(200, createdUser, "User registered successfully")
    );
console.log( "created user:",createdUser)
 });

 const LoginUser = asyncHandler( async(req,res)=> {
    // get details from frontend
    // check if user exists
    // match the password
    // give refreshtoken and accesstoken 
    // remove password and refreshtoken
    // give response
    const{name,password,email}= req.body
    console.log(name)
if(!email||!name){
    throw new apierrors(409,"email or username is required")
}
const user = await User.findOne({ $or:[{name},{email}]})
if(!user){
    throw new apierrors(408,"User not found")
}
 const IsPasswordCorrect = await user.isPasswordCorrect(password)
 if(!IsPasswordCorrect){
    throw new apierrors(408,"invalid user credentials")
 }
   const { AccessToken,RefreshToken} = await GenerateAccessAndRefreshToken(user._id);
   if(!AccessToken||!RefreshToken){
    throw new apierrors(500,"access and refresh tokens are not saved")
   }
   const LoggedUser =  await User.findById(user._id).select("-password -RefreshToken")
   if(!LoggedUser){
    throw new apierrors(502,"user login failed")
   }
   const option ={
    httpOnly: true,
    secure :true

   }
   return res.status(200)
   .cookie("accesstoken",AccessToken,option)
   .cookie("refreshtoken",RefreshToken,option)
   .json(new apiresponse(200,{
     user : LoggedUser,AccessToken,RefreshToken},
    "user logged In successfully"
))

 })

 const LogoutUser = asyncHandler(async(req,res)=>{
await User.findByIdAndUpdate(
  req.user._id,{
    $set:{
    RefreshToken: undefined
  }
  },{
    new: true
  }
)
const option ={
  httpOnly:true,
  secure:true
}
return res.status(200)
   .clearCookie("accesstoken",option)
   .clearCookie("refreshtoken",option)
   .json(new apiresponse(200,{},
    "user logged out successfully"
   ))
 })
 const refreshAccessToken = asyncHandler(async(req,res)=>{
  const incomingRefreshToken = req.cookies?.refreshtoken
  if(!incomingRefreshToken){
    throw new apierrors(401,"Refresh token is missing")
  }
  try{
    const decoded = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decoded._id)
    if(!user){
      throw new apierrors(404,"User not found")
    }
    if(incomingRefreshToken !== user.RefreshToken){
      throw new apierrors(401,"Refresh token is expired or used")
    }
    const { AccessToken,RefreshToken } = await GenerateAccessAndRefreshToken(user._id)
    const option = { httpOnly:true, secure:true }
    return res.status(200)
      .cookie("accesstoken",AccessToken,option)
      .cookie("refreshtoken",RefreshToken,option)
      .json(new apiresponse(200,{AccessToken,RefreshToken},"Access token refreshed"))
  }catch(error){
    throw new apierrors(403,error?.message || "Invalid refresh token")
  }
 })
 const ChangePassword = asyncHandler(async(req,res)=>{
  const {oldPassword,newPassword,confPassword} = req.body
  if(!(confPassword=== newPassword)){
    throw new apierrors(400,"New password must be same as confirm password")
  }
  const user = await User.findById(req.user._id)
  if(!user){
    throw new apierrors(404,"User not found")
  }
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrect){
    throw new apierrors(401,"Old password is incorrect")
  }
  user.password = newPassword
  await user.save({validateBeforeSave:false})
  return res.status(200).json(new apiresponse(200,{},"Password changed successfully"))

 })
 const GetUser = asyncHandler(async(req,res)=>{
  return res.status(200).json(new apiresponse(200,{user:req.user},"User details fetched successfully"))
 })

 const forgotPassword = asyncHandler(async(req,res)=>{
  const { email } = req.body
  if(!email?.trim()){
    throw new apierrors(400,"Email is required")
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() })
  // respond the same way whether or not the user exists, so attackers can't use this to find valid emails
  if(!user){
    return res.status(200).json(new apiresponse(200,{},"If that email exists, a reset link has been sent"))
  }

  const resetToken = crypto.randomBytes(32).toString("hex")
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000 // 15 minutes
  await user.save({ validateBeforeSave:false })

  const resetUrl = `${process.env.CORS_ORIGIN}/reset-password/${resetToken}`

  try{
    await sendMail({
      to: user.email,
      subject: "Reset your password - Jatin Mens Wear",
      html: `<p>Click the link below to reset your password. This link expires in 15 minutes.</p><a href="${resetUrl}">${resetUrl}</a>`
    })
  }catch(error){
    user.resetPasswordToken = undefined
    user.resetPasswordExpiry = undefined
    await user.save({ validateBeforeSave:false })
    throw new apierrors(500,"Failed to send reset email, please try again later")
  }

  return res.status(200).json(new apiresponse(200,{},"If that email exists, a reset link has been sent"))
 })

 const resetPassword = asyncHandler(async(req,res)=>{
  const { token } = req.params
  const { newPassword, confPassword } = req.body

  if(newPassword !== confPassword){
    throw new apierrors(400,"New password must be same as confirm password")
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() }
  })

  if(!user){
    throw new apierrors(400,"Reset link is invalid or has expired")
  }

  user.password = newPassword
  user.resetPasswordToken = undefined
  user.resetPasswordExpiry = undefined
  await user.save()

  return res.status(200).json(new apiresponse(200,{},"Password reset successfully"))
 })

 export { RegisterUser , LoginUser, refreshAccessToken, LogoutUser,ChangePassword,GetUser,forgotPassword,resetPassword };