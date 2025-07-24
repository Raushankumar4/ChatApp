import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB_URI, {
      dbName: "Chat-App",
    });
    console.log(`MngoDB Connected SuccessFully ${connect.connection.host}`);
  } catch (error) {
    console.log(`Error While Connecting DB${error}`);
    process.exit(1);
  }
};
