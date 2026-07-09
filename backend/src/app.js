import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"
import helmet from "helmet"
import morgan from "morgan"
import rateLimit from "express-rate-limit"

const app = express();
app.use(helmet())
app.use(morgan("dev"))
app.use(cors({
    origin :  process.env.CORS_ORIGIN,
    credentials : true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({ extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieparser())

// throttle repeated login/register attempts to slow down brute-force/spam
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success:false, statuscode:429, message:"Too many attempts, please try again later" }
})

import productrouter from "../routes/Product.routes.js"
import userrouter from "../routes/User.routes.js"
import categoryrouter from "../routes/Category.routes.js"
import addressrouter from "../routes/Address.routes.js"
import orderrouter from "../routes/Order.routes.js"
import errorHandler from "../middleware/Errorhandler.middleware.js"

app.use("/api/v2/users/register", authLimiter)
app.use("/api/v2/users/login", authLimiter)

app.use("/api/v2/products",productrouter)
app.use("/api/v2/users",userrouter)
app.use("/api/v2/categories",categoryrouter)
app.use("/api/v2/addresses",addressrouter)
app.use("/api/v2/orders",orderrouter)

// unmatched routes
app.use((req,res)=>{
  res.status(404).json({ success:false, statuscode:404, message:"Route not found" })
})

// must be registered last - catches every error thrown/passed via next() above
app.use(errorHandler)

export {app}