const mongoose = require('mongoose')


const analyticSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: () => Date.now()
    },
    originalLink: {
        type: String,
        required: true
    },
    shortLink: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
    },
    device: {
        type: String
    },
    link: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Link',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})


const Analytic = mongoose.model('Analytic', analyticSchema)

module.exports = Analytic