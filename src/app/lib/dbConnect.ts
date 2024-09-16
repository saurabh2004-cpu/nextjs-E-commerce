import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject={}

async function dbConnect():Promise<void>{

    if(connection.isConnected){
        console.log("already connected to database")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 45000 // 45 seconds
         }) 

        connection.isConnected = db.connections[0].readyState
        console.log("db connected sucessfully");

    } catch (error) {
        
        console.log("database connection failed",error)
        process.exit(1)
    }
}

export default dbConnect