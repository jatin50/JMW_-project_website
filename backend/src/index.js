import dotenv from "dotenv"
import ConnectionDB from "../db/index.js"
import express from "express"
dotenv.config({
    path: './env'
})
ConnectionDB()
.then(()=>{
    const port = process.env.port||8000;
    const app = express()
    app.get('/', (req, res) => {
        res.send('server is running');
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port} - MERGED FILE`);
    });
    console.log("Database connected successfully");
})
.catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
});

