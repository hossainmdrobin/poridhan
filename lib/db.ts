import mongoose from "mongoose";


let isConnected = false;

export const connectToDB = async () => {
    if (isConnected) {
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log("Connected to the database");
        return connect;

    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    isConnected = false;
    console.log("Disconnected from the database");
});

mongoose.connection.on("connected", () => {
    isConnected = true;
    console.log("Reconnected to the database");
});

mongoose.connection.on("error", (err) => {
    isConnected = false;
    console.error("Database connection error:", err);
});     

export default connectToDB;