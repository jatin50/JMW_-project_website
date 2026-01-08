import asyncHandler from "../src/utils/AsyncHandler.js";
import { apierrors } from "../src/utils/apierrors.js";
import { apiresponse } from "../src/utils/apiresponse.js";

const UploadProduct = asyncHandler( async(req,res)=>{

// get data from the frontend as your model
// validate the data,check all the fields are filled or not
// check for product images
// upload the product image to imagekit
// create product on db
// return response 

const {price,description,category,fabric,color,size,gsm,stock,discount }= req.body
console.log("price:",price)
if([price,description,category,fabric,color,size,gsm,stock,discount].some((field)=>field?.trim()==="")){
throw new apierrors(402,"ALL FIELDS MUST BE FILLED")
}

})
export{UploadProduct}