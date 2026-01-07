import mongoose from "mongoose";
import { DB_name } from "../utils/constants.js";
import express from "express"

const ConnectionDB = async ()=>{
    const app = express()
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}/${DB_name}`)
        console.log(`mongodb connected successfully!!}`)
        app.on("error", (err) => {
      console.error("Server error:", err)
    //   throw err;
    })
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}\n${conn.connection.host}`);
        app.get("./", (req, res) => {
          res.send("API is running....")
        })
  }) 
        
    } catch (error) {
        console.error("MONGODB CONNECTION FAILED",error)
    }
}
export default ConnectionDB
