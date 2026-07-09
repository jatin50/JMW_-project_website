import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"

const app = express();
app.use(cors({
    origin :  process.env.CORS_ORIGIN,
    credentials : true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({ extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieparser())
import productrouter from "../routes/Product.routes.js"
import userrouter from "../routes/User.routes.js"
import categoryrouter from "../routes/Category.routes.js"
import addressrouter from "../routes/Address.routes.js"
import orderrouter from "../routes/Order.routes.js"
import errorHandler from "../middleware/errorHandler.middleware.js"

app.use("/api/v2/products",productrouter)
app.use("/api/v2/users",userrouter)
app.use("/api/v2/categories",categoryrouter)
app.use("/api/v2/addresses",addressrouter)
app.use("/api/v2/orders",orderrouter)

// must be registered last - catches every error thrown/passed via next() above
app.use(errorHandler)

export {app}