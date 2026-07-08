import mongoose from "mongoose";
import { DB_name } from "../constants.js";

const ConnectionDB = async ()=>{
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}/${DB_name}`)
        console.log(`MongoDB connected!! DB HOST: ${conn.connection.host}`)
        return conn
    } catch (error) {
        console.error("MONGODB CONNECTION FAILED",error)
        process.exit(1)
    }
}
export default ConnectionDB