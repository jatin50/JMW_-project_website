import express, { urlencoded } from "express"
import cors from "cors"
import cookieparser from "cookie-parser"

const app = express();
app.use(cors({
    origin :  process.env.CORS_ORIGIN,
    credentials : true
}))
app.use( express.urlencoded({ extended:true,limit:"16kb"}))
// app.use(express.static({limit:"16kb"}))
app.use(cookieparser())
app.use(express.json());
import  userrouter  from "../routes/Product.routes.js";
app.use("/api/v2/products",userrouter)
export {app}