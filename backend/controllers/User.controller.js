import { User } from "../src/models/user.models.js";
import asyncHandler from "../src/utils/AsyncHandler.js";
import { apierrors } from "../src/utils/apierrors.js";
import { apiresponse } from "../src/utils/apiresponse.js";

const registerUser = asyncHandler(async(req, res) => {
  res.status(200).json(
    new apiresponse(true, "User registered successfully")
  );
    // create user input username email etc from front end
    const { username, email, password, phonenumber } = req.body;
console.log(req.body);
    // check validation
    if([
      username, email, password, phonenumber].some(field => !field)) {
      res.status(400);
      throw new apierrors("Please fill in all required fields");
    }
    // check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if(userExists) {
      throw new apierrors(400, "User already exists");
    }
    //create user on db
    const user = await User.create({
      username,
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
      new apiresponse(true, "User registered successfully", createdUser)
    );

 });
 export { registerUser };