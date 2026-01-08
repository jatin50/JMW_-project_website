import asyncHandler from "../src/utils/AsyncHandler.js";
import { apierrors } from "../src/utils/apierrors.js";
import { apiresponse } from "../src/utils/apiresponse.js";
import uploadToImageKit from "../src/utils/imagekit.js";
import { Product } from "../src/models/product.models.js";
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
const ProductLocalPath = req.files?.Product[0]?.path
if(!ProductLocalPath){
    throw new apierrors(409," product Image is required")
}
const ProductImage = await uploadToImageKit(ProductLocalPath)
if(!ProductImage){
    throw new apierrors(409," product Image is required")
} 
 const product =  await Product.create({
price,
description,
category,
fabric,
color,
size,
gsm,
stock,
discount,
imageUrl:ProductImage.url
 })
 if(!product){
    throw new apierrors(500,"Product is Not Uploaded Successfully Please Try Again")
 }
 return res.status(200).json(
    new apiresponse( 200,product,"Product Uploaded Successfully")
)
})
export{UploadProduct}