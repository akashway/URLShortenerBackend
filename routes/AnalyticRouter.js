const express = require('express')
const mongoose = require('mongoose')
const Analytic = require('../models/analytics')
const authMiddleware = require('../middleware/authentication')
const router = express.Router()


router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id)
        const analytics = await Analytic.find({ user: userId }) 
        return res.status(200).json(analytics)
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ message: "Error while fetching Analytics" })
    }
})

router.get("/total-clicks",authMiddleware,async(req,res)=>{
    try{
        const result=await Analytic.aggregate([
            {
                $group:{
                    _id:null,
                    total:{
                        $sum:1
                    }
                }
            }
        ])
        return res.status(200).json(result)
    }
    catch(err){
        console.log(err)
        return res.status(400).json({ message: "Error while counting total click" })
    }
})


router.get("/day-wise",authMiddleware, async (req, res) => {
    try {
        const result = await Analytic.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%d-%m-%Y',
                            date: "$timestamp"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            }
        ])
        return res.status(200).json(result)
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({ message: "Error while counting data day wise" })
    }
})


router.get("/device-wise",authMiddleware, async (req, res) => {
    try {
        const result = await Analytic.aggregate([
            {
                $group: {
                    _id: "$device",
                    count: {
                        $sum: 1
                    }
                }
            }
        ])

        return res.status(200).json(result)

    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ message: "Error while counting data device wise" })
    }
})


module.exports = router