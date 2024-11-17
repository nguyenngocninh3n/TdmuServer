const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChatDataModel = new Schema({
    senderID: String,
    message: String,
    type: String,
}, {timestamps: true})

module.exports = ChatDataModel
