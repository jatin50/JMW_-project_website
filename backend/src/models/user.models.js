import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true,
        lowercase:true,
        trim : true
    },
    password: {
        type: String,
        required: true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim : true
    },
    phonenumber:{
        type:Number,
        required:true,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    },
    AccessToken:{
        type: String,
        // required:true
    },
    RefreshToken:{
        type: String,
        // required:true
    }
},{ timestamps: true });

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()

       this.password= await bcrypt.hash(this.password,10)
next()
})
userSchema.methods.isPasswordCorrect = async function(password){
 return await bcrypt.compare(password,this.password)
}
userSchema.methods.GenerateAccessToken = function(){
   return jwt.sign({
        name : this.name,
        _id: this._id,
        email:this.email,
        phonenumber:this.phonenumber
    },
process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn :process.env.ACCESS_TOKEN_EXPIRY 
}
)
}
userSchema.methods.GenerateRefreshToken = function(){
   return jwt.sign({
        _id: this._id,
    },
process.env.REFRESH_TOKEN_SECRET,
{
    expiresIn :process.env.REFRESH_TOKEN_EXPIRY 
}
)
}
 export const User = mongoose.model('User', userSchema);