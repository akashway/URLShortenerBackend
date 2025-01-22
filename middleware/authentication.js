const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config()

const authMiddleware=(req,res,next)=>{
    const token=req.headers.authorization

    if(!token){
        return res.status(400).json({message:"This action not allowed"})
    }

    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decode
        next()
    }
    catch(err){
        res.status(400).json({message:"Inavlid Token"})
    }
}


module.exports=authMiddleware