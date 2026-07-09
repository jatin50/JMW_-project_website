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
app.use("/api/v2/products",productrouter)
app.use("/api/v2/users",userrouter)
export {app}