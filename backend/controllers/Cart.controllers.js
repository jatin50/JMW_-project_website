
import { Cart} from"../src/models/cart.models.js";
import asyncHandler from "../src/utils/AsyncHandler.js";
import { apierrors } from "../src/utils/apierrors.js";
import { Product } from "../src/models/product.models.js";
import { apiresponse } from "../src/utils/apiresponse.js";
const addToCart = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.productId)

    if (!product) {
        throw new apierrors(404, "Product Not Found")
    }

    if (product.stock <= 0) {
        throw new apierrors(400, "Product Out of Stock")
    }

    let cart = await Cart.findOne({ userId: req.user._id })

    if (!cart) {
        cart = await Cart.create({
            userId: req.user._id,
            products: [{
                productId: product._id,
                quantity: 1
            }]
        })
    } else {

        const productIndex = cart.products.findIndex(
            p => p.productId.toString() === product._id.toString()
        )

        if (productIndex > -1) {
            cart.products[productIndex].quantity += 1
        } else {
            cart.products.push({
                productId: product._id,
                quantity: 1
            })
        }
    }
    let total = 0
    for (const item of cart.products) {
        const prod = await Product.findById(item.productId)
        total += prod.price * item.quantity
    }

    cart.TotalPrice = total

    await cart.save()

    return res.status(200).json(
        new apiresponse(200, cart , "Product added to cart successfully")
    )
})
const deleteFromCart = asyncHandler(async(req,res)=>{
    const cart = await Cart.findOne({userId:req.user._id})
    if(!cart){
        throw new apierrors(404,"cart not found")
    }
    const productIndex = cart.products.findIndex(p=>p.productId.toString()===req.params.productId)
   if (productIndex === -1) {
        throw new apierrors(404, "Product not found in cart")
    }
    cart.products.splice(productIndex, 1)
    let total = 0
    for (const item of cart.products) {
        const product = await Product.findById(item.productId)
        total += product.price * item.quantity
    }

    cart.TotalPrice = total
    await cart.save()
    return res.status(200).json(
        new apiresponse(200, cart,"product removed from cart successfully")
    )

})
const getCart = asyncHandler(async(req,res)=>{
    const cart = await Cart.findOne({userId:req.user._id}).populate("products.productId","name price imageUrl color size")
    if(!cart){
        throw new apierrors(404,"cart not found")
    }
    return res.status(200).json(
        new apiresponse(200, cart ,"cart fetched successfully")
    )
})
const decreaseQuantity = asyncHandler(async(req,res)=>{
    const cart = await Cart.findOne({userId:req.user._id})
    if(!cart){
        throw new apierrors(404,"cart not found")
    }
    const productIndex = cart.products.findIndex(p=>p.productId.toString()===req.params.productId)
    if(productIndex>-1){
        if(cart.products[productIndex].quantity>1){
            cart.products[productIndex].quantity -=1;
        }else{
            cart.products.splice(productIndex,1)
        }
    }
    await cart.save()
    return res.status(200).json(
        new apiresponse(200, cart , "product quantity decreased successfully")
    )
})
export{addToCart,deleteFromCart,getCart,decreaseQuantity}