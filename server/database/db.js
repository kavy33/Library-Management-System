import mongoose from "mongoose";
import { config } from "dotenv";
config({ path: "./config/config.env" });

export const connnectDB = () => {
    mongoose.connect(process.env.MONGODB_URI)
        
    .then(() => {
        console.log("Database connected successfully");
    }).catch((err) => {
        console.log("Error connecting to database", err);
    });
}