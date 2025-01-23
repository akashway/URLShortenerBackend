const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const authMiddleware = require('../middleware/authentication')
const dotenv = require('dotenv')
dotenv.config()



router.get("/me", authMiddleware, async (req, res) => {

    try {
        const userId = req.user.id
        const user = await User.findById(userId)

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        res.status(200).json({
            id: user._id,
            name: user.name,
            mobile: user.mobile,
            email: user.email
        })
    }

    catch (err) {
        console.log(err)
        res.status(400).json({ message: "Error retrieving user information" })
    }
})


router.post('/register', async (req, res) => {
    const { name, email, mobile, password } = req.body

    try {
        const isUserExists = await User.findOne({ email })

        if (isUserExists) {
            return res.status(400).json({ message: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            name,
            email,
            mobile,
            password: hashedPassword
        })

        return res.status(200).json({ message: "User created succesfully" })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ message: "Error while adding user" })

    }
})


router.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "Entered email or password wrong" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Entered email or password wrong" })
        }
        const payload = {
            id: user._id
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.status(200).json({ token })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ message: "Error while Login" })

    }
})


router.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params
    const { name, email, mobile } = req.body

    console.log(req.user.id)
    console.log(id)

    if (req.user.id !== id) {
        return res.status(400).json({ message: "You can only update your own account." })
    }

    const user = await User.findById(id)

    if (!user) {
        return res.status(400).json({ message: "User not found" })
    }

    try {
        await User.findByIdAndUpdate(id, {
            name,
            email,
            mobile
        })
        res.status(200).json({ message: "User Updated" });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: "Error in updating user info" });
    }
})


router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params

    

    try {
        if (req.user.id !== id) {
            return res.status(400).json({ message: "You can only delete your own account." })
        }
        const user = await User.findById(id)

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        await User.findByIdAndDelete(id)
        res.status(200).json({ message: "User Deleted" });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: "Error in deleting user" });
    }
})

module.exports = router