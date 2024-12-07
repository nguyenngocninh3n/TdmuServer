const mongoose = require('mongoose')
const Schema = mongoose.Schema

const notificationModel = new Schema({
    userID: String,
    targetID: String,
    content: String,
}, {timestamps: true})