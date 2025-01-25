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
    status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    },
    expiryDate:{
        type:Date,
        default:null
    },
    clickCount:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

// linkSchema.pre('save', async function (next){
//     console.log("aa")
//     const today=new Date()
//     const links= await this.model('Link').find({expiryDate:{$lte:today}})
//     console.log(links)
//     for(let link of links){
//         console.log(link.expiryDate)
//         console.log(today)
//         console.log(link.status)
//         if(link.expiryDate<today && link.status!=='Inactive'){
//             console.log(link)
//             link.status='Inactive'
//             await link.save()
//         }
//     }
//     next()
// })

const Link=mongoose.model('Link',linkSchema)

module.exports=Link