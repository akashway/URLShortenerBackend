const mongoose=require('mongoose')


const linkSchema=new mongoose.Schema({
    createdAt:{
        type:Date,
        default: Date.now()
    },
    originalLink:{
        type:String,
        required:true
    },
    shortLink:{
        type:String,
        required:true
    },
    remarks:{
        type:String,
        required:true
    },
    expiryDate:{
        type:Date,
        default:null
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})


const Link=mongoose.model('Link',linkSchema)

module.exports=Link