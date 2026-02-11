
import { Cart} from"../src/models/cart.models.js";
import asyncHandler from "../src/utils/AsyncHandler.js";
import { apierrors } from "../src/utils/apierrors.js";
import { Product } from "../src/models/product.models.js";
import { apiresponse } from "../src/utils/apiresponse.js";
export const addToCart = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.productId)

    if (!product) {
        throw new apierrors(404, "Product Not Found")
    }

    if (product.countInStock <= 0) {
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
        new apiresponse(200, "Product added to cart successfully", cart)
    )
})
