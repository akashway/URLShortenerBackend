const express = require('express')
const Analytic = require('../models/analytics')
const Link = require('../models/link')
const router = express.Router()


router.get("/:id/clickresponse", async (req, res) => {
        return res.status(400).json({ message: "Link is not active" })
})

router.get("/:id", async (req, res) => {
    const { id } = req.params
    const userAgent = req.headers['user-agent'];
    const device = userAgent
    try {
        const link = await Link.findOne({ shortLink: id })
        if (link) {
            link.clickCount += 1
            await link.save()

            const analytics = await Analytic.create({
                originalLink: link.originalLink,
                shortLink: link.shortLink,
                ipAddress: req.ip,
                device,
                link: link._id,
                user: link.user
            })

            if (link.status === 'Active') {
                res.redirect(link.originalLink)
            }
            else {
                res.redirect(`http://localhost:3000/api/${id}/clickresponse`)
            }
            return
        }
        else {
            return res.status(404).json({ success: false, message: 'Link not foundddddd' })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ message: "Error updating analytics" })
    }
})

module.exports = router
