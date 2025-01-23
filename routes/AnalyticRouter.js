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


module.exports = router