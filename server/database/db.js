import mongoose from "mongoose";

export const connnectDB = () => {
    mongoose.connect(process.env.MONGODB_URI, {
        dbName: "MERN_STACK_LIBRARY_MANAGEMENT_SYSTEM"
    }).then(() => {
        console.log("Database connected successfully");
    }).catch((err) => {
        console.log("Error connecting to database", err);
    });
}