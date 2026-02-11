
import { Cart} from"../src/models/cart.models.js";
import asyncHandler from "../src/utils/AsyncHandler.js";
import { apierrors } from "../src/utils/apierrors.js";
import { Product } from "../src/models/product.models.js";
import { apiresponse } from "../src/utils/apiresponse.js";
export const AddToCart = asyncHandler(async(req,res)=>{
    try {
        const product = await Product.findById(req.params.productId)
        if(!product){
            throw new apierrors(404,"Product Not Found")
        }
        let cart = await Cart.findOne({userId:req.user._id})
        if(!cart){
            cart = await Cart.create({
                userId:req.user._id,
                products:[{productId:req.params.productId,quantity:1}],
                TotalPrice:product.price,
            })
        }
        else{
            const productIndex = cart.products.findIndex(p=>p.productId.toString()===req.params.productId)
            if(productIndex>-1){
                cart.products[productIndex].quantity+=1;
                cart.TotalPrice+=product.price;
                await cart.save()
                res.status(200).json(
                    new apiresponse(200,"Product added to cart successfully",cart)
                )
            }
        }
    } catch (error) {
        res.status(error.statusCode||500).json(
            new apiresponse(error.statusCode||500,error.message)
        )
    }
})