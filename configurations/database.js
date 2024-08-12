const mongoose =require('mongoose')
const colors= require('colors')

const connectDB= async()=>{
    try{
        const connect= await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to the MongoDB Database ${connect.connection.host}`)
    }catch(error){
        console.log(`Error in Mongodb ${error}`.bgRed.white)
    }
}

module.exports = connectDB;