const express=require('express')
const cors=require('cors')
const bodyParser=require('body-parser')
const app=express()
const dotenv=require('dotenv')
dotenv.config()
const connectDB=require('./db')
const userRouter=require('./routes/userRouter')
const linkRouter=require('./routes/LinkRouter')
const analyticRouter=require('./routes/AnalyticRouter')
const clickRouter=require('./routes/clickRouter')

app.use(cors())
const PORT=process.env.PORT || 3000


app.get("/",(req,res)=>{
    res.json({message:"First page of server"})
})

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api/user',userRouter)
app.use('/api/link',linkRouter)
app.use('/api/analytics',analyticRouter)
app.use('/api',clickRouter)

app.listen(PORT,(err)=>{
    if(err){
        console.log("Some error occured while creating server")
    }
    else{
        console.log(`Server is up and running on ${PORT}`)
        connectDB()
    }
})