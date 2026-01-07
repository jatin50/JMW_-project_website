import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phonenumber:{
        type:Number,
        required:true,
    },
    address:{
        type:[
            {
                addressLine1: { type: String, required: true },
                addressLine2: { type: String },
                city: { type: String, required: true },
                state: { type: String, required: true },
                pincode: { type: Number, required: true },
                country: { type: String, required: true },
                district: { type: String, required: true },
                
            }
        ]
    }
},{ timestamps: true });

 export const User = mongoose.model('User', userSchema);

