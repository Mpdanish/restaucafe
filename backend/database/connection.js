import mongoose from "mongoose";
import "dotenv/config"
let isConnected; 

async function connectDB() {
    if (isConnected) {
        console.log("Using existing database connection");
        return;
    }

    if (!process.env.MONGO_URL) {
        throw new Error('MONGO_URL is not defined in environment variables');
    }

    console.log("MongoDB URI:", process.env.MONGO_URL); 
    try {
        mongoose.set("strictQuery", false); 
        mongoose.set('debug', false); 
        const db = await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 15000, 
        });
        isConnected = mongoose.connection.readyState;
        console.log("Database connected successfully!");
    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
    }
}

export default connectDB;