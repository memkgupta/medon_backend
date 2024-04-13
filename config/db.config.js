// Import required modules
import mongoose from "mongoose";

// MongoDB connection string
const mongoURI = process.env.DB_URI;


// Connect to MongoDB
const connect = async()=>{
    try {
         await mongoose.connect(mongoURI);
         console.log('Mongo db  connected')
         const connection = mongoose.connection;
    //    connection.on('connect')
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
 }
// Export the Mongoose connection
export default connect;
