import mongoose from "mongoose";

const connection = {
  isConnected: false,
};

const connectToDB = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already connected to MongoDB.");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);

    connection.isConnected = conn.connection.readyState === 1;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.log("[ERROR] :>> ", error);
  }
};

export default connectToDB;
