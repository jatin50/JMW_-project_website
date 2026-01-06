import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
     porductId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
        default:1,
    }
});
const categorySchema = new mongoose.Schema({
   orderprice:{
        type:Number,
        required:true,
    },
    orderitems:[itemSchema],
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    address:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User.address',
        required:true,
    },
    status:{
        type:String,
        enum:["PENDING","CANCELLED","DELIVERED"]
    }
}, { timestamps: true });

 export const Category = mongoose.model("Category", categorySchema);