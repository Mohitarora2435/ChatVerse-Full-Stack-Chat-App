import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

export const ConnectDB= async()=>{
    try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Mongo db connected: ${connection.connection.host}`)
    } catch (error) {
        console.log("Mongo db error:", error);
}
}