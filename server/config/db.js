import mongoose from "mongoose"

export const connectDB = async() => {
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MONGODB CONNECTED SUCCESSFULLY ${connectionInstance.connection.host}`)
    }
    catch(error){
        console.error("DB Connection failed : " , error.message);
        process.exit(1);
    }
}