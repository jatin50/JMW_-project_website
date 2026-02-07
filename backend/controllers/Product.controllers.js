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

const {name,price,description,fabric,color,size,gsm,stock,discount }= req.body
console.log("price:",price)
if([price,description,fabric,color,size,gsm,stock,discount].some((field)=>field?.trim()==="")){
throw new apierrors(402,"ALL FIELDS MUST BE FILLED")
}
const ProductLocalPath = req.file?.path
console.log("Product Local Path",ProductLocalPath)
if(!ProductLocalPath){
    throw new apierrors(409," product Image is required")
}
const ProductImage = await uploadToImageKit(ProductLocalPath)
if(!ProductImage){
    throw new apierrors(409," product Image is required")
} 
 const product =  await Product.create({
name,
 price,
description,
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
 return  await res.status(200).json(
    new apiresponse( 200,product,"Product Uploaded Successfully")
)
c


})
 const getProducts =  asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 12
  const skip = (page - 1) * limit

  let filter = {}

  //  Search
  if (req.query.keyword) {
    filter.name = {
      $regex: req.query.keyword,
      $options: "i"
    }
  }

  //  Category
  if (req.query.category) {
    filter.category = req.query.category
  }

  //  Price Filter
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {}
    if (req.query.minPrice) {
      filter.price.$gte = Number(req.query.minPrice)
    }
    if (req.query.maxPrice) {
      filter.price.$lte = Number(req.query.maxPrice)
    }
  }

  //  Sorting
  let sortOption = { createdAt: -1 } 

  if (req.query.sort === "priceLow") {
    sortOption = { price: 1 }
  }

  if (req.query.sort === "priceHigh") {
    sortOption = { price: -1 }
  }

  //  Total count
  const totalProducts = await Product.countDocuments(filter)

  const products = await Product.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)

  res.status(200).json(
      new apiresponse(200,{
          products,
          currentPage: page,
          totalPages: Math.ceil(totalProducts / limit),
          totalProducts,
          hasMore: page < Math.ceil(totalProducts / limit)

      })
    )
})

export{UploadProduct,getProducts}