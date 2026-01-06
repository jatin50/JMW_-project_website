import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true,
    },
    fabric:{
        type:String,
        required:true,
    },
    color:{
        type:Array,
        required:true,
    },
    size:{
        type:Array,
        required:true,
    },
    gsm:{
        type:Number,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
        default:1,
    },
    discount:{
        type:Number,
        required:true,
        default:0,
    }
},{ timestamps: true });

 export const Product = mongoose.model("Product", productSchema);
