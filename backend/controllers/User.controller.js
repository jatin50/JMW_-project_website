import { User } from "../src/models/user.models.js";
import asyncHandler from "../src/utils/AsyncHandler.js";
import { apierrors } from "../src/utils/apierrors.js";
import { apiresponse } from "../src/utils/apiresponse.js";

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
      new apiresponse(200, "User registered successfully", createdUser)
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
 export { RegisterUser , LoginUser, refreshAccessToken, LogoutUser,ChangePassword,GetUser };