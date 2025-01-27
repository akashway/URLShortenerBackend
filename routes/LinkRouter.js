const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const authMiddleware = require('../middleware/authentication')
const Link = require('../models/link')
const Analytic = require('../models/analytics')
const router = express.Router()



router.get("/myLinks", authMiddleware, async (req, res) => {
    const {limit,offset}=req.query
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id)
        const links = await Link.find({ user: userId }).skip((offset -1)*limit).limit(limit)
        return res.status(200).json(links)
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ message: "Error while fetching link" })
    }
})


router.post("/", authMiddleware, async (req, res) => {
    const { originalLink, remarks, expiryDate } = req.body
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedString = await bcrypt.hash(originalLink, salt)
        const shortString = hashedString.slice(0, 8)

        const today = new Date()
        const links = await Link.find({ expiryDate: { $lt: today } })
        for (let link of links) {
            if (link.expiryDate < today && link.status !== 'Inactive') {
                link.status = 'Inactive'
                await link.save()
            }
        }

        const link = await Link.create({
            originalLink,
            shortLink: shortString,
            remarks,
            expiryDate,
            user: req.user.id
        })
        return res.status(200).json({ message: "Link created succesfully", link })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ message: "Error while creating link" })
    }
})


// router.get("/:id", authMiddleware, async (req, res) => {
//     const { id } = req.params
//     try {
//         const isLinkExist = await Link.findOne({ shortLink: id })
//         if (!isLinkExist) {
//             return res.status(400).json({ message: "Invalid link" })
//         }
//         if (req.user.id !== isLinkExist.user.toString()) {
//             return res.status(400).json({ message: "You are not owning this link" })
//         }
//         return res.status(200).json({ messgae: "Link clicked noticed" })
//     }
//     catch (err) {
//         console.log(err)
//         return res.status(400).json({ message: "Error while creating link" })
//     }
// })


router.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params
    const { originalLink, remarks, expiryDate } = req.body

    try {
        const link = await Link.findById(id)

        if (!link) {
            return res.status(400).json({ message: "No such links exits with given id" })
        }

        if (link.user.toString() !== req.user.id) {
            return res.status(400).json({ message: "You are not owning this link" })
        }

        await Link.findByIdAndUpdate(id, {
            originalLink,
            remarks,
            expiryDate
        })
        return res.status(200).json({ message: "Updates succesfully" })

    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ message: "Error in updating Link info" })
    }

})


router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params

    try {
        const link = await Link.findById(id)

        if (!link) {
            return res.status(400).json({ message: "No such links exits with given id" })
        }

        if (link.user.toString() !== req.user.id) {
            return res.status(400).json({ message: "You are not owning this link" })
        }

        await Link.findByIdAndDelete(id)
        await Analytic.deleteMany({ link: id })
        return res.status(200).json({ message: "Deleted succesfully from Link and Analytics also" })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ message: "Error in Deleting Link" })
    }
})


router.get("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params
    try {
        const link = await Link.findById(id)

        if (!link) {
            return res.status(400).json({ message: "No such links exits with given id" })
        }

        if (link.user.toString() !== req.user.id) {
            return res.status(400).json({ message: "You are not owning this link" })
        }
        return res.status(200).json(link)
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ message: "Error in finding link" })
    }
})

module.exports = router
