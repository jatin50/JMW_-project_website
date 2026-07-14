import mongoose from "mongoose";
const cartschema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },
        variantId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        color:{
            type:String,
            required:true
        },
        size:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            default:1
        }
    }],
    TotalPrice:{
        type:Number,
        default:0
    }
},{timestamps: true})
export const Cart = mongoose.model("Cart", cartschema);