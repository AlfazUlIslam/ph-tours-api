import mongoose from "mongoose";

const connectDatabase = async (uri: string) => {
    try {
        const conn = await mongoose.connect(uri);
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Failed to connect to database", error);
        process.exit(1);
    }
};

export default connectDatabase;