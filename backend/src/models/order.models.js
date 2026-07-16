import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
     porductId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true,
    },
    variantId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    color:{
        type:String,
        required:true,
    },
    size:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
        default:1,
    }
});
const orderSchema = new mongoose.Schema({
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
        ref:'Address',
        required:true,
    },
    status:{
        type:String,
        enum:["PENDING","CANCELLED","DELIVERED"],
        default:"PENDING",
    },
    paymentMethod:{
    type:String,
    enum:["COD","ONLINE"],
    required:true,
},
razorpayOrderId:{
    type:String,
    required:function(){
        return this.paymentMethod === "ONLINE";
    },
},
    razorpayPaymentId:{
        type:String,
    },
    isPaid:{
        type:Boolean,
        default:false,
    },
    paidAt:{
        type:Date,
    }
}, { timestamps: true });

 export const Order = mongoose.model("Order", orderSchema);