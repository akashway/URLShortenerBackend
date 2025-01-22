const mongoose = require('mongoose')
const dotenv=require('dotenv')
dotenv.config()


const connectionURL=process.env.DB_URL

const connectDB = async () => {
    try {
        await mongoose.connect(connectionURL)
        console.log("Database Connected Successfully")
    }
    catch(err){
        console.log("Some error occured while connecting with DB",err )
    }
}


module.exports=connectDB