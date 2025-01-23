const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const authMiddleware = require('../middleware/authentication')
const Link = require('../models/link')
const Analytic = require('../models/analytics')
const router = express.Router()


router.get("/myLinks", authMiddleware, async (req, res) => {
    try {

        const userId = new mongoose.Types.ObjectId(req.user.id)
        const links = await Link.find({ user: userId })
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
        console.log(shortString)
        const link = await Link.create({
            originalLink,
            shortLink: shortString,
            remarks,
            expiryDate,
            user: req.user.id
        })
        return res.status(200).json({ message: "Link created succesfully", link})
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
        res.status(400).json({ message: "Error in updating Link info" })
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
        return res.status(200).json({ message: "Deleted succesfully" })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ message: "Error in Deleting Link" })
    }
})

router.post("/:id", async (req, res) => {
    const { id } = req.params
    const {device } = req.body
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
        const link = await Link.findOne({shortLink:id})
        if (link) {
            link.clickCount += 1
            await link.save()

            const analytics = await Analytic.create({
                originalLink: link.originalLink,
                shortLink: link.shortLink,
                ipAddress,
                device,
                link: link._id,
                user: link.user
            })
            res.status(200).json({ success: true, link })
        }
        else {
            res.status(404).json({ success: false, message: 'Link not found' })
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ message: "Error updating analytics" })
    }

})

module.exports = router
