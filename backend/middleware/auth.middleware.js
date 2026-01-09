import { User } from "../src/models/user.models.js";
import asyncHandler from "../src/utils/AsyncHandler.js";
import { apierrors } from "../src/utils/apierrors.js";
import jwt from "jsonwebtoken"
  export const VerifyJwt = asyncHandler(async( req,_,next)=>{
 const token = req.cookie?.AccessToken||req.header("Authorization").replace(" Bearer" , "")
 try {
    if(!token){
       throw new apierrors(300,"Unauthorized request")
    }
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
      const user = await User.findById(decodedToken._id).select("-password RefreshToken")
      if(!user){
       throw new apierrors(400,"Invalid accesstoken")
      }
      req.user = user
 } catch (error) {
    throw new apierrors(400,"invalid access token")
 }
next()
 })