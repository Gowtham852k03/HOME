import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => console.log("Database Connected"))
    await mongoose.connect(`${process.env.MONGODB_URI}/home`)
    console.log(`${process.env.MONGODB_URI}/home`)

}

export default connectDB;
