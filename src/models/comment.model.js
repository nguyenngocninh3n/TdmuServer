const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentModel = new Schema({
    parentID: {type: mongoose.Types.ObjectId, default: null},
    postID: mongoose.Types.ObjectId,
    userID: String,
    userName: String,
    avatar: String,
    content: {type: String, default: ''},
    attachments: {type: Array, default: []},
    reactions: {type: Array, default: []}
}, {timestamps: true})

module.exports = mongoose.model('Comment', commentModel)