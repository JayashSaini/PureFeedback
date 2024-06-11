import mongoose, { mongo } from "mongoose";

interface ConnectionType {
  isConnected?: number;
}

const connection: ConnectionType = {};

export const connectDB = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already Database connected!");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");

    connection.isConnected = db.connections[0].readyState;

    console.log("Database connected successfully!");
  } catch (error) {
    console.log("Database connection Failed : " + error);
    process.exit(1);
  }
};
